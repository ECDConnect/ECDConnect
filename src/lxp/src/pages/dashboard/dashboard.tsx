/* eslint-disable react-hooks/exhaustive-deps */
import { RoleSystemNameEnum, useDialog, useTheme } from '@ecdlink/core';
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
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useDocuments } from '@hooks/useDocuments';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { OfflineSyncModal } from '../../modals';
import OfflineSyncTimeExceeded from '../../modals/offline-sync/offline-sync-time-exceeded';
import { useAppDispatch } from '@store';
import { classroomsSelectors, classroomsThunkActions } from '@store/classroom';
import {
  notificationActions,
  notificationsSelectors,
} from '@store/notifications';
import { settingSelectors, settingThunkActions } from '@store/settings';
import { userSelectors } from '@store/user';
import { analyticsActions } from '@store/analytics';
import { DashboardItems } from './components/dashboard-items/dashboard-items';

import {
  practitionerActions,
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
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
import { traineeSelectors, traineeThunkActions } from '@/store/trainee';
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
import { notificationTagConfig } from '@/constants/notifications';
import { childrenThunkActions } from '@/store/children';
import {
  TabsItemForPrincipal,
  TabsItems,
} from '../classroom/class-dashboard/class-dashboard.types';
import { NavigationNames } from '../navigation';
import hamburgerLogo from '../../assets/logos/hamburgerLogo.png';
import { BusinessTabItems } from '../business/business.types';
import { useTenant } from '@/hooks/useTenant';
import { JoinOrAddPreschoolModal } from '@/components/join-or-add-preschool-modal/join-or-add-preschool-modal';

const { version } = require('../../../package.json');

export interface DashboardRouteState {
  isFromTraineeFlow?: boolean;
  isFromLogin?: boolean;
}

export const Dashboard: React.FC = () => {
  const location = useLocation<DashboardRouteState>();
  const isFromLogin = location?.state?.isFromLogin;
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const isWhiteLabel = tenant?.isWhiteLabel;
  const club = useSelector(getClubForPractitionerSelector);
  const shouldUserSync = useSelector(settingSelectors.getShouldUserSync);
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const userData = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors?.getPractitioners);
  const coach = useSelector(coachSelectors.getCoach);
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { theme } = useTheme();
  const dialog = useDialog();
  const isCoach = userData?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );
  const newNotificationCount = useSelector(
    notificationsSelectors.getNewNotificationCount
  );

  const isPractitioner = !!practitioner;
  const isPrincipal = practitioner?.isPrincipal;
  const isFundaAppAdmin = practitioner?.isFundaAppAdmin;
  const isRegistered = practitioner?.isRegistered;
  const isProgress = practitioner?.progress;
  const hasConsent = practitioner?.shareInfo;
  const isOnStipend = practitioner?.isOnStipend;
  const timeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline(practitioner?.userId || '')
  );
  const isFirstTimeCommunitySection = !coach?.clickedClubTab;
  const missingProgramme =
    (practitioner?.isRegistered === null || practitioner?.isRegistered) &&
    !practitioner?.principalHierarchy &&
    !isPrincipal;

  const dashboardNotification = useSelector(
    notificationsSelectors.getDashboardNotification
  );

  // this acceptAgreement is for club leader
  const isPractitionerAcceptAgreementNotification =
    dashboardNotification?.message?.cta?.includes(
      notificationTagConfig.AcceptAgreement.cta!
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
    if (isFromLogin && practitioner?.progress === 0) {
      history.push(ROUTES.PRINCIPAL.SETUP_PROFILE);
    }
  }, []);

  // Sync the coach data -> TODO make a better sync method
  useEffect(() => {
    if (isCoach) {
      appDispatch(traineeThunkActions.syncCoachSmartSpaceVisitData());
      appDispatch(traineeThunkActions.syncTraineeFranchisorAgreementData());
    }
  }, []);

  useEffect(() => {
    //This will prevent points card showing up for coaches
    if (isCoach) {
      return;
    }

    const currentMonth = new Date().getMonth() + 1; // +1 for 0 index
    const currentYear = new Date().getFullYear();
    const pointsTotal = pointsSummaryData.reduce((total, current) => {
      if (current.month === currentMonth && current.year === currentYear) {
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

  const clubCard = useMemo((): ScoreCardProps => {
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
          isPractitionerAcceptAgreementNotification
            ? ROUTES.PRACTITIONER.COMMUNITY.ACCEPT_CLUB_LEADER_ROLE
            : ROUTES.PRACTITIONER.COMMUNITY[
                practitioner?.isNewInClub ? 'WELCOME' : 'ROOT'
              ]
        ),
    };
  }, [club, practitioner]);

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
    if (isOnline) {
      initStaticStoreSetup();
      if (dashboardNotification?.isNew && practitioner?.progress! >= 2) {
        appDispatch(notificationActions.resetFrontendNotificationState());
      }
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
      (async () =>
        await appDispatch(
          pointsThunkActions.getPointsLibrary({
            userId: userData?.id!,
          })
        ).unwrap())();

      if (
        userData.roles?.some(
          (role) =>
            role.systemName === RoleSystemNameEnum.Practitioner ||
            role.systemName === RoleSystemNameEnum.Principal
        )
      ) {
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
            pointsThunkActions.getUserClubStanding({
              userId: userData?.id!,
            })
          ).unwrap())();
      }
    }
  }, [userData]);

  // This dialog prevents a user to access classrooms, before completing profile/programme info
  const showCompleteProfileBlockingDialog = () => {
    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => {
        return <JoinOrAddPreschoolModal onSubmit={onSubmit} />;
      },
    });
  };

  const onNavigation = (navItem: any) => {
    if (
      ((classroom && classroom.id) ||
        (classroomGroups && classroomGroups.length > 0)) &&
      isRegistered &&
      isProgress &&
      isProgress > 0 &&
      hasConsent &&
      !missingProgramme
    ) {
      history.push(navItem.href, navItem.params);
    } else if (navItem.href.includes('classroom') && isWhiteLabel) {
      showCompleteProfileBlockingDialog();
    } else {
      history.push(navItem.href, navItem.params);
    }
  };

  useEffect(() => {
    if (isOnline) {
      if (!!practitioner?.userId && !classroom) {
        (async () =>
          await appDispatch(
            classroomsThunkActions.getClassroom({})
          ).unwrap())();
      }
      if (
        !!practitioner?.userId &&
        (!classroomGroups || !classroomGroups.length)
      ) {
        (async () =>
          await appDispatch(
            classroomsThunkActions.getClassroomGroups({})
          ).unwrap())();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }
      (async () =>
        await appDispatch(childrenThunkActions.getChildren({})).unwrap())();
    }
  }, [practitioner?.userId]);

  const navigation: (NavigationRouteItem | NavigationDropdown)[] = [
    {
      name: NavigationNames.Messages,
      href: ROUTES.MESSAGES,
      icon: styles.messagesIconName,
      current: false,
      showDivider: true,
      getNotificationCount: () => {
        return newNotificationCount;
      },
    },
    {
      name: NavigationNames.Profile.Profile,
      href: isCoach
        ? ROUTES.COACH.PROFILE.ROOT
        : ROUTES.PRACTITIONER.PROFILE.ROOT,
      icon: styles.profileIconName,
      current: false,
      showDivider: true,
      nestedChildren: [
        {
          name: NavigationNames.Profile.Account,
          href: ROUTES.PRACTITIONER.ACCOUNT,
          onNavigation: onNavigation,
          current: false,
        },
        {
          name: NavigationNames.Profile.Preschool,
          href: ROUTES.PRACTITIONER.PROGRAMME_INFORMATION,
          onNavigation: onNavigation,
          current: false,
        },
        {
          name: NavigationNames.Profile.Journey,
          href: ROUTES.PRACTITIONER.PROFILE.ROOT,
          onNavigation: onNavigation,
          params: { tabIndex: 1 },
          current: false,
        },
      ],
    },
    {
      name: NavigationNames.Classroom.Classroom,
      icon: styles.classroomIconName,
      current: false,
      showDivider: true,
      nestedChildren: isPrincipal // && !!practitioners?.length
        ? [
            {
              name: NavigationNames.Classroom.Classes,
              href: ROUTES.CLASSROOM.ROOT,
              onNavigation: onNavigation,
              params: { activeTabIndex: TabsItemForPrincipal.CLASSES },
              current: false,
            },
            {
              name: NavigationNames.Classroom.Attendance,
              href: ROUTES.CLASSROOM.ROOT,
              onNavigation: onNavigation,
              params: { activeTabIndex: TabsItemForPrincipal.ATTENDANCE },
              current: false,
            },
            {
              name: NavigationNames.Classroom.Progress,
              href: ROUTES.CLASSROOM.ROOT,
              onNavigation: onNavigation,
              params: { activeTabIndex: TabsItemForPrincipal.PROGRESS },
              current: false,
            },
            {
              name: NavigationNames.Classroom.Activities,
              href: ROUTES.CLASSROOM.ROOT,
              onNavigation: onNavigation,
              params: { activeTabIndex: TabsItemForPrincipal.ACTIVITES },
              current: false,
            },
            {
              name: NavigationNames.Classroom.Resources,
              href: ROUTES.CLASSROOM.ROOT,
              onNavigation: onNavigation,
              params: { activeTabIndex: TabsItemForPrincipal.RESOURCES },
              current: false,
            },
          ]
        : [
            {
              name: NavigationNames.Classroom.Classes,
              href: ROUTES.CLASSROOM.ROOT,
              params: { activeTabIndex: TabsItems.CLASSES },
              current: false,
            },
            {
              name: NavigationNames.Classroom.Attendance,
              href: ROUTES.CLASSROOM.ROOT,
              params: { activeTabIndex: TabsItems.ATTENDANCE },
              current: false,
            },
            {
              name: NavigationNames.Classroom.Progress,
              href: ROUTES.CLASSROOM.ROOT,
              params: { activeTabIndex: TabsItems.PROGRESS },
              current: false,
            },
            {
              name: NavigationNames.Classroom.Activities,
              href: ROUTES.CLASSROOM.ROOT,
              params: { activeTabIndex: TabsItems.ACTIVITES },
              current: false,
            },
            {
              name: NavigationNames.Classroom.Resources,
              href: ROUTES.CLASSROOM.ROOT,
              params: { activeTabIndex: TabsItems.RESOURCES },
              current: false,
            },
          ],
    },
    ...(isPrincipal || isFundaAppAdmin
      ? [
          {
            name: NavigationNames.Business.Business,
            href: ROUTES.BUSINESS,
            icon: styles.businessIconName,
            current: false,
            showDivider: true,
            nestedChildren: [
              {
                name: NavigationNames.Business.Staff,
                href: ROUTES.BUSINESS,
                onNavigation: onNavigation,
                params: { activeTabIndex: BusinessTabItems.STAFF },
                current: false,
              },
              {
                name: NavigationNames.Business.Money,
                href: ROUTES.BUSINESS,
                onNavigation: onNavigation,
                params: { activeTabIndex: BusinessTabItems.MONEY },
                current: false,
              },
              {
                name: NavigationNames.Business.Resources,
                href: ROUTES.BUSINESS,
                onNavigation: onNavigation,
                params: { activeTabIndex: BusinessTabItems.RESOURCES },
                current: false,
              },
            ],
          },
        ]
      : []),
    {
      name: NavigationNames.Community.Community,
      icon: styles.communityIconName,
      current: false,
      showDivider: true,
      nestedChildren: [
        {
          name: NavigationNames.Community.Community,
          href: isFirstTimeCommunitySection
            ? ROUTES.COMMUNITY.WELCOME
            : ROUTES.COMMUNITY.ROOT,
          params: { isFromDashboard: true } as CommunityRouteState,
          onNavigation: onNavigation,
          current: false,
        },
        {
          name: NavigationNames.Community.Resources,
          href: isFirstTimeCommunitySection
            ? ROUTES.COMMUNITY.WELCOME
            : ROUTES.COMMUNITY.ROOT,
          params: { isFromDashboard: true } as CommunityRouteState,
          onNavigation: onNavigation,
          current: false,
        },
      ],
    },
    {
      name: NavigationNames.Training,
      href: ROUTES.TRAINING,
      icon: styles.trainingIconName,
      current: false,
      showDivider: true,
    },
    {
      name: NavigationNames.Points,
      href: ROUTES.PRACTITIONER.POINTS.SUMMARY,
      icon: styles.pointsIconName,
      current: false,
      showDivider: true,
    },
    {
      name: NavigationNames.Calendar,
      href: ROUTES.CALENDAR,
      icon: styles.calendarIconName,
      current: false,
      showDivider: true,
    },
    {
      name: NavigationNames.Logout,
      href: ROUTES.LOGOUT,
      icon: styles.logoutIconName,
      current: false,
      showDivider: true,
    },
  ];

  const navigationForCoach: (NavigationRouteItem | NavigationDropdown)[] = [
    {
      name: NavigationNames.Home,
      href: ROUTES.ROOT,
      icon: 'HomeIcon',
      current: true,
    },
    {
      name: NavigationNames.Practitioners,
      icon: styles.classroomIconName,
      current: false,
      href: ROUTES.COACH.PRACTITIONERS,
    },
    {
      name: NavigationNames.Profile.Profile,
      href: isCoach
        ? ROUTES.COACH.PROFILE.ROOT
        : ROUTES.PRACTITIONER.PROFILE.ROOT,
      icon: styles.profileIconName,
      current: false,
      showDivider: true,
    },
    {
      name: NavigationNames.Messages,
      href: ROUTES.MESSAGES,
      icon: styles.messagesIconName,
      current: false,
      showDivider: true,
      getNotificationCount: () => {
        return newNotificationCount;
      },
    },
    {
      name: NavigationNames.Community.Community,
      href: isFirstTimeCommunitySection
        ? ROUTES.COMMUNITY.WELCOME
        : ROUTES.COMMUNITY.ROOT,
      params: { isFromDashboard: true } as CommunityRouteState,
      icon: styles.communityIconName,
      current: false,
      showDivider: true,
    },
    {
      name: NavigationNames.Logout,
      href: ROUTES.LOGOUT,
      icon: styles.logoutIconName,
      current: false,
      showDivider: true,
    },
  ];

  const dashboardItems: StackedListItemType[] = [];

  if (isCoach) {
    dashboardItems.push({
      title: NavigationNames.Practitioners,
      titleIcon: styles.classroomIconName,
      titleIconClassName: styles.practitionerIcon,
      onActionClick: () => history.push(ROUTES.COACH.PRACTITIONERS),
      classNames: 'bg-uiBg',
    });
  }

  if (!isCoach) {
    dashboardItems.push({
      title: NavigationNames.Classroom.Classroom,
      titleIcon: styles.classroomIconName,
      titleIconClassName: styles.classRoomIcon,
      classNames: 'bg-secondaryAccent2',
      onActionClick: () => {
        goToClassroom();
      },
    });
  }

  if (!isCoach && !isPrincipal && isPractitioner) {
    dashboardItems.splice(1, 0, {
      title: NavigationNames.Community.Community,
      titleIcon: styles.communityIconName,
      titleIconClassName: styles.communityIcon,
      onActionClick: () => {
        goToCommunity();
      },
      classNames: 'bg-quatenaryBg',
    });
  }

  if (isPrincipal || isFundaAppAdmin) {
    dashboardItems.splice(1, 0, {
      title: NavigationNames.Business.Business,
      titleIcon: styles.businessIconName,
      titleIconClassName: styles.businessIcon,
      onActionClick: () => {
        goToBusiness();
      },
      classNames: 'bg-warningBg',
    });
    dashboardItems.splice(2, 0, {
      title: NavigationNames.Community.Community,
      titleIcon: styles.communityIconName,
      titleIconClassName: styles.communityIcon,
      onActionClick: () => {
        goToCommunity();
      },
      classNames: 'bg-quatenaryBg',
    });
  }

  const goToCommunity = () => {
    if (
      ((classroom && classroom.id) ||
        (classroomGroups && classroomGroups.length > 0)) &&
      isRegistered &&
      isProgress &&
      isProgress > 0 &&
      hasConsent &&
      !missingProgramme &&
      isWhiteLabel
    ) {
      history.push(
        isFirstTimeCommunitySection
          ? ROUTES.COMMUNITY.WELCOME
          : ROUTES.COMMUNITY.ROOT,
        { isFromDashboard: true } as CommunityRouteState
      );
    } else {
      showCompleteProfileBlockingDialog();
    }
  };

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
    const profileRoute = userData?.roles?.some(
      (role) => role.systemName === RoleSystemNameEnum.Coach
    )
      ? ROUTES.COACH.PROFILE.ROOT
      : ROUTES.PRACTITIONER.PROFILE.ROOT;

    history.push(profileRoute);
  };

  const goToClassroom = () => {
    // TODO: revert this change
    history.push(ROUTES.CLASSROOM.ROOT, {
      activeTabIndex: TabsItems.CLASSES,
    });
    // if (
    //   ((classroom && classroom.id) ||
    //     (classroomGroups && classroomGroups.length > 0)) &&
    //   isRegistered &&
    //   isProgress &&
    //   isProgress > 0 &&
    //   hasConsent &&
    //   !missingProgramme &&
    //   isWhiteLabel
    // ) {
    //   history.push(ROUTES.CLASSROOM.ROOT, {
    //     activeTabIndex: TabsItems.CLASSES,
    //   });
    // } else {
    //   showCompleteProfileBlockingDialog();
    // }
  };

  const goToCalendar = () => {
    if (
      ((classroom && classroom.id) ||
        (classroomGroups && classroomGroups.length > 0)) &&
      isRegistered &&
      isProgress &&
      isProgress > 0 &&
      hasConsent &&
      !missingProgramme
    ) {
      history.push(ROUTES.CALENDAR);
    } else {
      showCompleteProfileBlockingDialog();
    }
  };

  const goToBusiness = () => {
    if (isPrincipal || isFundaAppAdmin) {
      history.push(ROUTES.BUSINESS);
      return;
    }
  };

  const goToTraining = () => {
    if (
      ((classroom && classroom.id) ||
        (classroomGroups && classroomGroups.length > 0)) &&
      isRegistered &&
      isProgress &&
      isProgress > 0 &&
      hasConsent &&
      !missingProgramme &&
      isWhiteLabel
    ) {
      history.push(ROUTES.TRAINING);
    } else {
      showCompleteProfileBlockingDialog();
    }
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
      menuLogoUrl={hamburgerLogo}
      calendarRender={() => {
        return (
          <IconBadge
            onClick={() => goToCalendar()}
            badgeColor={'errorMain'}
            badgeTextColor={'white'}
            icon={styles.calendarIconName}
            iconColor={'white'}
            badgeText={''}
          />
        );
      }}
      notificationRender={() => {
        return (
          <IconBadge
            onClick={() => history.push(ROUTES.MESSAGES)}
            badgeColor={'errorMain'}
            badgeTextColor={'white'}
            icon={styles.messagesIconName}
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
        text={`Hi ${userData && userData?.firstName}!`}
        className={styles.welcomeText}
      />
      <div className={`${!classroom ? styles.wrapper : ''} pb-4`}>
        <DashboardItems
          listItems={dashboardItems}
          notification={dashboardNotification}
        />
        {!!pointsScoreProps && !isCoach && (
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
        {/* {isPractitioner && !!club && !!club?.league?.id && isOnline && (
          <ScoreCard
            className="h-20"
            mainText={clubCard.mainText}
            hint={clubCard.hint}
            hintClassName={clubCard.hintClassName}
            textPosition="left"
            currentPoints={clubCard.currentPoints}
            maxPoints={clubCard.maxPoints}
            onClick={clubCard.onClick}
            barBgColour={clubCard.barBgColour}
            barColour={clubCard.barColour}
            bgColour={clubCard.bgColour}
            image={clubCard.image}
            textColour={clubCard.textColour}
          />
        )} */}
        {/* {isPractitioner &&
          (!club || (!!club && !club?.league?.id) || (!!club && !isOnline)) && (
            <div className="mt-1">
              <TitleListItem
                item={{
                  title: !!club ? club?.name : 'Community',
                  titleIcon: 'UserGroupIcon',
                  titleIconClassName: styles.communityIcon,
                  classNames: 'bg-uiBg',
                  onActionClick: () =>
                    history.push(
                      isPractitionerAcceptAgreementNotification
                        ? ROUTES.PRACTITIONER.COMMUNITY.ACCEPT_CLUB_LEADER_ROLE
                        : ROUTES.PRACTITIONER.COMMUNITY[
                            practitioner?.isNewInClub ? 'WELCOME' : 'ROOT'
                          ]
                    ),
                }}
              />
            </div>
          )} */}
      </div>
    </BannerWrapper>
  );
};

export default Dashboard;
