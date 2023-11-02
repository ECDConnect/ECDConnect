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
  ScoreCard,
} from '@ecdlink/ui';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
  practitionerActions,
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
import { calendarThunkActions } from '@/store/calendar';
import { pointsSelectors, pointsThunkActions } from '@/store/points';
import { pointsConstants } from '@/constants/points';
import { timelineSteps } from '../trainee/trainee-onboarding/components/trainee-onboarding-dashboard/timeline-steps';
import { traineeSelectors } from '@/store/trainee';
import { PractitionerInput } from '@ecdlink/graphql';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '@ecdlink/ui/src/assets/emoji/emoji_blue_smileEyes.svg';
import { ReactComponent as EmojiOrangeSmile } from '@ecdlink/ui/src/assets/emoji/emoji_orange_smile.svg';
import { ScoreCardProps } from '@ecdlink/ui/lib/components/score-card/score-card.types';
import { CommunityRouteState } from '../community/community.types';
import { coachSelectors } from '@/store/coach';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { getClubForPractitionerSelector } from '@/store/club/club.selectors';
import { isCurrentPointsAtLeast80PercentOfTotal } from '../community/clubs-tab/club/individual-club-view';
const { version } = require('../../../package.json');

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
  const club = useSelector(getClubForPractitionerSelector);
  const shouldUserSync = useSelector(settingSelectors.getShouldUserSync);
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroup = useSelector(classroomsSelectors.getClassroomGroups);
  const userData = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors?.getPractitioners);
  const coach = useSelector(coachSelectors.getCoach);
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { theme } = useTheme();
  const dialog = useDialog();
  const isCoach = userData?.roles?.some((role) => role.name === 'Coach');
  const newNotificationCount = useSelector(
    notificationsSelectors.getNewNotificationCount
  );
  const isPractitioner = !!practitioner;
  const isPrincipal = practitioner?.isPrincipal;
  const isFundaAppAdmin = practitioner?.isFundaAppAdmin;
  const isRegistered = practitioner?.isRegistered;
  const isProgress = practitioner?.progress;
  const hasConsent = practitioner?.shareInfo;
  const isTrainee = practitioner?.isTrainee;
  const isOnStipend = practitioner?.isOnStipend;
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);

  const a = useCallback(async () => {
    appDispatch(practitionerThunkActions?.getAllPractitioners({})).unwrap();
  }, []);

  useEffect(() => {
    a();
  }, []);

  const isFirstTimeCommunitySection = !coach?.clickedClubTab;

  const dashboardNotification = useSelector(
    notificationsSelectors.getDashboardNotification
  );
  const completedSteps = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined,
    '',
    timeline?.consolidationMeetingStatus,
    isOnStipend
  ).filter((item) => item?.type === 'completed');

  const pointsSummaryData = useSelector(pointsSelectors.getPointsSummary);
  const [pointsScoreProps, setPointsScoreProps] = useState<ScoreCardProps>();

  useEffect(() => {
    //This will prevent points card showing up for coaches
    if (isCoach) {
      return;
    }

    const currentMonth = new Date().getMonth() + 1; // +1 for 0 index
    const pointsTotal = pointsSummaryData.reduce((total, current) => {
      if (current.month == currentMonth) {
        return (total += current.pointsTotal);
      }
      return total;
    }, 0);

    let pointsMax =
      isPrincipal || isFundaAppAdmin
        ? pointsConstants.principalOrAdminMonthlyMax
        : pointsConstants.practitionerMonthlyMax;

    const percentageScore = (pointsTotal / pointsMax) * 100;

    // without this rule the progress bar goes beyond the component
    if (pointsTotal > pointsMax) {
      pointsMax = pointsTotal;
    }

    if (percentageScore < 60) {
      setPointsScoreProps({
        mainText: `${pointsTotal}`,
        hint: 'points',
        barBgColour: 'white',
        textPosition: 'left',
        barColour: 'errorMain',
        bgColour: 'errorBg',
        currentPoints: pointsTotal,
        maxPoints: pointsMax,
        textColour: 'textDark',
        onClick: () => history.push(ROUTES.PRACTITIONER.POINTS.SUMMARY),
        image: <EmojiOrangeSmile className="mr-2 h-16 w-16" />,
      });
    } else if (percentageScore < 80) {
      setPointsScoreProps({
        mainText: `${pointsTotal}`,
        barBgColour: 'white',
        hint: 'points',
        textPosition: 'left',
        barColour: 'secondary',
        bgColour: 'infoBb',
        currentPoints: pointsTotal,
        maxPoints: pointsMax,
        textColour: 'textDark',
        onClick: () => history.push(ROUTES.PRACTITIONER.POINTS.SUMMARY),
        image: <EmojiBlueSmile className="mr-2 h-16 w-16" />,
      });
    } else {
      setPointsScoreProps({
        mainText: `${pointsTotal}`,
        barBgColour: 'white',
        hint: 'points',
        textPosition: 'left',
        barColour: 'successMain',
        bgColour: 'successBg',
        currentPoints: pointsTotal,
        maxPoints: pointsMax,
        textColour: 'textDark',
        onClick: () => history.push(ROUTES.PRACTITIONER.POINTS.SUMMARY),
        image: <EmojiGreenSmile className="mr-2 h-16 w-16" />,
      });
    }
  }, [pointsSummaryData]);

  const { userProfilePicture } = useDocuments();

  useEffect(() => {
    convertImageToBase64(offlineStatments, setStorageItem);
  }, []);

  useEffect(() => {
    if (
      (practitioner?.isTrainee &&
        practitioner?.isOnStipend &&
        completedSteps?.length === 7) ||
      (practitioner?.isTrainee &&
        practitioner?.isOnStipend !== true &&
        completedSteps?.length === 6)
    ) {
      const copy = Object.assign({}, practitioner);

      const input: PractitionerInput = {
        Id: copy.id,
        IsActive: true,
        Progress: copy.progress,
        IsTrainee: false,
      };

      appDispatch(practitionerActions.updatePractitioner(copy));
      appDispatch(practitionerThunkActions.updatePractitioner(input));
    }
  }, [completedSteps?.length]);

  const leagueCard = useMemo((): ScoreCardProps => {
    const isAtLeast80PercentOfTotal = isCurrentPointsAtLeast80PercentOfTotal(
      club?.pointsTotal ?? 0,
      club?.maxPointsTotal ?? 0
    );
    const mainColor =
      !!club?.pointsTotal && isAtLeast80PercentOfTotal
        ? 'successMain'
        : 'secondary';
    const bgColour =
      !!club?.pointsTotal && isAtLeast80PercentOfTotal
        ? 'successBg'
        : 'secondaryAccent2';

    return {
      image: (
        <div className="relative mr-4 flex h-14 w-14 items-center justify-center">
          <Badge
            className="absolute z-0 h-12 w-12"
            fill={`var(--${mainColor})`}
          />
          <Typography
            className="relative z-10"
            color="white"
            type="h1"
            text={String(club?.leagueRanking)}
          />
        </div>
      ),
      currentPoints: club?.pointsTotal ?? 0,
      maxPoints: club?.maxPointsTotal ?? 0,
      barBgColour: 'white',
      barColour: mainColor,
      hint: club?.name ?? '',
      mainText: '',
      hintClassName: 'mt-10',
      bgColour,
      textColour: 'black',
      onClick: () =>
        history.push(
          ROUTES.PRACTITIONER.COMMUNITY[
            practitioner?.isNewInClub ? 'WELCOME' : 'ROOT'
          ]
        ),
    };
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
    if (isOnline && !!userData) {
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

      if (userData.roles?.some((role) => role.name === 'Practitioner')) {
        (async () =>
          await appDispatch(
            practitionerThunkActions.getPractitionerByUserId({
              userId: userData?.id || '',
            })
          ).unwrap())();

        const currentDate = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setMonth(currentDate.getMonth() - 12);
        (async () =>
          await appDispatch(
            pointsThunkActions.getPointsSummaryForUser({
              userId: userData?.id!,
              startDate: oneYearAgo,
              endDate: currentDate,
            })
          ).unwrap())();

        (async () =>
          await appDispatch(
            pointsThunkActions.getPointsLibrary({
              userId: userData?.id!,
            })
          ).unwrap())();

        (async () =>
          await appDispatch(
            pointsThunkActions.getUserClubStanding({
              userId: userData?.id!,
            })
          ).unwrap())();
      }
    }
  }, [userData]);

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
      href: ROUTES.CLASSROOM.ROOT,
      params: { activeTabIndex: 1 },
      current: false,
    },
    {
      name: NavigationTypes.Programme,
      href: ROUTES.CLASSROOM.ROOT,
      params: { activeTabIndex: 2 },
      current: false,
    },
  ];

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
                href: ROUTES.CLASSROOM.ROOT,
                params: { activeTabIndex: 0 },
                current: false,
              },
              {
                name: NavigationTypes.Practitioners,
                href: ROUTES.CLASSROOM.ROOT,
                params: { activeTabIndex: 1 },
                current: false,
              },
              {
                name: NavigationTypes.Children,
                href: ROUTES.CLASSROOM.ROOT,
                params: { activeTabIndex: 2 },
                current: false,
              },
              {
                name: NavigationTypes.Programme,
                href: ROUTES.CLASSROOM.ROOT,
                params: { activeTabIndex: 3 },
                current: false,
              },
            ]
          : isTrainee
          ? traineeNavigation
          : [
              {
                name: NavigationTypes.Attendance,
                href: ROUTES.CLASSROOM.ROOT,
                params: { activeTabIndex: 0 },
                current: false,
              },
              {
                name: NavigationTypes.Children,
                href: ROUTES.CLASSROOM.ROOT,
                params: { activeTabIndex: 1 },
                current: false,
              },
              {
                name: NavigationTypes.Programme,
                href: ROUTES.CLASSROOM.ROOT,
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
      href: isFirstTimeCommunitySection
        ? ROUTES.COMMUNITY.WELCOME
        : ROUTES.COMMUNITY.ROOT,
      params: { isFromDashboard: true } as CommunityRouteState,
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
      icon: 'PresentationChartBarIcon',
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
      href: isFirstTimeCommunitySection
        ? ROUTES.COMMUNITY.WELCOME
        : ROUTES.COMMUNITY.ROOT,
      params: { isFromDashboard: true } as CommunityRouteState,
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
        titleIconClassName: styles.icon,
        onActionClick: () => history.push(ROUTES.COACH.PRACTITIONERS),
        classNames: 'bg-uiBg',
      },
      {
        title: 'Community',
        titleIcon: 'UserGroupIcon',
        titleIconClassName: styles.icon,
        onActionClick: () => {
          history.push(
            isFirstTimeCommunitySection
              ? ROUTES.COMMUNITY.WELCOME
              : ROUTES.COMMUNITY.ROOT,
            { isFromDashboard: true } as CommunityRouteState
          );
        },
        classNames: 'bg-uiBg',
      }
    );
    dashboardItems.push({
      title: 'Calendar',
      titleIcon: 'CalendarIcon',
      titleIconClassName: styles.icon,
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

  if (!isTrainee) {
    dashboardItems.splice(1, 0, {
      title: NavigationTypes.Training,
      titleIcon: 'PresentationChartBarIcon',
      titleIconClassName: styles.trainingIcon,
      onActionClick: () => {
        goToTraining();
      },
      classNames: 'bg-uiBg',
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
      history.push(ROUTES.CLASSROOM.ROOT, { activeTabIndex: 2 });
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

  const goToTraining = () => {
    history.push(ROUTES.TRAINING);
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

  const showOnlineOnly = () => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const handleOnlineCallback = (callback: () => void) => {
    if (isOnline) {
      callback();
    } else {
      showOnlineOnly();
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
                onClick: isTrainee
                  ? async () => {
                      onSubmit();
                      handleOnlineCallback(() =>
                        history.push(ROUTES.TRAINEE.TRAINEE_ONBOARDING)
                      );
                    }
                  : async () => {
                      onSubmit();
                      handleOnlineCallback(() =>
                        history.push(ROUTES.PRACTITIONER.PROFILE.EDIT)
                      );
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
        {!!pointsScoreProps && !isCoach && !isTrainee && (
          <ScoreCard
            className="mt-5 mb-1 h-20"
            progressBarClassName="flex pt-2"
            mainText={pointsScoreProps.mainText}
            hint={pointsScoreProps?.hint}
            currentPoints={pointsScoreProps.currentPoints}
            maxPoints={pointsScoreProps.maxPoints}
            onClick={pointsScoreProps.onClick}
            barBgColour={pointsScoreProps.barBgColour}
            barColour={pointsScoreProps.barColour}
            bgColour={pointsScoreProps.bgColour}
            image={pointsScoreProps.image}
            textColour={pointsScoreProps.textColour}
            textPosition={pointsScoreProps.textPosition}
          />
        )}
        {isPractitioner && !!club && (
          <ScoreCard
            className="h-20"
            mainText={leagueCard.mainText}
            hint={leagueCard.hint}
            hintClassName={leagueCard.hintClassName}
            textPosition="left"
            currentPoints={leagueCard.currentPoints}
            maxPoints={leagueCard.maxPoints}
            onClick={leagueCard.onClick}
            barBgColour={leagueCard.barBgColour}
            barColour={leagueCard.barColour}
            bgColour={leagueCard.bgColour}
            image={leagueCard.image}
            textColour={leagueCard.textColour}
          />
        )}
      </div>
    </BannerWrapper>
  );
};

export default Dashboard;
