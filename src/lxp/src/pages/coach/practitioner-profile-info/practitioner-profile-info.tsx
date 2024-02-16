import { useHistory, useLocation } from 'react-router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDialog, useSnackbar, useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  ProfileAvatar,
  renderIcon,
  StatusChip,
  Typography,
  StackedList,
  Card,
  ActionModal,
} from '@ecdlink/ui';
import { NoteTypeEnum } from '@ecdlink/graphql';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { PractitionerProfileRouteState } from './practitioner-profile-info.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './practitioner-profile-info.styles';
import ROUTES from '@routes/routes';
import { PhoneIcon } from '@heroicons/react/solid';
import { CreateNote } from './components/create-note/create-note';
import { RemovePractioner } from './components/remove-practitioner/remove-practitioner';
import { getLastNoteDate } from '@utils/child/child-profile-utils';
import { notesSelectors } from '@store/notes';
import { useSelector } from 'react-redux';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { classroomsSelectors } from '@/store/classroom';
import { CoachPractitionerNotRegistered } from './components/coach-practitioner-not-registered/coach-practitioner-not-registered';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { traineeSelectors, traineeThunkActions } from '@/store/trainee';
import { timelineSteps } from '@/pages/trainee/trainee-onboarding/components/trainee-onboarding-dashboard/timeline-steps';
import { CoachTraineeOnboarding } from './components/trainee-timeline/trainee-onboarding';
import { useAppDispatch } from '@/store';
import {
  addDays,
  format,
  isFriday,
  isPast,
  isSameDay,
  isToday,
  isWeekend,
  nextMonday,
  sub,
} from 'date-fns';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import { getPractitionerTimeline } from '@/store/pqa/pqa.actions';
import { clubSelectors, clubThunkActions } from '@/store/club';
import { getActivityMeetRegularDetails } from '@/store/club/club.actions';
import { PractitionerDelicensed } from './practitioner-delicensed/practitioner-delicensed';

