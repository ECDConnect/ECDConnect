/* eslint-disable react-hooks/exhaustive-deps */
import { useDialog, useTheme } from '@ecdlink/core';
import {
  ActionModal,
  Avatar,
  BannerWrapper,
  DialogPosition,
  IconBadge,
  NavigationRouteItem,
  NavigationDropdown,
  StackedListItemType,
  Typography,
  UserAvatar,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useDocuments } from '@hooks/useDocuments';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { OfflineSyncModal } from '../../modals';
import OfflineSyncTimeExceeded from '../../modals/offline-sync/offline-sync-time-exceeded';
import { useAppDispatch } from '@store';
import { classroomsForCoachThunkActions } from '../../store/classroomForCoach';
import { classroomsSelectors, classroomsThunkActions } from '@store/classroom';
import {
  notificationActions,
  notificationsSelectors,
} from '@store/notifications';
import { settingSelectors, settingThunkActions } from '@store/settings';
import { userSelectors } from '@store/user';
import { analyticsActions } from '@store/analytics';
import { DashboardItems } from './components/dashboard-items/dashboard-items';
import { practitionerForCoachThunkActions } from '@/store/practitionerForCoach';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { childrenThunkActions } from '@/store/children';
import * as styles from './dashboard.styles';
import ROUTES from '@routes/routes';
import { staticDataThunkActions } from '@store/static-data';
import { programmeThemeThunkActions } from '@store/content/programme-theme';
import { storyBookThunkActions } from '@store/content/story-book';
import { activityThunkActions } from '@store/content/activity';
import { statementsThunkActions } from '@/store/statements';
import { programmeThunkActions } from '@/store/programme';
import offlineStatments from '../../assets/statements-offline.png';
import { setStorageItem } from '@/utils/common/local-storage.utils';
import { convertImageToBase64 } from '@/utils/common/convert-image-to-64.utils';
import { traineeSelectors, traineeThunkActions } from '@/store/trainee';
import { timelineSteps } from '../trainee/trainee-onboarding/components/trainee-onboarding-dashboard/timeline-steps';
import { calendarThunkActions } from '@/store/calendar';
import { differenceInHours, isSameDay } from 'date-fns';
// import { browserName, browserVersion } from 'react-device-detect';
const { version } = require('../../../package.json');

const enableCalendar = true;

export enum NavigationTypes {
  Home = 'Home',
  ClientFolders = 'Classroom',
  Attendance = 'Attendance',
  Practitioner = 'Practitioner',
  Children = 'Children',
  Programme = 'Programme',
  Profile = 'Profile',
  Messages = 'Messages',
  Training = 'Training',
  Community = 'Community',
  Logout = 'Logout',
  Practitioners = 'Practitioners',
  Business = 'Business',
  SmartStarters = 'SmartStarters',
}

export interface DashboardRouteState {
  isFromTraineeFlow?: boolean;
}

