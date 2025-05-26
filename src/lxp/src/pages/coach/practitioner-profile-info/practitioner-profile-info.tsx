import { useHistory, useLocation } from 'react-router';
import { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useDialog, useSnackbar } from '@ecdlink/core';
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
  MenuListDataItem,
} from '@ecdlink/ui';
import { NoteTypeEnum, PractitionerRemovalHistory } from '@ecdlink/graphql';
import { PractitionerService } from '@/services/PractitionerService';
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
import { classroomsForCoachSelectors } from '@/store/classroomForCoach';
import { CoachPractitionerNotRegistered } from './components/coach-practitioner-not-registered/coach-practitioner-not-registered';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
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
import { getPractitionerTimeline } from '@/store/pqa/pqa.actions';
import { authSelectors } from '@/store/auth';
import { useTenantModules } from '@/hooks/useTenantModules';
import { useTenant } from '@/hooks/useTenant';
import TransparentLayer from '../../../assets/TransparentLayer.png';

export const CoachPractitionerProfileInfo: React.FC = () => {
  const dialog = useDialog();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const classroom = useSelector(classroomsSelectors?.getClassroom);
  const practitionerId = location.state.practitionerId;
  const isFromProgrammeView = location.state.isFromProgrammeView;
  const isFromReassignView = location?.state?.isFromReassignView;
  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerId)
  );

  const coachClassrooms = useSelector(
    classroomsForCoachSelectors.getClassroomForCoach
  );
  const coachClassroomGroups = useSelector(
    classroomsForCoachSelectors.getClassroomGroups
  );

  const isPrincipal = practitioner?.isPrincipal === true;
  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;
  const isOpenAccess = tenant?.isOpenAccess;
  const { businessEnabled } = useTenantModules();

  const practitionerClassroomGroups =
    coachClassroomGroups?.filter((item) => item.userId === practitionerId) ||
    [];

  const practitionerClassroomDetails = isPrincipal
    ? coachClassrooms?.find((item) => item?.userId === practitionerId)
    : practitionerClassroomGroups && practitionerClassroomGroups.length > 0
    ? coachClassrooms?.find(
        (item) =>
          item?.id === practitionerClassroomGroups?.[0].classroomId! || ''
      )
    : null;

  const [isToRemoveSmartStarter, setIsToRemoveSmartStarter] =
    useState<boolean>(false);

  const { showMessage } = useSnackbar();

  const [createPractitionerNoteVisible, setCreatePractitionerdNoteVisible] =
    useState<boolean>(false);

  const [removePractionerReasonsVisible, setRemovePractionerReasonsVisible] =
    useState<boolean>(false);

  const notes = useSelector(notesSelectors.getNotesByUserId(practitionerId));
  const practitionerAbsentees = practitioner?.absentees;

  const validAbsentee = practitionerAbsentees?.filter(
    (item) =>
      (!isPast(new Date(item?.absentDateEnd as string)) ||
        isToday(new Date(item?.absentDate as string))) &&
      item?.reason !== 'Practitioner removed from programme'
  );

  const classesWithAbsence =
    validAbsentee &&
    Object.values(
      validAbsentee?.reduce(
        (acc, obj) => ({ ...acc, [obj.absentDate as string]: obj }),
        {}
      )
    );

  classesWithAbsence?.sort(function (a, b) {
    return a?.absentDate?.localeCompare(b?.absentDate);
  });

  useEffect(() => {
    appDispatch(getPractitionerTimeline({ userId: practitionerId }));
  }, [appDispatch, practitionerId]);

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

  const currentDates = validAbsenteesDates?.map((item) => {
    return item?.absentDate as string;
  });

  const orderedDates = currentDates?.sort(function (a, b) {
    return Date.parse(a) - Date.parse(b);
  });

  const currentAbsentee = validAbsentee?.find(
    (item) => item?.absentDate === orderedDates?.[0]
  ) as AbsenteeDto;

  const isLeave = useMemo(
    () => currentAbsentee?.absentDate !== currentAbsentee?.absentDateEnd,
    [currentAbsentee?.absentDate, currentAbsentee?.absentDateEnd]
  );

  const isOnLeave =
    isLeave &&
    (isPast(new Date(currentAbsentee?.absentDate as string)) ||
      isToday(new Date(currentAbsentee?.absentDate as string))) &&
    !isPast(new Date(currentAbsentee?.absentDateEnd as string));

  const absenceIsToday = isSameDay(
    new Date(),
    new Date(currentAbsentee?.absentDate || '')
  );

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

  const [existingRemoval, setExistingRemoval] = useState<
    PractitionerRemovalHistory | undefined
  >();

  const getRemovalForPractitioner = async () => {
    const removalDetails = await new PractitionerService(
      userAuth?.auth_token!
    ).getRemovalForPractitioner(practitioner?.userId!);
    setExistingRemoval(removalDetails);

    return removalDetails;
  };

  useEffect(() => {
    getRemovalForPractitioner();
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
      if (existingRemoval) {
        history.push(ROUTES.COACH.CONTACT_PRACTITIONER, {
          practitionerId: practitionerId,
          removePractitioner: true,
        });
      } else {
        history.push(ROUTES.COACH.PRACTITIONER_CLASSROOM, {
          practitionerId,
        });
      }
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
    history.push(
      ROUTES.COACH.PRACTITIONER_JOURNEY.replace(
        ':practitionerId',
        practitionerId
      )
    );
  };

  const listItems: MenuListDataItem[] = [
    {
      title: 'Site visits',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: 'Milestones',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'BadgeCheckIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      iconBackgroundColor: 'quatenary',
      onActionClick: () => navigateJourney(),
    },
  ];

  if (!!practitionerClassroomDetails) {
    listItems?.push({
      title: 'Classroom',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: existingRemoval
        ? `${practitioner?.user?.firstName} removed from programme`
        : 'Children, progress & attendance',
      subTitleStyle: existingRemoval
        ? 'text-sm font-h1 font-normal text-errorMain w-9/12 overflow-clip'
        : 'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'AcademicCapIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      iconBackgroundColor: 'quatenary',
      onActionClick: () => navigateClassroom(),
      backgroundColor: existingRemoval ? 'alertBg' : 'uiBg',
    });
  }

  if (
    (isPrincipal && isOpenAccess) ||
    (businessEnabled && isWhiteLabel && isPrincipal)
  ) {
    listItems?.push({
      title: 'Finances',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: `Business, Income & expenses`,
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'BriefcaseIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      iconBackgroundColor: 'quatenary',
      onActionClick: () => navigateBusiness(),
    });
  }

  listItems?.push({
    title: 'Preschool',
    titleStyle: 'text-textDark font-semibold text-base leading-snug',
    subTitle: existingRemoval
      ? `${practitioner?.user?.firstName} removed from programme`
      : 'Location, classes & staff',
    subTitleStyle: existingRemoval
      ? 'text-sm font-h1 font-normal text-errorMain w-9/12 overflow-clip'
      : 'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
    backgroundColor: existingRemoval ? 'alertBg' : 'uiBg',
    menuIcon: 'InformationCircleIcon',
    menuIconClassName: 'text-white',
    showIcon: true,
    iconBackgroundColor: 'quatenary',
    onActionClick: () => {
      if (isOnline) {
        if (existingRemoval) {
          history.push(ROUTES.COACH.CONTACT_PRACTITIONER, {
            practitionerId: practitionerId,
            removePractitioner: true,
          });
        } else {
          history.push(ROUTES.COACH.PROGRAMME_INFORMATION, {
            practitionerId,
          });
        }
      } else {
        showOnlineOnly();
      }
    },
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
    practitioner?.isRegistered === null || practitioner?.isRegistered === false;

  return (
    <>
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
            backgroundUrl={TransparentLayer}
            backgroundImageColour={'primary'}
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
                backgroundColour={isPrincipal ? 'primary' : 'secondary'}
                borderColour={isPrincipal ? 'primary' : 'secondary'}
                text={isPrincipal ? 'Principal' : 'Practitioner'}
                textColour={'white'}
                className={'px-3 py-1.5'}
              />
            </div>
            <div className={styles.contactButtons}>
              <Button
                color={'quatenary'}
                type={'outlined'}
                className={'rounded-2xl'}
                size={'small'}
                onClick={call}
              >
                <PhoneIcon
                  className="text-quatenary h-5 w-5"
                  aria-hidden="true"
                />
              </Button>
              <Button
                color={'quatenary'}
                type={'outlined'}
                className={'rounded-2xl'}
                size={'small'}
                onClick={whatsapp}
              >
                <span className="text-quatenary h-5 w-5">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.7179 3.28528C11.3299 1.89661 9.4366 1.19595 7.4486 1.35595C4.77593 1.57061 2.43326 3.42928 1.64926 5.99328C1.08926 7.82528 1.3246 9.73795 2.2366 11.3179L1.3726 14.1866C1.28993 14.4619 1.54126 14.7213 1.81926 14.6473L4.82193 13.8426C5.7946 14.3733 6.88926 14.6526 8.00393 14.6533H8.0066C10.8033 14.6533 13.3873 12.9426 14.2813 10.2926C15.1519 7.70861 14.5079 5.07728 12.7179 3.28528ZM11.2653 10.3693C11.1266 10.7579 10.4473 11.1326 10.1419 11.1599C9.8366 11.1879 9.5506 11.2979 8.14526 10.7439C6.45393 10.0773 5.38593 8.34328 5.30326 8.23261C5.21993 8.12128 4.62393 7.33061 4.62393 6.51194C4.62393 5.69328 5.05393 5.29061 5.2066 5.12461C5.35926 4.95794 5.53926 4.91661 5.6506 4.91661C5.76126 4.91661 5.8726 4.91661 5.96926 4.92061C6.08793 4.92528 6.21926 4.93128 6.34393 5.20794C6.49193 5.53728 6.81526 6.35995 6.8566 6.44328C6.89793 6.52661 6.92593 6.62395 6.8706 6.73461C6.81526 6.84528 6.78726 6.91461 6.7046 7.01195C6.62126 7.10928 6.52993 7.22861 6.45526 7.30328C6.37193 7.38595 6.28526 7.47661 6.38193 7.64261C6.47926 7.80928 6.8126 8.35395 7.30726 8.79461C7.94326 9.36128 8.4786 9.53661 8.64526 9.62061C8.81193 9.70395 8.9086 9.68995 9.00593 9.57861C9.10326 9.46795 9.42193 9.09328 9.5326 8.92661C9.64326 8.75995 9.7546 8.78795 9.90726 8.84328C10.0599 8.89861 10.8779 9.30128 11.0439 9.38461C11.2106 9.46795 11.3213 9.50928 11.3626 9.57861C11.4039 9.64728 11.4039 9.98061 11.2653 10.3693Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
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
                      <Fragment key={item?.absenteeId}>
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
                      </Fragment>
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
                                <div
                                  className="flex items-center gap-2"
                                  key={classroomGroup?.absenteeId}
                                >
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
                listItems={listItems}
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
                  onClick={call}
                >
                  <Typography
                    className={'mr-1'}
                    type="buttonSmall"
                    color="secondary"
                    text="Call"
                  />
                  {renderIcon('PhoneIcon', styles.actionIcon)}
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
              <Button
                size="small"
                shape="normal"
                color="secondaryAccent2"
                type="filled"
                onClick={() => {
                  window.open(`mailto:${practitioner?.user?.email}`);
                }}
              >
                <Typography
                  className={'mr-1'}
                  type="buttonSmall"
                  color="secondary"
                  text="Email"
                />
                {renderIcon('MailIcon', styles.actionIcon)}
              </Button>
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
                color="quatenary"
                textColor="white"
                className={`mt-6 w-11/12 ${
                  !practitioner?.isPrincipal && 'mb-6'
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
    </>
  );
};