export const CoachPractitionerProfileInfo: React.FC = () => {
  const dialog = useDialog();
  const appDispatch = useAppDispatch();
  const history = useHistory();

  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const classroom = useSelector(classroomsSelectors?.getClassroom);
  const practitionerId = location.state.practitionerId;
  const isFromProgrammeView = location.state.isFromProgrammeView;
  const isFromReassignView = location?.state?.isFromReassignView;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);

  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );

  const isPrincipal = practitioner?.isPrincipal === true;
  const [practitionerClassroomDetails, setPractitionerClassroomDetails] =
    useState<any>();
  const [isToRemoveSmartStarter, setIsToRemoveSmartStarter] =
    useState<boolean>(false);
  const [delicenseDate, setDelicenseDate] = useState<Date>();

  const isTrainee = practitioner?.isTrainee;
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);

  const showBusinessItem =
    practitioner?.isFundaAppAdmin || practitioner?.isPrincipal;
  const isOnStipend = practitioner?.isOnStipend;
  const traineeVisits = timeline?.traineeVisits;
  const traineeCurrentVisit = traineeVisits?.[0];

  const practitionerClub = useSelector(
    clubSelectors.getClubByIdSelector(practitioner?.clubId || '')
  );

  const timelineStepsArray = timelineSteps(
    timeline!,
    // @ts-ignore,
    false,
    isOnline,
    // @ts-ignore
    undefined,
    '',
    isOnStipend
  );
  const completedSteps = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined
  ).filter(
    (item) =>
      item?.type === 'completed' ||
      item?.title === 'Consolidation meeting attended'
  );
  const onboardingNotCompleted = completedSteps?.length < 8;
  const twoWeeksAgo = addDays(new Date(), -14);
  const fourWeeksAgo = addDays(new Date(), -28);
  const starterLicenseDate = timeline?.starterLicenseDate
    ? new Date(timeline?.starterLicenseDate)
    : new Date();
  const onboardingIncompleteAfter2Weeks =
    onboardingNotCompleted && starterLicenseDate < twoWeeksAgo;
  const onboardingIncompleteAfter4Weeks =
    onboardingNotCompleted && starterLicenseDate < fourWeeksAgo;

  const [showTraineeDashboard, setShowTraineeDashboard] = useState(false);

  const { theme } = useTheme();
  const { showMessage } = useSnackbar();

  const [createPractitionerNoteVisible, setCreatePractitionerdNoteVisible] =
    useState<boolean>(false);

  const [removePractionerReasonsVisible, setRemovePractionerReasonsVisible] =
    useState<boolean>(false);

  const notes = useSelector(notesSelectors.getNotesByUserId(practitionerId));
  const practitionerAbsentees = practitioner?.absentees;

  useEffect(() => {
    appDispatch(getPractitionerTimeline({ userId: practitionerId }));
  }, [appDispatch, practitionerId]);

  const practitionerTimeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );

  // Check if the practitioner needs to be removed for whatever reason
  useEffect(() => {
    if (!practitionerTimeline) {
      return;
    }

    const attendedPqaVisits = practitionerTimeline?.pQASiteVisits?.filter(
      (visit) => !!visit?.attended
    );
    const attendedReaccreditationVisits =
      practitionerTimeline?.reAccreditationVisits?.filter(
        (visit) => !!visit?.attended
      );

    const lastPqa = attendedPqaVisits?.[attendedPqaVisits?.length - 1];

    const previousPqa = attendedPqaVisits?.[attendedPqaVisits?.length - 2];

    const lastReaccreditation =
      attendedReaccreditationVisits?.[
        attendedReaccreditationVisits?.length - 1
      ];

    const previousReaccreditation =
      attendedReaccreditationVisits?.[
        attendedReaccreditationVisits?.length - 2
      ];

    if (
      !!lastPqa?.delicenseQuestionAnswered ||
      (lastPqa?.overallRatingColor === 'Error' &&
        previousPqa?.overallRatingColor === 'Error')
    ) {
      setIsToRemoveSmartStarter(true);
      setDelicenseDate(new Date(lastPqa.insertedDate));
    }

    if (
      !!lastReaccreditation?.delicenseQuestionAnswered ||
      (lastReaccreditation?.overallRatingColor === 'Error' &&
        previousReaccreditation?.overallRatingColor === 'Error')
    ) {
      setIsToRemoveSmartStarter(true);
      setDelicenseDate(new Date(lastReaccreditation.insertedDate));
    }
  }, [practitionerTimeline]);

  const validAbsenteesDates = practitionerAbsentees?.filter(
    (item) =>
      !isPast(new Date(item?.absentDate as string)) ||
      isToday(new Date(item?.absentDate as string)) ||
      (new Date(item?.absentDateEnd as string) >=
        sub(new Date(), {
          days: 8,
        }) &&
        item?.absentDate !== item?.absentDateEnd)
  );

  const classroomGroupsForUser = useSelector(
    classroomsSelectors.getClassroomGroupsForUser(practitionerId || '')
  );

  const currentDates = validAbsenteesDates?.map((item) => {
    return item?.absentDate as string;
  });

  const orderedDates = currentDates?.sort(function (a, b) {
    return Date.parse(a) - Date.parse(b);
  });

  const currentAbsentee = validAbsenteesDates?.find(
    (item) => item?.absentDate === orderedDates?.[0]
  ) as AbsenteeDto;

  const classesWithAbsence =
    validAbsenteesDates &&
    Object.values(
      validAbsenteesDates?.reduce(
        (acc, obj) => ({ ...acc, [obj.absentDate as string]: obj }),
        {}
      )
    );

  classesWithAbsence?.sort(function (a, b) {
    return a?.absentDate?.localeCompare(b?.absentDate);
  });

  const absenceIsToday = isSameDay(
    new Date(),
    new Date(currentAbsentee?.absentDate || '')
  );

  const isLeave = useMemo(
    () => currentAbsentee?.absentDate !== currentAbsentee?.absentDateEnd,
    [currentAbsentee?.absentDate, currentAbsentee?.absentDateEnd]
  );

  const isOnLeave =
    isLeave &&
    (isPast(new Date(currentAbsentee?.absentDate as string)) ||
      isToday(new Date(currentAbsentee?.absentDate as string))) &&
    !isPast(new Date(currentAbsentee?.absentDateEnd as string));

  const handleReassignClass = useCallback(
    (practitionerId: string, allAbsenteeClasses?: AbsenteeDto[]) => {
      if (allAbsenteeClasses) {
        history.push('practitioner-reassign-class', {
          practitionerId,
          allAbsenteeClasses,
        });
        return;
      }
      history.push('practitioner-reassign-class', {
        practitionerId,
      });
    },
    [history]
  );

  const updatedUserReassigned = useCallback(async () => {
    if (isFromReassignView) {
      await appDispatch(
        practitionerThunkActions.getAllPractitioners({})
      ).unwrap();
    }
  }, [appDispatch, isFromReassignView]);

  useEffect(() => {
    updatedUserReassigned();
  }, [updatedUserReassigned]);

  const handleAbsenceModal = useCallback(
    (item: AbsenteeDto) => {
      const absenceClasses = validAbsenteesDates?.filter(
        (absence) => absence?.absenteeId === item?.absenteeId
      );
      dialog({
        position: DialogPosition.Middle,
        render: (onSubmit, onCancel) => (
          <ActionModal
            icon={'InformationCircleIcon'}
            iconColor="alertMain"
            iconBorderColor="alertBg"
            importantText={`What would you like to edit?`}
            actionButtons={[
              {
                text: 'Edit this absence',
                textColour: 'white',
                colour: 'primary',
                type: 'filled',
                onClick: () => {
                  handleReassignClass(practitionerId, absenceClasses);
                  onSubmit();
                },
                leadingIcon: 'PencilAltIcon',
              },
              {
                text: 'Add a new leave/absence',
                textColour: 'primary',
                colour: 'primary',
                type: 'outlined',
                onClick: () => {
                  handleReassignClass(practitionerId);
                  onSubmit();
                },
                leadingIcon: 'PlusIcon',
              },
            ]}
          />
        ),
      });
    },
    [dialog, handleReassignClass, practitionerId, validAbsenteesDates]
  );

  const call = () => {
    window.open(`tel:${practitioner?.user?.phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(
        practitioner?.user?.phoneNumber ?? ''
      )}`
    );
  };

  useEffect(() => {
    const getTraineeTimeline = async () =>
      await appDispatch(
        traineeThunkActions.getTraineeTimeline({
          userId: practitioner?.userId ? practitioner?.userId : '',
        })
      );

    const getTraineeVisitDate = async () =>
      await appDispatch(
        traineeThunkActions.getTraineeVisitData({
          visitId: traineeCurrentVisit?.id,
        })
      );

    getTraineeTimeline();
    getTraineeVisitDate();
  }, [appDispatch, practitioner?.userId, traineeCurrentVisit?.id]);

  // Load club points, we need them so we can calculate action items for this practitioner
  useEffect(() => {
    if (isOnline && !!practitioner && !!practitioner.clubId) {
      appDispatch(
        clubThunkActions.getActivityHostFamilyDetails({
          clubId: practitioner.clubId,
        })
      );

      appDispatch(
        getActivityMeetRegularDetails({
          forceReload: true,
          args: {
            clubId: practitioner.clubId,
            month: 0,
            year: new Date().getFullYear(),
          },
        })
      );
    }
  }, []);

  const classroomsDetailsForPractitioner = async () => {
    setPractitionerClassroomDetails(classroomGroupsForUser);

    return classroomGroupsForUser;
  };

  useEffect(() => {
    classroomsDetailsForPractitioner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <OnlineOnlyModal
            overrideText={'You need to go online to use this feature.'}
            onSubmit={onSubmit}
          ></OnlineOnlyModal>
        );
      },
    });
  };

  const navigateClassroom = () => {
    if (isOnline) {
      history.push(ROUTES.COACH.PRACTITIONER_CLASSROOM, {
        practitionerId,
      });
    } else {
      showOnlineOnly();
    }
  };

  const navigateBusiness = () => {
    if (isOnline) {
      history.push(
        ROUTES.COACH.PRACTITIONER_BUSINESS.BUSINESS.replace(
          ':userId',
          practitionerId
        )
      );
    } else {
      showOnlineOnly();
    }
  };

  const navigateJourney = () => {
    if (isOnline) {
      history.push(
        ROUTES.COACH.PRACTITIONER_JOURNEY.replace(
          ':practitionerId',
          practitionerId
        )
      );
    } else {
      showOnlineOnly();
    }
  };

  const listItems = [
    {
      title: 'SmartStarter journey',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: 'Training, PQA rating & performance',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'BadgeCheckIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      iconBackgroundColor: 'tertiary',
      chipConfig: {
        colorPalette: {
          backgroundColour: 'white',
          borderColour: 'errorMain',
          textColour: 'white',
        },
      },
      text: '1',
      onActionClick: () =>
        onboardingNotCompleted && isTrainee
          ? setShowTraineeDashboard(true)
          : navigateJourney(),
      classNames: 'bg-uiBg',
    },
    {
      title: 'Classroom',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: !isTrainee ? 'Children, progress & attendance' : 'Children',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'AcademicCapIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      iconBackgroundColor: 'tertiary',
      chipConfig: {
        colorPalette: {
          backgroundColour: 'white',
          borderColour: 'errorMain',
          textColour: 'white',
        },
      },
      text: '1',
      onActionClick: () => navigateClassroom(),
      classNames: 'bg-uiBg',
    },
  ];

  if (!isTrainee) {
    listItems?.push({
      title: 'Programme Information',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: 'Location, classes & staff',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'InformationCircleIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      iconBackgroundColor: 'tertiary',
      chipConfig: {
        colorPalette: {
          backgroundColour: 'white',
          borderColour: 'errorMain',
          textColour: 'white',
        },
      },
      text: '1',
      classNames: 'bg-uiBg',
      onActionClick: () => {
        if (isOnline) {
          history.push(ROUTES.COACH.PROGRAMME_INFORMATION, {
            practitionerId,
          });
        } else {
          showOnlineOnly();
        }
      },
    });
  }

  if (onboardingNotCompleted && isTrainee) {
    listItems?.splice(0, 1, {
      title: 'Trainee onboarding',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: onboardingIncompleteAfter4Weeks
        ? 'Remove trainee'
        : onboardingIncompleteAfter2Weeks
        ? 'Incomplete after 2 weeks'
        : `${completedSteps?.length + 1} of ${
            timelineStepsArray?.length + 1
          } steps completed`,
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: onboardingIncompleteAfter2Weeks
        ? 'ExclamationIcon'
        : 'BadgeCheckIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      iconBackgroundColor: onboardingIncompleteAfter2Weeks
        ? 'alertMain'
        : 'tertiary',
      chipConfig: {
        colorPalette: {
          backgroundColour: 'white',
          borderColour: 'errorMain',
          textColour: 'white',
        },
      },
      text: '1',
      onActionClick: () =>
        onboardingNotCompleted && isTrainee
          ? setShowTraineeDashboard(true)
          : history.push(
              ROUTES.COACH.PRACTITIONER_JOURNEY.replace(
                ':practitionerId',
                practitionerId
              )
            ),
      classNames: 'bg-uiBg',
    });
  }

  if (showBusinessItem && !isTrainee) {
    listItems?.push({
      title: 'Business',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: `Business, Income & expenses`,
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'BriefcaseIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      iconBackgroundColor: 'tertiary',
      chipConfig: {
        colorPalette: {
          backgroundColour: 'white',
          borderColour: 'errorMain',
          textColour: 'white',
        },
      },
      text: '1',
      onActionClick: () => navigateBusiness(),
      classNames: 'bg-uiBg',
    });
  }

  const noClassroomGroupsListItems = [
    {
      title: 'SmartStarter journey',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: 'Training, PQA rating & performance',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'BadgeCheckIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      iconBackgroundColor: 'tertiary',
      chipConfig: {
        colorPalette: {
          backgroundColour: 'white',
          borderColour: 'errorMain',
          textColour: 'white',
        },
      },
      text: '1',
      onActionClick: () =>
        history.push(
          ROUTES.COACH.PRACTITIONER_JOURNEY.replace(
            ':practitionerId',
            practitionerId
          )
        ),
      classNames: 'bg-uiBg',
    },
    {
      title: 'Programme Information',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: 'Location, classes & staff',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'InformationCircleIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      iconBackgroundColor: 'tertiary',
      chipConfig: {
        colorPalette: {
          backgroundColour: 'white',
          borderColour: 'errorMain',
          textColour: 'white',
        },
      },
      text: '1',
      onActionClick: () => {
        if (isOnline) {
          history.push(ROUTES.COACH.PROGRAMME_INFORMATION, {
            practitionerId,
          });
        } else {
          showOnlineOnly();
        }
      },
      classNames: 'bg-uiBg',
    },
  ];

  listItems?.push({
    title: 'Club',
    titleStyle: 'text-textDark font-semibold text-base leading-snug',
    subTitle: !!practitionerClub
      ? practitionerClub.name
      : 'Not assigned to a club',
    subTitleStyle:
      'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
    menuIcon: 'UserGroupIcon',
    menuIconClassName: 'text-white',
    showIcon: true,
    iconBackgroundColor: 'tertiary',
    chipConfig: {
      colorPalette: {
        backgroundColour: 'alertMain',
        borderColour: 'alertMain',
        textColour: 'white',
      },
    },
    text: '',
    onActionClick: () =>
      history.push(
        ROUTES.COMMUNITY.CLUB.MEMBER[!!practitionerClub ? 'ROOT' : 'ADD']
          .replace(':practitionerId', practitionerId)
          .replace(':clubId', practitioner?.clubId || 'new')
      ),
    classNames: 'bg-uiBg',
  });

  const onCreatePractitionerNoteBack = () => {
    setCreatePractitionerdNoteVisible(false);
  };

  const handleComebackDay = useCallback((date: Date) => {
    if (isFriday(new Date(date)) || isWeekend(new Date(date))) {
      return nextMonday(new Date(date));
    }

    return new Date(addDays(new Date(date), 1));
  }, []);

  const practitionerNotRegistered =
    (practitioner?.isRegistered === null ||
      practitioner?.isRegistered === false) &&
    !isTrainee;

  return (
    <>
      {isToRemoveSmartStarter && (
        <PractitionerDelicensed
          practitioner={practitioner!}
          delicenseDate={delicenseDate!}
        />
      )}
      {practitionerNotRegistered && (
        <CoachPractitionerNotRegistered
          practitioner={practitioner}
          classroom={classroom}
        />
      )}
      {!isToRemoveSmartStarter && !practitionerNotRegistered && (
        <div className={styles.contentWrapper}>
          <BannerWrapper
            showBackground={true}
            backgroundUrl={theme?.images.graphicOverlayUrl}
            title={`${practitioner?.user?.firstName} ${practitioner?.user?.surname}`}
            color={'primary'}
            size="medium"
            renderBorder={true}
            renderOverflow={false}
            onBack={() =>
              isFromProgrammeView
                ? history.goBack()
                : history.push(ROUTES.COACH.PRACTITIONERS)
            }
            displayOffline={!isOnline}
          >
            <div className={styles.avatarWrapper}>
              <ProfileAvatar
                hasConsent={true}
                canChangeImage={false}
                dataUrl={practitioner?.user?.profileImageUrl || ''}
                size={'header'}
                onPressed={() => {}}
              />
            </div>

            <div className={styles.chipsWrapper}>
              <StatusChip
                backgroundColour="primary"
                borderColour="primary"
                text={isTrainee ? 'Trainee' : 'SmartStarter'}
                textColour={'white'}
                className={'px-3 py-1.5'}
              />
              {isPrincipal && (
                <StatusChip
                  backgroundColour="secondary"
                  borderColour="secondary"
                  text={`Owner`}
                  textColour={'white'}
                  className={'mr-2 px-3 py-1.5'}
                />
              )}
            </div>
            <div className={styles.contactButtons}>
              <Button
                color={'primary'}
                type={'outlined'}
                className={'rounded-2xl'}
                size={'small'}
                onClick={call}
              >
                <PhoneIcon
                  className="text-primary h-5 w-5"
                  aria-hidden="true"
                />
              </Button>
              <Button
                color={'primary'}
                type={'outlined'}
                className={'rounded-2xl'}
                size={'small'}
                onClick={whatsapp}
              >
                <img
                  src={getLogo(LogoSvgs.whatsapp)}
                  alt="whatsapp"
                  className={styles.buttonIconStyle}
                />
              </Button>
            </div>
            {currentAbsentee && (
              <div className="p-4">
                {classesWithAbsence?.map((item: AbsenteeDto) => {
                  const practitionerAbsenteeClasses =
                    practitionerAbsentees?.filter(
                      (absence) => absence?.absentDate === item?.absentDate
                    );

                  const absenceIsUntilSevenDaysPast = isPast(
                    new Date(item?.absentDateEnd as string)
                  );

                  if (absenceIsUntilSevenDaysPast) {
                    return (
                      <>
                        <Card className={'bg-uiBg mt-4 w-full rounded-xl'}>
                          <div className={'p-4'}>
                            <Typography
                              type={'h1'}
                              color="textDark"
                              text={`Contact ${practitioner?.user?.firstName} to find out if they have returned from leave`}
                              className={'mt-6 ml-4'}
                            />
                            <div className="flex items-center gap-2">
                              <Typography
                                type={'body'}
                                color="textMid"
                                weight="bold"
                                text={`Start date:`}
                                className={'mt-4 ml-4'}
                              />
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={`${format(
                                  new Date(item?.absentDate as Date),
                                  'd MMM yyyy'
                                )}`}
                                className={'mt-4'}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Typography
                                type={'body'}
                                color="textMid"
                                weight="bold"
                                text={`End date:`}
                                className={'mt-4 ml-4'}
                              />
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={`${format(
                                  new Date(
                                    handleComebackDay(
                                      item?.absentDateEnd as Date
                                    )
                                  ),
                                  'd MMM yyyy'
                                )}`}
                                className={'mt-4'}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Typography
                                type={'body'}
                                color="textMid"
                                weight="bold"
                                text={`Reason:`}
                                className={'mt-4 ml-4'}
                              />
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={`${item?.reason}`}
                                className={'mt-4'}
                              />
                            </div>
                            <div>
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={`Contact ${practitioner?.user?.firstName} to make sure they have returned.`}
                                className={'px-4 pt-2'}
                              />
                            </div>
                            <div className="flex justify-center">
                              <Button
                                type="filled"
                                color="primary"
                                className={'mt-6 mb-6 w-11/12 rounded-2xl'}
                                onClick={call}
                              >
                                {renderIcon(
                                  'PencilAltIcon',
                                  'w-5 h-5 color-white text-white mr-1'
                                )}
                                <Typography
                                  type="body"
                                  className="mr-4"
                                  color="white"
                                  text={`Contact ${practitioner?.user?.firstName}`}
                                ></Typography>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </>
                    );
                  }

                  if (absenceIsToday && !isOnLeave) {
                    return (
                      <>
                        <Card className={'bg-uiBg mt-4 w-full rounded-xl'}>
                          <div className={'p-4'}>
                            <Typography
                              type={'h1'}
                              color="textDark"
                              text={`${practitioner?.user?.firstName} is absent today`}
                              className={'mt-6 ml-4'}
                            />
                            <div className="flex items-center gap-2">
                              <Typography
                                type={'body'}
                                color="textMid"
                                weight="bold"
                                text={`Reason:`}
                                className={'mt-4 ml-4'}
                              />
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={`${currentAbsentee?.reason}`}
                                className={'mt-4'}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Typography
                                type={'body'}
                                color="textMid"
                                weight="bold"
                                text={`${practitioner?.user?.firstName} will be back on:`}
                                className={'mt-4 ml-4'}
                              />
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={`${format(
                                  new Date(
                                    handleComebackDay(
                                      item?.absentDateEnd as Date
                                    )
                                  ),
                                  'd MMM yyyy'
                                )}`}
                                className={'mt-4'}
                              />
                            </div>
                            {isPrincipal && (
                              <div className="flex justify-center">
                                <Button
                                  type="filled"
                                  color="primary"
                                  className={'mt-6 mb-6 w-11/12 rounded-2xl'}
                                  onClick={() => handleAbsenceModal(item)}
                                >
                                  {renderIcon(
                                    'PencilAltIcon',
                                    'w-5 h-5 color-white text-white mr-1'
                                  )}
                                  <Typography
                                    type="body"
                                    className="mr-4"
                                    color="white"
                                    text={'Edit absence/leave'}
                                  ></Typography>
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      </>
                    );
                  }

                  if (isOnLeave) {
                    return (
                      <>
                        <Card className={'bg-uiBg mt-4 w-full rounded-xl'}>
                          <div className={'p-4'}>
                            <Typography
                              type={'h1'}
                              color="textDark"
                              text={`${practitioner?.user?.firstName} is on leave`}
                            />
                            <div className="flex items-center gap-2">
                              <Typography
                                type="h4"
                                color="textMid"
                                weight="bold"
                                text={`Start date:`}
                                className={'mt-4'}
                              />
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={`${format(
                                  new Date(item?.absentDate as Date),
                                  'd MMM yyyy'
                                )}`}
                                className={'mt-4'}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Typography
                                type="h4"
                                color="textMid"
                                weight="bold"
                                text={`End date:`}
                                className={'mt-4'}
                              />
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={`${format(
                                  new Date(
                                    handleComebackDay(
                                      item?.absentDateEnd as Date
                                    )
                                  ),
                                  'd MMM yyyy'
                                )}`}
                                className={'mt-4'}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Typography
                                type="h4"
                                color="textMid"
                                weight="bold"
                                text={`Reason:`}
                                className={'mt-4'}
                              />
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={`${item?.reason}`}
                                className={'mt-4'}
                              />
                            </div>
                            <div className="mt-4 flex flex-wrap">
                              <Typography
                                type="h4"
                                color="textMid"
                                weight="bold"
                                text={`${item?.className} class reassigned to:`}
                                className="flex-grow"
                              />
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={item?.reassignedToPerson}
                                className="flex-glow"
                              />
                            </div>
                            {isPrincipal && (
                              <div className="flex justify-center">
                                <Button
                                  type="filled"
                                  color="primary"
                                  className={'mt-6 mb-6 w-11/12 rounded-2xl'}
                                  onClick={() => handleAbsenceModal(item)}
                                >
                                  {renderIcon(
                                    'PencilAltIcon',
                                    'w-5 h-5 color-white text-white mr-1'
                                  )}
                                  <Typography
                                    type="body"
                                    className="mr-4"
                                    color="white"
                                    text={'Edit absence/leave'}
                                  ></Typography>
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      </>
                    );
                  }

                  if (!isOnLeave && item?.absentDate === item?.absentDateEnd) {
                    return (
                      <>
                        <Card className={'bg-uiBg mt-4 w-full rounded-xl'}>
                          <div className={'p-4'}>
                            <Typography
                              type={'h1'}
                              color="textDark"
                              text={`${
                                practitioner?.user?.firstName
                              } will be absent on ${
                                currentAbsentee?.absentDate &&
                                format(
                                  new Date(item?.absentDate as string),
                                  'EEEE'
                                )
                              }, ${
                                item?.absentDate &&
                                format(
                                  new Date(item?.absentDate as string),
                                  'd MMM'
                                )
                              }`}
                              className={'mt-6 ml-4'}
                            />
                            <div className="flex items-center gap-2">
                              <Typography
                                type={'body'}
                                color="textMid"
                                weight="bold"
                                text={`Reason:`}
                                className={'mt-4 ml-4'}
                              />
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={`${item?.reason}`}
                                className={'mt-4'}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Typography
                                type={'body'}
                                color="textMid"
                                weight="bold"
                                text={`${practitioner?.user?.firstName} will be back on:`}
                                className={'mt-4 ml-4'}
                              />
                              <Typography
                                type={'body'}
                                color="textMid"
                                text={`${
                                  item?.absentDateEnd &&
                                  format(
                                    new Date(
                                      handleComebackDay(
                                        item?.absentDateEnd as Date
                                      )
                                    ),
                                    'd MMM yyyy'
                                  )
                                }`}
                                className={'mt-4'}
                              />
                            </div>
                            {isPrincipal && (
                              <div className="flex justify-center">
                                <Button
                                  type="filled"
                                  color="primary"
                                  className={'mt-6 mb-6 w-11/12 rounded-2xl'}
                                  onClick={() => handleAbsenceModal(item)}
                                >
                                  {renderIcon(
                                    'PencilAltIcon',
                                    'w-5 h-5 color-white text-white mr-1'
                                  )}
                                  <Typography
                                    type="body"
                                    className="mr-4"
                                    color="white"
                                    text={'Edit absence/leave'}
                                  ></Typography>
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      </>
                    );
                  }

                  return (
                    <>
                      <Card className={'bg-uiBg mt-4 w-full rounded-xl'}>
                        <div className={'p-4'}>
                          <Typography
                            type={'h1'}
                            color="textDark"
                            text={`${practitioner?.user?.firstName} will be on leave`}
                            className={'mt-4 ml-4'}
                          />
                          <div className="flex items-center gap-2">
                            <Typography
                              type={'body'}
                              color="textMid"
                              weight="bold"
                              text={`Start date:`}
                              className={'mt-4 ml-4'}
                            />
                            <Typography
                              type={'body'}
                              color="textMid"
                              text={`${format(
                                new Date(item?.absentDate as Date),
                                'd MMM yyyy'
                              )}`}
                              className={'mt-4'}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Typography
                              type={'body'}
                              color="textMid"
                              weight="bold"
                              text={`End date:`}
                              className={'mt-4 ml-4'}
                            />
                            <Typography
                              type={'body'}
                              color="textMid"
                              text={`${format(
                                new Date(
                                  handleComebackDay(item?.absentDateEnd as Date)
                                ),
                                'd MMM yyyy'
                              )}`}
                              className={'mt-4'}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Typography
                              type={'body'}
                              color="textMid"
                              weight="bold"
                              text={`Reason:`}
                              className={'mt-4 ml-4'}
                            />
                            <Typography
                              type={'body'}
                              color="textMid"
                              text={`${item?.reason}`}
                              className={'mt-4'}
                            />
                          </div>
                          {item?.className &&
                            practitionerAbsenteeClasses?.map(
                              (classroomGroup) => (
                                <div className="flex items-center gap-2">
                                  <Typography
                                    type={'body'}
                                    color="textMid"
                                    weight="bold"
                                    text={`${classroomGroup?.className} class reassigned to:`}
                                    className={'mt-4 ml-4'}
                                  />
                                  <Typography
                                    type={'body'}
                                    color="textMid"
                                    text={`${classroomGroup?.reassignedToPerson}`}
                                    className={'mt-4'}
                                  />
                                </div>
                              )
                            )}
                          {isPrincipal && (
                            <div className="flex justify-center">
                              <Button
                                type="filled"
                                color="primary"
                                className={'mt-6 mb-6 w-11/12 rounded-2xl'}
                                onClick={() => handleAbsenceModal(item)}
                              >
                                {renderIcon(
                                  'PencilAltIcon',
                                  'w-5 h-5 color-white text-white mr-1'
                                )}
                                <Typography
                                  type="body"
                                  className="mr-4"
                                  color="white"
                                  text={'Edit absence/leave'}
                                ></Typography>
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    </>
                  );
                })}
              </div>
            )}
          </BannerWrapper>
          <div className="mt-4 flex justify-center">
            <div className="w-11/12">
              <StackedList
                className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
                type="MenuList"
                listItems={
                  practitionerClassroomDetails?.length > 0
                    ? listItems
                    : noClassroomGroupsListItems
                }
              />
            </div>
          </div>

          <>
            <div className={styles.infoWrapper}>
              <div>
                <Typography
                  text={'Cellphone number'}
                  type="h5"
                  color="textMid"
                  className={'mt-4'}
                />
                <Typography
                  text={practitioner?.user?.phoneNumber}
                  type="h4"
                  color="textDark"
                  className={'mt-1'}
                />
              </div>
              <div>
                <Button
                  size="small"
                  shape="normal"
                  color="secondaryAccent2"
                  type="filled"
                  onClick={() => {
                    //TODO: what if copy fails?
                    navigator?.clipboard?.writeText &&
                      navigator?.clipboard?.writeText(
                        practitioner?.user?.phoneNumber!
                      );
                  }}
                >
                  <Typography
                    className={'mr-1'}
                    type="buttonSmall"
                    color="secondary"
                    text="Copy"
                  />
                  {renderIcon('DocumentDuplicateIcon', styles.actionIcon)}
                </Button>
              </div>
            </div>
            <Divider dividerType="dashed" className="my-4" />
            <div className={styles.infoWrapper}>
              <div>
                <Typography
                  text={'Email address'}
                  type="h5"
                  color="textMid"
                  className={'mt-1'}
                />
                <Typography
                  text={practitioner?.user?.email}
                  type="h4"
                  color="textDark"
                  className={'mt-1'}
                />
              </div>
              <div>
                <Button
                  size="small"
                  shape="normal"
                  color="secondaryAccent2"
                  type="filled"
                  onClick={() => {
                    //TODO: what if copy fails?
                    navigator?.clipboard?.writeText &&
                      navigator?.clipboard?.writeText(
                        practitioner?.user?.email!
                      );
                  }}
                >
                  <Typography
                    className={'mr-1'}
                    type="buttonSmall"
                    color="secondary"
                    text="Copy"
                  />
                  {renderIcon('DocumentDuplicateIcon', styles.actionIcon)}
                </Button>
              </div>
            </div>
            <Divider dividerType="dashed" className="my-4" />
            <div className={styles.infoWrapper}>
              <div>
                <Typography
                  text={'Your notes'}
                  type="h5"
                  color="textMid"
                  className={'mt-1'}
                />
                {notes.length > 0 ? (
                  <Typography
                    text={getLastNoteDate(notes)}
                    type="h4"
                    color="textDark"
                    className={'mt-1'}
                  />
                ) : (
                  <Typography
                    text={''}
                    type="h4"
                    color="textDark"
                    className={'mt-1'}
                  />
                )}
              </div>
              <div>
                <Button
                  size="small"
                  shape="normal"
                  color="secondaryAccent2"
                  type="filled"
                  onClick={() =>
                    history.push(ROUTES.COACH.NOTES, { practitionerId })
                  }
                >
                  <Typography
                    className={'mr-1'}
                    type="buttonSmall"
                    color="secondary"
                    text="View"
                  />
                  {renderIcon('EyeIcon', styles.actionIcon)}
                </Button>
              </div>
            </div>
            <Divider dividerType="dashed" className="my-4" />
            <div className="flex w-full justify-center">
              <Button
                type="filled"
                color="primary"
                textColor="white"
                className={`mt-6 w-11/12 ${
                  !practitioner?.isPrincipal &&
                  !practitioner?.isFundaAppAdmin &&
                  'mb-6'
                }`}
                onClick={() =>
                  isOnline
                    ? setRemovePractionerReasonsVisible(true)
                    : showOnlineOnly()
                }
                icon="TrashIcon"
                text={`Remove ${practitioner?.user?.firstName}`}
              />
            </div>
            {(practitioner?.isPrincipal || practitioner?.isFundaAppAdmin) && (
              <div className="flex w-full justify-center">
                <Button
                  type="outlined"
                  color="primary"
                  className={'mt-4 mb-6 w-11/12'}
                  onClick={() =>
                    history.push(ROUTES.COACH.PRACTITIONER_REASSIGN_CLASS, {
                      practitionerId,
                    })
                  }
                >
                  {renderIcon(
                    'PencilAltIcon',
                    'w-5 h-5 color-primary text-primary mr-2'
                  )}
                  <Typography
                    type="body"
                    className="mr-4"
                    color="primary"
                    text={`Record leave`}
                  ></Typography>
                </Button>
              </div>
            )}
          </>
        </div>
      )}
      <Dialog
        fullScreen
        visible={createPractitionerNoteVisible}
        position={DialogPosition.Middle}
      >
        <div className={styles.dialogContent}>
          <CreateNote
            userId={practitionerId || ''}
            noteType={NoteTypeEnum.Unknown}
            titleText={`Add a note to ${practitioner?.user?.firstName} profile`}
            onBack={() => onCreatePractitionerNoteBack()}
            onCreated={() => onCreatePractitionerNoteBack()}
          />
        </div>
      </Dialog>
      <Dialog
        fullScreen
        visible={removePractionerReasonsVisible}
        position={DialogPosition.Middle}
      >
        <div className={styles.dialogContent}>
          <RemovePractioner
            onSuccess={() =>
              showMessage({
                message: `${practitioner?.user?.firstName} removed`,
              })
            }
          />
        </div>
      </Dialog>
      <Dialog
        fullScreen
        visible={showTraineeDashboard}
        position={DialogPosition.Top}
      >
        <div className={styles.dialogContent}>
          <CoachTraineeOnboarding
            practitioner={practitioner}
            setShowTraineeDashboard={setShowTraineeDashboard}
          />
        </div>
      </Dialog>
    </>
  );
};