export const Dashboard: React.FC = () => {
  const location = useLocation<DashboardRouteState>();
  const shouldUserSync = useSelector(settingSelectors.getShouldUserSync);
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroup = useSelector(classroomsSelectors.getClassroomGroups);
  const userData = useSelector(userSelectors.getUser);
  const practitionerData = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors?.getPractitioners);
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { theme } = useTheme();
  const dialog = useDialog();
  const isCoach = userData?.roles?.some((role) => role.name === 'Coach');
  const newNotificationCount = useSelector(
    notificationsSelectors.getNewNotificationCount
  );
  const isPrincipal = practitioner?.isPrincipal;
  const isFundaAppAdmin = practitioner?.isFundaAppAdmin;
  const isRegistered = practitioner?.isRegistered;
  const isProgress = practitioner?.progress;
  const hasConsent = practitioner?.shareInfo;
  const isFromTraineeFlow = location.state?.isFromTraineeFlow || false;
  const isTrainee = practitioner?.isTrainee;
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const dashboardNotification = useSelector(
    notificationsSelectors.getDashboardNotification
  );

  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);
  const uncompletedSteps = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined
  ).filter((item) => item?.type !== 'completed' && item?.type !== 'inProgress');

  const { userProfilePicture } = useDocuments();

  useEffect(() => {
    convertImageToBase64(offlineStatments, setStorageItem);
  }, []);

  const initStaticStoreSetup = async () => {
    const today = new Date();
    await appDispatch(settingThunkActions.getSettings({})).unwrap();
    await appDispatch(staticDataThunkActions.getRelations({})).unwrap();
    await appDispatch(staticDataThunkActions.getProgrammeTypes({})).unwrap();
    await appDispatch(
      programmeThunkActions.getProgrammes({ classroomId: classroom?.id })
    ).unwrap();
    await appDispatch(
      staticDataThunkActions.getProgrammeAttendanceReasons({})
    ).unwrap();
    await appDispatch(staticDataThunkActions.getGenders({})).unwrap();
    await appDispatch(staticDataThunkActions.getRaces({})).unwrap();
    await appDispatch(staticDataThunkActions.getLanguages({})).unwrap();
    await appDispatch(staticDataThunkActions.getEducationLevels({})).unwrap();
    await appDispatch(
      staticDataThunkActions.getHolidays({ year: today.getFullYear() })
    ).unwrap();
    await appDispatch(staticDataThunkActions.getProvinces({})).unwrap();
    await appDispatch(staticDataThunkActions.getReasonsForLeaving({})).unwrap();
    await appDispatch(
      staticDataThunkActions.getReasonsForPractitionerLeaving({})
    ).unwrap();
    await appDispatch(
      staticDataThunkActions.getReasonsForPractitionerLeavingProgramme({})
    ).unwrap();
    await appDispatch(staticDataThunkActions.getGrants({})).unwrap();
    await appDispatch(staticDataThunkActions.getDocumentTypes({})).unwrap();
    await appDispatch(staticDataThunkActions.getNoteTypes({})).unwrap();
    await appDispatch(staticDataThunkActions.getWorkflowStatuses({})).unwrap();
    await appDispatch(statementsThunkActions.getAllExpensesTypes({})).unwrap();
    await appDispatch(statementsThunkActions.getAllIncomeTypes({})).unwrap();
    await appDispatch(
      statementsThunkActions.getAllStatementsFeeType({})
    ).unwrap();
    await appDispatch(
      statementsThunkActions.getAllStatementsContributionType({})
    ).unwrap();
    await appDispatch(statementsThunkActions.getAllPayType({})).unwrap();

    await appDispatch(
      activityThunkActions.getActivities({ locale: 'en-za' })
    ).unwrap();

    await appDispatch(
      storyBookThunkActions.getStoryBooks({ locale: 'en-za' })
    ).unwrap();

    await appDispatch(
      programmeThemeThunkActions.getProgrammeThemes({ locale: 'en-za' })
    ).unwrap();

    await appDispatch(
      calendarThunkActions.getCalendarEventTypes({ locale: 'en-za' })
    ).unwrap();
  };

  useEffect(() => {
    initStaticStoreSetup();
  }, []);

  useEffect(() => {
    if (
      dashboardNotification?.isNew &&
      practitioner?.progress! >= 2 &&
      !practitioner?.isTrainee
    ) {
      appDispatch(notificationActions.resetNotificationState());
    }
  }, []);

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Dashboard',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  /**
   * Data loading for coaches:
   * 1. Practitioners
   * 2. Children of Practitioners
   */
  useEffect(() => {
    if (isOnline) {
      if (isCoach) {
        (async () =>
          await appDispatch(
            practitionerForCoachThunkActions.getPractitionersForCoach({})
          ).unwrap())();

        (async (id) =>
          await appDispatch(
            classroomsForCoachThunkActions.getClassroomForCoach({
              id: userData?.id!,
            })
          ).unwrap())();

        (async () =>
          await appDispatch(
            childrenThunkActions.getChildrenForCoach({})
          ).unwrap())();
      }

      if (userData?.roles?.some((role) => role.name === 'Practitioner')) {
        const currentPrincipal = practitionerData?.filter(
          (x) => x?.user?.id === userData.id
        );
        const _current = currentPrincipal?.at(0);
        if (_current) {
          (async () =>
            await appDispatch(
              practitionerThunkActions.getPractitionerById({
                id: _current?.id || '',
              })
            ).unwrap())();
        }
      }
    }
  }, [userData]);

  useEffect(() => {
    if (isOnline) {
      (async () =>
        await appDispatch(
          practitionerThunkActions.getAllPractitioners({})
        ).unwrap())();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, []);

  useEffect(() => {
    if (isOnline) {
      if (practitioner?.userId && !classroom) {
        (async () =>
          await appDispatch(
            classroomsThunkActions.getClassroomDetailsForPractitioner({
              id: practitioner?.userId!,
            })
          ).unwrap())();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }
    }
  }, [practitioner?.userId]);

  const traineeNavigation = [
    {
      name: NavigationTypes.Children,
      href: ROUTES.CLASSROOM,
      params: { activeTabIndex: 1 },
      current: false,
    },
    {
      name: NavigationTypes.Programme,
      href: ROUTES.CLASSROOM,
      params: { activeTabIndex: 2 },
      current: false,
    },
  ];

  useEffect(() => {
    if (isFromTraineeFlow) {
      window.location.reload();
    }
  }, []);

  const navigation: (NavigationRouteItem | NavigationDropdown)[] = [
    {
      name: NavigationTypes.Home,
      href: ROUTES.ROOT,
      icon: 'HomeIcon',
      current: true,
    },
    {
      name: NavigationTypes.ClientFolders,
      icon: 'UsersIcon',
      current: false,
      nestedChildren:
        practitioners && isPrincipal && practitioners?.length > 0
          ? [
              {
                name: NavigationTypes.Attendance,
                href: ROUTES.CLASSROOM,
                params: { activeTabIndex: 0 },
                current: false,
              },
              {
                name: NavigationTypes.Practitioners,
                href: ROUTES.CLASSROOM,
                params: { activeTabIndex: 1 },
                current: false,
              },
              {
                name: NavigationTypes.Children,
                href: ROUTES.CLASSROOM,
                params: { activeTabIndex: 2 },
                current: false,
              },
              {
                name: NavigationTypes.Programme,
                href: ROUTES.CLASSROOM,
                params: { activeTabIndex: 3 },
                current: false,
              },
            ]
          : isTrainee
          ? traineeNavigation
          : [
              {
                name: NavigationTypes.Attendance,
                href: ROUTES.CLASSROOM,
                params: { activeTabIndex: 0 },
                current: false,
              },
              {
                name: NavigationTypes.Children,
                href: ROUTES.CLASSROOM,
                params: { activeTabIndex: 1 },
                current: false,
              },
              {
                name: NavigationTypes.Programme,
                href: ROUTES.CLASSROOM,
                params: { activeTabIndex: 2 },
                current: false,
              },
            ],
    },
    {
      name: NavigationTypes.Profile,
      href: isCoach
        ? ROUTES.COACH.PROFILE.ROOT
        : ROUTES.PRACTITIONER.PROFILE.ROOT,
      icon: 'UserIcon',
      current: false,
      showDivider: true,
    },
    {
      name: NavigationTypes.Logout,
      href: ROUTES.LOGOUT,
      icon: 'ExternalLinkIcon',
      current: false,
      showDivider: true,
    },
  ];

  if (!isTrainee) {
    navigation.splice(3, 0, {
      name: NavigationTypes.Community,
      href: ROUTES.COMMUNITY,
      icon: 'BookOpenIcon',
      current: false,
      showDivider: true,
    });

    navigation.splice(3, 0, {
      name: NavigationTypes.Messages,
      href: ROUTES.MESSAGES,
      icon: 'BellIcon',
      current: false,
      showDivider: true,
      getNotificationCount: () => {
        return newNotificationCount;
      },
    });

    navigation?.splice(3, 0, {
      name: NavigationTypes.Training,
      href: ROUTES.TRAINING,
      icon: 'BellIcon',
      current: false,
      showDivider: true,
    });
  }

  if ((isPrincipal || isFundaAppAdmin) && !isTrainee) {
    navigation?.splice(3, 0, {
      name: NavigationTypes.Business,
      href: ROUTES.BUSINESS,
      icon: 'BriefcaseIcon',
      current: false,
      showDivider: true,
    });
  }

  if (isTrainee) {
    navigation?.splice(3, 0, {
      name: NavigationTypes.Business,
      href: practitioner?.setupTraineeInitiated
        ? ROUTES.TRAINEE.TRAINEE_ONBOARDING
        : ROUTES.TRAINEE.SETUP_TRAINEE,
      icon: 'BriefcaseIcon',
      current: false,
      showDivider: true,
    });
  }

  const navigationForCoach: (NavigationRouteItem | NavigationDropdown)[] = [
    {
      name: NavigationTypes.Home,
      href: ROUTES.ROOT,
      icon: 'HomeIcon',
      current: true,
    },
    {
      name: NavigationTypes.SmartStarters,
      icon: 'AcademicCapIcon',
      current: false,
      href: ROUTES.COACH.PRACTITIONERS,
    },
    {
      name: NavigationTypes.Profile,
      href: isCoach
        ? ROUTES.COACH.PROFILE.ROOT
        : ROUTES.PRACTITIONER.PROFILE.ROOT,
      icon: 'UserIcon',
      current: false,
      showDivider: true,
    },
    {
      name: NavigationTypes.Messages,
      href: ROUTES.MESSAGES,
      icon: 'BellIcon',
      current: false,
      showDivider: true,
      getNotificationCount: () => {
        return newNotificationCount;
      },
    },
    {
      name: NavigationTypes.Community,
      href: ROUTES.COMMUNITY,
      icon: 'BookOpenIcon',
      current: false,
      showDivider: true,
    },
    {
      name: NavigationTypes.Logout,
      href: ROUTES.LOGOUT,
      icon: 'ExternalLinkIcon',
      current: false,
      showDivider: true,
    },
  ];

  const dashboardItems: StackedListItemType[] = [];

  if (isCoach) {
    dashboardItems.push(
      {
        title: 'SmartStarters',
        titleIcon: 'AcademicCapIcon',
        titleIconClassName: styles.smartStarterIcon,
        onActionClick: () => history.push(ROUTES.COACH.PRACTITIONERS),
        classNames: 'bg-uiBg',
      },
      {
        title: 'Clubs',
        titleIcon: 'BriefcaseIcon',
        titleIconClassName: styles.businessIcon,
        onActionClick: () => ({}),
        classNames: 'bg-uiBg',
      }
    );
    dashboardItems.push({
      title: 'Calendar',
      titleIcon: 'CalendarIcon',
      titleIconClassName: styles.calendarIcon,
      classNames: 'bg-uiBg',
      onActionClick: () => {
        goToCalendar();
      },
    });
  }

  if (!isCoach) {
    dashboardItems.push({
      title: 'Classroom',
      titleIcon: 'AcademicCapIcon',
      titleIconClassName: styles.classRoomIcon,
      classNames: 'bg-uiBg',
      onActionClick: () => {
        goToClassroom();
      },
    });
    dashboardItems.push({
      title: 'Calendar',
      titleIcon: 'CalendarIcon',
      titleIconClassName: styles.calendarIcon,
      classNames: 'bg-uiBg',
      onActionClick: () => {
        goToCalendar();
      },
    });
  }

  if ((isPrincipal || isFundaAppAdmin) && !isTrainee) {
    dashboardItems.splice(1, 0, {
      title: 'Business',
      titleIcon: 'BriefcaseIcon',
      titleIconClassName: styles.businessIcon,
      onActionClick: () => {
        goToBusiness();
      },
      classNames: 'bg-uiBg',
    });
  }

  if (isTrainee) {
    dashboardItems.splice(1, 0, {
      title: 'Business',
      titleIcon: 'BriefcaseIcon',
      titleIconClassName: styles.businessIcon,
      onActionClick: () => {
        goToBusiness();
      },
      classNames: 'bg-uiBg',
    });
  }

  useEffect(() => {
    if (shouldUserSync) {
      dialog({
        position: DialogPosition.Bottom,
        blocking: true,
        render: (onSubmitParent, onCancel) => {
          return (
            <OfflineSyncTimeExceeded
              onSubmit={() => {
                onSubmitParent();

                dialog({
                  position: DialogPosition.Bottom,
                  blocking: true,
                  render: (onSubmit, onCancel) => {
                    return (
                      <OfflineSyncModal onSubmit={onSubmit}></OfflineSyncModal>
                    );
                  },
                });
              }}
            ></OfflineSyncTimeExceeded>
          );
        },
      });
    }
  }, [shouldUserSync]);

  const goToProfile = () => {
    const profileRoute = userData?.roles?.some((role) => role.name === 'Coach')
      ? ROUTES.COACH.PROFILE.ROOT
      : ROUTES.PRACTITIONER.PROFILE.ROOT;

    history.push(profileRoute);
  };

  const goToClassroom = () => {
    if (
      (((classroom && classroom.id) ||
        (classroomGroup && classroomGroup.length > 0)) &&
        isRegistered &&
        isProgress &&
        isProgress > 0 &&
        hasConsent) ||
      isTrainee
    ) {
      history.push(ROUTES.CLASSROOM, { activeTabIndex: 1 });
    } else {
      showCompleteProfileBlockingDialog();
    }
  };

  const goToCalendar = () => {
    history.push(ROUTES.CALENDAR);
  };

  const goToBusiness = () => {
    if ((isPrincipal || isFundaAppAdmin) && !isTrainee) {
      history.push(ROUTES.BUSINESS);
      return;
    }
    if (isTrainee) {
      if (practitioner?.setupTraineeInitiated) {
        history.push(ROUTES.TRAINEE.TRAINEE_ONBOARDING);
        return;
      }
      history.push(ROUTES.TRAINEE.SETUP_TRAINEE);
      return;
    }
  };

  const onNavigation = (navItem: any) => {
    if (
      (classroom && classroom.id && navItem.href.includes('classroom')) ||
      isTrainee
    ) {
      history.push(navItem.href, navItem.params);
    } else if (navItem.href.includes('classroom')) {
      showCompleteProfileBlockingDialog();
    } else {
      history.push(navItem.href, navItem.params);
    }
  };

  const showCompleteProfileBlockingDialog = () => {
    dialog({
      blocking: true,
      position: DialogPosition.Top,
      render: (onSubmit, onCancel) => {
        return (
          <ActionModal
            className="z-50"
            icon="XCircleIcon"
            iconBorderColor="errorBg"
            iconColor="errorMain"
            title="Missing programme information"
            paragraphs={[
              `Ask the principal of the programme to add you to the programme on Funda App. If you are the principal or if your principal is not a SmartStarter, please update your profile.`,
            ]}
            actionButtons={[
              {
                colour: 'primary',
                text: 'Add programme details',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'PlusIcon',
                onClick: async () => {
                  onSubmit();
                  history.push(ROUTES.PRACTITIONER.PROFILE.EDIT);
                },
              },
              {
                colour: 'primary',
                text: 'Close',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'XIcon',
                onClick: () => {
                  onSubmit();
                },
              },
            ]}
          />
        );
      },
    });
  };

  const profilePc =
    userProfilePicture?.file ||
    userData?.profileImageUrl ||
    userProfilePicture?.reference;

  return (
    <BannerWrapper
      backgroundColour={'white'}
      backgroundImageColour={'primary'}
      avatar={
        profilePc ? (
          <Avatar dataUrl={profilePc} size={'sm'} displayBorder={true} />
        ) : (
          <UserAvatar
            size="sm-md"
            color="secondary"
            displayBorder
            borderColour="secondary"
          />
        )
      }
      menuItems={isCoach ? navigationForCoach : navigation}
      onNavigation={onNavigation}
      menuLogoUrl={theme?.images.logoUrl}
      notificationRender={() => {
        return (
          <IconBadge
            onClick={() => history.push(ROUTES.MESSAGES)}
            badgeColor={'errorMain'}
            badgeTextColor={'white'}
            icon={'BellIcon'}
            iconColor={'white'}
            badgeText={newNotificationCount ? `${newNotificationCount}` : ''}
          />
        );
      }}
      onAvatarSelect={goToProfile}
      showBackground
      size="large"
      renderBorder={true}
      backgroundUrl={theme?.images.graphicOverlayUrl}
      className={styles.bannerContent}
      displayOffline={!isOnline}
      version={`v ${version}`}
    >
      <Typography
        type={'h1'}
        color="white"
        text={`Welcome ${userData && userData?.firstName}`}
        className={styles.welcomeText}
      />

      <div className={`${!classroom ? styles.wrapper : ''}`}>
        <DashboardItems
          listItems={dashboardItems}
          notification={dashboardNotification}
        />
      </div>
    </BannerWrapper>
  );
};

export default Dashboard;
