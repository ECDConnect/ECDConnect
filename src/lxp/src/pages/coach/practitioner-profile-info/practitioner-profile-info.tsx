import { useHistory, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { useSnackbar, useTheme } from '@ecdlink/core';
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
} from '@ecdlink/ui';
import { PractitionerService } from '@/services/PractitionerService';
import { NoteTypeEnum } from '@ecdlink/graphql';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { PractitionerProfileRouteState } from './practitioner-profile-info.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './practitioner-profile-info.styles';
import ROUTES from '@routes/routes';
import { PhoneIcon } from '@heroicons/react/solid';
import { CreateNote } from './components/create-note/create-note';
import { RemovePractioner } from './components/remove-practinioner/remove-practioner';
import { getLastNoteDate } from '@utils/child/child-profile-utils';
import { notesSelectors } from '@store/notes';
import { useSelector } from 'react-redux';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { authSelectors } from '@store/auth';
import { classroomsSelectors } from '@/store/classroom';
import { CoachPractitionerNotRegistered } from './components/coach-practitioner-not-registered/coach-practitioner-not-registered';
import { useAppDispatch } from '@store';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { traineeSelectors, traineeThunkActions } from '@/store/trainee';
import { timelineSteps } from '@/pages/trainee/trainee-onboarding/components/trainee-onboarding-dashboard/timeline-steps';
import { OnboardingTraineeDashboard } from './components/trainee-timeline/trainee-onboarding-dashboard';
import { TraineeOnboarding } from './components/trainee-timeline/trainee-onboarding';

export const CoachPractitionerProfileInfo: React.FC = () => {
  const history = useHistory();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const classroom = useSelector(classroomsSelectors?.getClassroom);
  const practitionerId = location.state.practitionerId;
  const isFromProgrammeView = location.state.isFromProgrammeView;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );
  const isPrincipal = practitioner?.isPrincipal === true;
  const [practitionerClassroomDetails, setPractitionerClassroomDetails] =
    useState<any>();
  const isTrainee = practitioner?.isTrainee;
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);
  const traineeVisits = timeline?.traineeVisits;
  const traineeCurrentVisit = traineeVisits?.[0];
  const completedSteps = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined
  ).filter((item) => item?.type === 'completed');
  const onboardingNotCompleted = completedSteps?.length < 8;

  const [showTraineeDashboard, setShowTraineeDashboard] = useState(false);

  const { theme } = useTheme();
  const { showMessage } = useSnackbar();

  const [createPractitionerNoteVisible, setCreatePractitionerdNoteVisible] =
    useState<boolean>(false);

  const [removePractionerReasonsVisible, setRemovePractionerReasonsVisible] =
    useState<boolean>(false);

  const notes = useSelector(notesSelectors.getNotesByUserId(practitionerId));

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
  }, []);

  const appDispatch = useAppDispatch();
  const removePractitioner = async () => {
    await new PractitionerService(
      userAuth?.auth_token || ''
    ).UpdatePrincipalInvitation(
      practitioner?.userId!,
      practitioner?.principalHierarchy!,
      false
    );
    await new PractitionerService(
      userAuth?.auth_token || ''
    ).UpdatePrincipalInvitation(
      practitioner?.userId!,
      practitioner?.principalHierarchy!,
      false
    );
    await new PractitionerService(
      userAuth?.auth_token!
    ).UpdatePractitionerRegistered(practitioner?.userId!, false);
    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();
    history.push(ROUTES.COACH.PRACTITIONERS);
  };

  const classroomsDetailsForPractitioner = async () => {
    const classroomDetails = await new PractitionerService(
      userAuth?.auth_token!
    ).getClassroomGroupClassroomsForPractitioner(practitioner?.userId!);
    setPractitionerClassroomDetails(classroomDetails);
    return classroomDetails;
  };

  useEffect(() => {
    classroomsDetailsForPractitioner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        onboardingNotCompleted
          ? setShowTraineeDashboard(true)
          : history.push(
              ROUTES.COACH.PRACTITIONER_JOURNEY.replace(
                ':practitionerId',
                practitionerId
              )
            ),
      classNames: 'bg-uiBg',
    },
    {
      title: 'Classroom',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: 'Children, progress & attendance',
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
      onActionClick: () =>
        history.push(ROUTES.COACH.PRACTITIONER_CLASSROOM, {
          practitionerId,
        }),
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
      onActionClick: () =>
        history.push(ROUTES.COACH.PROGRAMME_INFORMATION, {
          practitionerId,
        }),
      classNames: 'bg-uiBg',
    },
  ];

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
      onActionClick: () =>
        history.push(ROUTES.COACH.PROGRAMME_INFORMATION, {
          practitionerId,
        }),
      classNames: 'bg-uiBg',
    },
  ];

  const onCreatePractitionerNoteBack = () => {
    setCreatePractitionerdNoteVisible(false);
  };

  return (
    <>
      {(practitioner?.isRegistered === null ||
        practitioner?.isRegistered === false) &&
      !isTrainee ? (
        <CoachPractitionerNotRegistered
          practitioner={practitioner}
          classroom={classroom}
        />
      ) : (
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
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onPressed={() => {}}
              />
            </div>

            <div className={styles.chipsWrapper}>
              <StatusChip
                backgroundColour="primary"
                borderColour="primary"
                text={'SmartStarter'}
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
                  text={'Smartstart club'}
                  type="h5"
                  color="textMid"
                  className={'mt-1'}
                />
                <Typography
                  text={'N/A'}
                  type="h4"
                  color="textDark"
                  className={'mt-1'}
                />
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
                  onClick={
                    () => history.push(ROUTES.COACH.NOTES, { practitionerId })
                    // setCreatePractitionerdNoteVisible(true)
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
            </div>
            <Divider dividerType="dashed" className="my-4" />
            <div className="flex w-full justify-center">
              <Button
                type="outlined"
                color="primary"
                className={'mt-6 mb-6 w-11/12'}
                onClick={() => setRemovePractionerReasonsVisible(true)}
              >
                {renderIcon(
                  'TrashIcon',
                  'w-5 h-5 color-primary text-primary mr-2'
                )}
                <Typography
                  type="body"
                  className="mr-4"
                  color="primary"
                  text={`Remove ${practitioner?.user?.firstName}`}
                ></Typography>
              </Button>
            </div>
          </>
          <Dialog
            fullScreen
            visible={showTraineeDashboard}
            position={DialogPosition.Top}
          >
            <div className={styles.dialogContent}>
              <TraineeOnboarding practitioner={practitioner} />
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
};
