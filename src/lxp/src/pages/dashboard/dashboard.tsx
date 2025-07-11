/* eslint-disable react-hooks/exhaustive-deps */
import { RoleSystemNameEnum, useDialog, useTheme } from '@ecdlink/core';
import { UserSyncStatus } from '@ecdlink/graphql';
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
  NoPointsScoreCard,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useDocuments } from '@hooks/useDocuments';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { OfflineSyncModal, SyncTimeExceeded } from '../../modals';
import OfflineSyncTimeExceeded from '../../modals/offline-sync/offline-sync-time-exceeded';
import { useAppDispatch } from '@store';
import { classroomsSelectors, classroomsThunkActions } from '@store/classroom';
import {
  notificationActions,
  notificationsSelectors,
} from '@store/notifications';
import { settingSelectors } from '@store/settings';
import { userSelectors, userThunkActions } from '@store/user';
import { analyticsActions } from '@store/analytics';
import { DashboardItems } from './components/dashboard-items/dashboard-items';
import TransparentLayer from '../../assets/TransparentLayer.png';

import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import * as styles from './dashboard.styles';
import ROUTES from '@routes/routes';
import { statementsThunkActions } from '@/store/statements';
import { programmeThunkActions } from '@/store/programme';
import offlineStatments from '../../assets/statements-offline.png';
import { setStorageItem } from '@/utils/common/local-storage.utils';
import { convertImageToBase64 } from '@/utils/common/convert-image-to-64.utils';
import { pointsSelectors, pointsThunkActions } from '@/store/points';
import { pointsConstants } from '@/constants/points';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '../../assets/neutral_blue_emoticon.svg';
import { ReactComponent as EmojiOrangeSmile } from '../../assets/mehFace.svg';
import { ScoreCardProps } from '@ecdlink/ui/lib/components/score-card/score-card.types';
import { syncThunkActions } from '@store/sync';
import { settingActions } from '@/store/settings';

import {
  TabsItemForPrincipal,
  TabsItems,
} from '../classroom/class-dashboard/class-dashboard.types';
import { NavigationNames } from '../navigation';
import hamburgerLogo from '../../assets/logos/hamburgerLogo.png';
import { BusinessTabItems } from '../business/business.types';
import { useTenant } from '@/hooks/useTenant';
import { JoinOrAddPreschoolModal } from '@/components/join-or-add-preschool-modal/join-or-add-preschool-modal';
import { differenceInDays, getMonth, getYear } from 'date-fns';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import DashboardWrapper from './dashboard-wrapper/dashboard-wrapper';
import { useAppContext } from '@/walkthrougContext';
import { useTenantModules } from '@/hooks/useTenantModules';
import { PermissionsNames } from '../principal/components/add-practitioner/add-practitioner.types';
import { usePoints } from '@/hooks/usePoints';
import { usePointsToDoEmoji } from '@/hooks/usePointsToDoEmoji';
import { useStoreSetup } from '@hooks/useStoreSetup';

const { version } = require('../../../package.json');

export interface DashboardRouteState {
  isFromLogin?: boolean;
  isFromCompleteProfile?: boolean;
}

export const Dashboard: React.FC = () => {
  const location = useLocation<DashboardRouteState>();
  const isFromLogin = location?.state?.isFromLogin;
  const isFromCompleteProfile = location?.state?.isFromCompleteProfile;
  const tenant = useTenant();
  const {
    attendanceEnabled,
    businessEnabled,
    calendarEnabled,
    classroomActivitiesEnabled,
    progressEnabled,
    trainingEnabled,
  } = useTenantModules();

  const appName = tenant?.tenant?.applicationName;
  const isOpenAccess = tenant?.isOpenAccess;
  const isWhiteLabel = tenant?.isWhiteLabel;
  const shouldUserSyncOffline = useSelector(settingSelectors.getShouldUserSync);
  const shouldUserSyncOnline = useSelector(
    settingSelectors.getShouldUserSyncOnline
  );
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const userData = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
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
  const { setState } = useAppContext();
  const { resetAppStore, resetAuth } = useStoreSetup();
  const { refreshClassroom, refreshChildren } = useStoreSetup();
  const isPractitioner = !!practitioner;
  const isPrincipal = practitioner?.isPrincipal;
  const isRegistered = practitioner?.isRegistered;
  const isProgress = practitioner?.progress;
  const hasConsent = practitioner?.shareInfo;

  const missingProgramme =
    (practitioner?.isRegistered === null || practitioner?.isRegistered) &&
    !practitioner?.principalHierarchy &&
    !isPrincipal;
  const wlNotAcceptThePrincipalInvite =
    !classroom && practitioner?.principalHierarchy;
  const isTrialPeriod = useIsTrialPeriod();

  const dashboardNotification = useSelector(
    notificationsSelectors.getDashboardNotification
  );

  const pointsSummaryData = useSelector(pointsSelectors.getPointsSummary);
  const [pointsScoreProps, setPointsScoreProps] = useState<ScoreCardProps>();
  const totalYearPoints = useSelector(pointsSelectors.getTotalYearPoints);

  const planActivitiesPermission = practitioner?.permissions?.find(
    (item) =>
      item?.permissionName === PermissionsNames.plan_classroom_actitivies
  );

  const getUserSyncStatus = useCallback(async () => {
    const userSyncStatus: UserSyncStatus = await appDispatch(
      userThunkActions.getUserSyncStatus({ userId: practitioner?.userId! })
    ).unwrap();

    if (userSyncStatus) {
      if (userSyncStatus.syncChildren) {
        await refreshChildren();
      }
      if (userSyncStatus.syncClassroom) {
        await refreshClassroom();
      }
      if (userSyncStatus.syncReportingPeriods) {
        appDispatch(
          classroomsThunkActions.getClassroom({ overrideCache: true })
        ).unwrap();
      }
      if (userSyncStatus.syncPermissions) {
        appDispatch(
          practitionerThunkActions.getPractitionerPermissions({
            userId: practitioner?.userId!,
          })
        );
      }
      if (userSyncStatus.syncPoints) {
        appDispatch(
          pointsThunkActions.pointsTodoItems({ userId: practitioner?.userId! })
        );

        appDispatch(
          pointsThunkActions.yearPointsView({ userId: practitioner?.userId! })
        );

        appDispatch(
          pointsThunkActions.sharedData({
            userId: practitioner?.userId!,
            isMonthly: true,
          })
        );
        const currentDate = new Date();
        const oneYearAgo = new Date();

        oneYearAgo.setMonth(currentDate.getMonth() - 12);
        (async () =>
          await appDispatch(
            pointsThunkActions.getPointsSummaryForUser({
              userId: practitioner?.userId!,
              startDate: oneYearAgo,
              endDate: currentDate,
            })
          ).unwrap())();
      }
    }
  }, [appDispatch, practitioner?.userId]);

  useEffect(() => {
    if (isOnline && !isCoach && practitioner) {
      getUserSyncStatus();
    }
  }, [practitioner?.userId]);

  const offlineCommunity = () => {
    if (!isOnline) {
      return dialog({
        color: 'bg-white',
        position: DialogPosition.Middle,
        blocking: true,
        render: (onSubmit) => {
          return <OnlineOnlyModal onSubmit={onSubmit} />;
        },
      });
    }
  };

  useEffect(() => {
    if (
      isFromLogin &&
      practitioner?.progress === 0 &&
      !isOpenAccess &&
      !practitioner?.principalHierarchy
    ) {
      history.push(ROUTES.PRINCIPAL.SETUP_PROFILE);
    }

    if (
      isFromLogin &&
      practitioner?.progress === 0 &&
      !isOpenAccess &&
      practitioner?.principalHierarchy
    ) {
      history.push(ROUTES.PRACTITIONER.PROFILE.EDIT);
    }
  }, []);

  useEffect(() => {
    //This will prevent points card showing up for coaches
    if (isCoach) {
      return;
    }

    const currentMonth = new Date().getMonth(); // +1 for 0 index

    const currentYear = new Date().getFullYear();

    const pointsTotal = pointsSummaryData.reduce((total, current) => {
      const dataMonth = getMonth(new Date(current?.dateScored));

      const dataYear = getYear(new Date(current?.dateScored));
      if (dataMonth === currentMonth && dataYear === currentYear) {
        return (total += current.pointsTotal);
      }
      return total;
    }, 0);

    let pointsMax = isPrincipal
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
        barColour: 'alertMain',
        bgColour: 'alertBg',
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
        barColour: 'quatenary',
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

  const handle30DaysExpired = () => {
    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onSubmit, onCancel) => {
        return (
          <ActionModal
            title={`Share more information to keep using ${appName}`}
            detailText={`Don't worry, ${tenant.tenant?.applicationName} will continue to be completely free. We manage your information responsibly.`}
            actionButtons={[
              {
                text: 'Join or set up a preschool',
                textColour: 'white',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => {
                  onSubmit();
                  history.push(ROUTES?.PRINCIPAL.SETUP_PROFILE);
                },
                leadingIcon: 'ArrowCircleRightIcon',
              },
            ]}
            icon={'QuestionMarkCircleIcon'}
            iconClassName="w-96 h-96"
            className="bg-white"
            iconColor="infoMain"
          />
        );
      },
    });
  };

  useEffect(() => {
    if (practitioner?.startDate) {
      const diffDays = differenceInDays(
        new Date(),
        new Date(practitioner?.startDate)
      );

      if (diffDays > 30 && !classroom?.preschoolCode && isOpenAccess) {
        handle30DaysExpired();
      }
    }
  }, []);

  useEffect(() => {
    if (isFromCompleteProfile && !practitioner?.isPrincipal) {
      setState({ run: true, tourActive: true, stepIndex: 1 });
    }
  }, []);

  useEffect(() => {
    if (isFromCompleteProfile && practitioner?.isPrincipal) {
      setState({ run: true, tourActive: true, stepIndex: 0 });
    }
  }, []);

  const { userProfilePicture } = useDocuments();

  const initStaticStoreSetup = async () => {
    const promises = [
      appDispatch(
        programmeThunkActions.getProgrammes({ classroomId: classroom?.id })
      ).unwrap(),
      appDispatch(statementsThunkActions.getAllExpensesTypes({})).unwrap(),
      appDispatch(statementsThunkActions.getAllIncomeTypes({})).unwrap(),
      appDispatch(statementsThunkActions.getAllPayType({})).unwrap(),
    ];

    Promise.allSettled(promises);
  };

  useEffect(() => {
    convertImageToBase64(offlineStatments, setStorageItem);
  }, []);

  useEffect(() => {
    if (isOnline) {
      initStaticStoreSetup();
      if (
        dashboardNotification?.isNew &&
        practitioner?.progress! >= 2 &&
        isFromCompleteProfile
      ) {
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

  // This dialog prevents a user to access classrooms, before completing profile/programme info
  const showCompleteProfileBlockingDialog = () => {
    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => {
        return (
          <JoinOrAddPreschoolModal
            onSubmit={onSubmit}
            isTrialPeriod={!!isTrialPeriod}
          />
        );
      },
    });
  };

  const onNavigation = (navItem: any) => {
    if (navItem.href.includes('community') && !isOnline) {
      history.push(ROUTES.DASHBOARD);
      offlineCommunity();
      return;
    }
    if (
      ((classroom &&
        classroom.id &&
        classroomGroups &&
        classroomGroups.length > 0) ||
        (practitioner?.progress === 2 && classroom && classroom?.name) ||
        (classroomGroups && classroomGroups.length > 0)) &&
      isRegistered &&
      isProgress &&
      isProgress > 0 &&
      hasConsent &&
      !missingProgramme
    ) {
      history.push(navItem.href, navItem.params);
    } else if (
      (navItem.href.includes('classroom') &&
        ((isWhiteLabel && missingProgramme) ||
          wlNotAcceptThePrincipalInvite)) ||
      (navItem.href.includes('calendar') &&
        ((isWhiteLabel && missingProgramme) ||
          wlNotAcceptThePrincipalInvite)) ||
      (navItem.href.includes('training') &&
        ((isWhiteLabel && missingProgramme) ||
          wlNotAcceptThePrincipalInvite)) ||
      (navItem.href.includes('community') &&
        ((isWhiteLabel && missingProgramme) ||
          wlNotAcceptThePrincipalInvite)) ||
      (navItem.href.includes('/practitioner/programme-information') &&
        ((isWhiteLabel && missingProgramme) || wlNotAcceptThePrincipalInvite))
    ) {
      showCompleteProfileBlockingDialog();
    } else {
      history.push(navItem.href, navItem.params);
    }
  };

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
          href: ROUTES.PRACTITIONER.ABOUT.ROOT,
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
              hideItem: !attendanceEnabled && isWhiteLabel,
            },
            {
              name: NavigationNames.Classroom.Progress,
              href: ROUTES.CLASSROOM.ROOT,
              onNavigation: onNavigation,
              params: { activeTabIndex: TabsItemForPrincipal.PROGRESS },
              current: false,
              hideItem: !progressEnabled && isWhiteLabel,
            },
            {
              name: NavigationNames.Classroom.Activities,
              href: ROUTES.CLASSROOM.ROOT,
              onNavigation: onNavigation,
              params: { activeTabIndex: TabsItemForPrincipal.ACTIVITES },
              current: false,
              hideItem: !classroomActivitiesEnabled && isWhiteLabel,
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
    ...(isPrincipal || isTrialPeriod
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
                hideItem: !businessEnabled && isWhiteLabel,
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
      name: NavigationNames.Training,
      href: ROUTES.TRAINING,
      icon: styles.trainingIconName,
      current: false,
      showDivider: true,
      hideItem: !trainingEnabled && isWhiteLabel,
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
      hideItem: !calendarEnabled && isWhiteLabel,
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
    },
    {
      name: NavigationNames.Practitioners,
      icon: styles.classroomIconName,
      current: false,
      href: ROUTES.COACH.PRACTITIONERS,
    },
    {
      name: NavigationNames.Training,
      href: ROUTES.TRAINING,
      icon: styles.trainingIconName,
      current: false,
      showDivider: true,
      hideItem: !trainingEnabled && isWhiteLabel,
    },
    {
      name: NavigationNames.Calendar,
      href: ROUTES.CALENDAR,
      icon: styles.calendarIconName,
      current: false,
      showDivider: true,
      hideItem: !calendarEnabled && isWhiteLabel,
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

  if (!isCoach && !isPrincipal && isPractitioner && !isTrialPeriod) {
    dashboardItems.splice(1, 0, {
      title: NavigationNames.Community.Community,
      titleIcon: styles.communityIconName,
      titleIconClassName: styles.communityIcon,
      onActionClick: !isOnline
        ? () => offlineCommunity()
        : () => goToCommunity(),
      classNames: 'bg-quatenaryBg',
    });
  }

  if (isPrincipal || isTrialPeriod) {
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
      onActionClick: !isOnline
        ? () => offlineCommunity()
        : () => goToCommunity(),
      classNames: 'bg-quatenaryBg',
    });
  }

  if ((trainingEnabled && isWhiteLabel) || isOpenAccess)
    dashboardItems.splice(4, 0, {
      title: NavigationNames.Training,
      titleIcon: 'PresentationChartBarIcon',
      titleIconClassName: styles.trainingIcon,
      onActionClick: !isOnline
        ? () => offlineCommunity()
        : () => goToTraining(),
      classNames: 'bg-tertiaryAccent2',
    });

  // const goToCommunity = () => {
  //   if (
  //     (classroom &&
  //       classroom.id &&
  //       classroomGroups &&
  //       classroomGroups.length > 0) ||
  //     (practitioner?.progress === 2 && classroom && classroom?.name) ||
  //     (classroomGroups &&
  //       classroomGroups.length > 0 &&
  //       isRegistered &&
  //       isProgress &&
  //       isProgress > 0 &&
  //       hasConsent &&
  //       !missingProgramme) ||
  //     isTrialPeriod
  //   ) {
  //     history?.push(ROUTES.COMMUNITY.WELCOME);
  //   } else if (
  //     (missingProgramme && isWhiteLabel) ||
  //     wlNotAcceptThePrincipalInvite
  //   ) {
  //     showCompleteProfileBlockingDialog();
  //   }
  // };

  const goToCommunity = () => {
    if (isOpenAccess) {
      if (
        (classroom &&
          classroom.id &&
          classroomGroups &&
          classroomGroups.length > 0) ||
        (practitioner?.progress === 2 && classroom && classroom?.name) ||
        (classroomGroups &&
          classroomGroups.length > 0 &&
          isRegistered &&
          isProgress &&
          isProgress > 0 &&
          hasConsent &&
          !missingProgramme) ||
        isTrialPeriod
      ) {
        history?.push(ROUTES.COMMUNITY.WELCOME);
      } else if (missingProgramme || wlNotAcceptThePrincipalInvite) {
        showCompleteProfileBlockingDialog();
      }
    } else {
      if (
        ((classroom &&
          classroom.id &&
          classroomGroups &&
          classroomGroups.length > 0) ||
          (practitioner?.progress === 2 && classroom && classroom?.name) ||
          (classroomGroups && classroomGroups.length > 0)) &&
        isRegistered &&
        isProgress &&
        isProgress > 0 &&
        hasConsent &&
        !missingProgramme
      ) {
        history?.push(ROUTES.COMMUNITY.WELCOME);
      } else if (missingProgramme || wlNotAcceptThePrincipalInvite) {
        showCompleteProfileBlockingDialog();
      }
    }
  };

  useEffect(() => {
    if (shouldUserSyncOffline) {
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
  }, [shouldUserSyncOffline]);

  useEffect(() => {
    if (isOnline && shouldUserSyncOnline) {
      dialog({
        position: DialogPosition.Middle,
        blocking: true,
        render: (onSubmit) => {
          return (
            <SyncTimeExceeded
              onSubmit={async () => {
                if (practitioner?.isPrincipal === true) {
                  await appDispatch(syncThunkActions.syncOfflineData({}));
                } else {
                  await appDispatch(
                    syncThunkActions.syncOfflineDataForPractitioner({})
                  );
                }
                await resetAppStore();
                await resetAuth();
                return history.push(ROUTES.LOGIN);
              }}
            ></SyncTimeExceeded>
          );
        },
      });
    }
  }, [isOnline, shouldUserSyncOnline]);

  const goToProfile = () => {
    const profileRoute = userData?.roles?.some(
      (role) => role.systemName === RoleSystemNameEnum.Coach
    )
      ? ROUTES.COACH.PROFILE.ROOT
      : ROUTES.PRACTITIONER.PROFILE.ROOT;

    history.push(profileRoute);
  };

  // const goToClassroom = () => {
  //   if (
  //     (classroom &&
  //       !!classroom.id &&
  //       classroomGroups &&
  //       classroomGroups.length > 0) ||
  //     (practitioner?.progress === 2 && classroom && classroom?.name) ||
  //     (classroomGroups &&
  //       classroomGroups.length > 0 &&
  //       !!classroom?.id &&
  //       isRegistered &&
  //       isProgress &&
  //       isProgress > 0 &&
  //       hasConsent &&
  //       !missingProgramme) ||
  //     isTrialPeriod
  //   ) {
  //     history.push(ROUTES.CLASSROOM.ROOT, {
  //       activeTabIndex: TabsItems.CLASSES,
  //     });
  //   } else if (
  //     (missingProgramme && isWhiteLabel) ||
  //     wlNotAcceptThePrincipalInvite
  //   ) {
  //     showCompleteProfileBlockingDialog();
  //   }
  // };

  const goToClassroom = () => {
    if (
      (classroom && classroom.id) ||
      (practitioner?.progress === 2 && classroom && classroom?.name) ||
      (classroom?.id &&
        isRegistered &&
        isProgress &&
        isProgress > 0 &&
        hasConsent &&
        !missingProgramme) ||
      isTrialPeriod
    ) {
      history.push(ROUTES.CLASSROOM.ROOT, {
        activeTabIndex: TabsItems.CLASSES,
      });
    } else if (
      (missingProgramme && isWhiteLabel) ||
      wlNotAcceptThePrincipalInvite
    ) {
      showCompleteProfileBlockingDialog();
    }
  };

  const goToCalendar = () => {
    if (isCoach) {
      history.push(ROUTES.CALENDAR);
    } else if (
      (((classroom &&
        classroom.id &&
        classroomGroups &&
        classroomGroups?.length > 0) ||
        (practitioner?.progress === 2 && classroom && classroom?.name) ||
        (classroomGroups && classroomGroups.length > 0)) &&
        isRegistered &&
        isProgress &&
        isProgress > 0 &&
        hasConsent &&
        !missingProgramme) ||
      isTrialPeriod
    ) {
      history.push(ROUTES.CALENDAR);
    } else if (
      (missingProgramme && isWhiteLabel) ||
      wlNotAcceptThePrincipalInvite
    ) {
      showCompleteProfileBlockingDialog();
    }
  };

  const goToBusiness = () => {
    if (isPrincipal || isTrialPeriod) {
      history.push(ROUTES.BUSINESS);
      return;
    }
  };

  const goToTraining = () => {
    if (
      (((classroom &&
        classroom.id &&
        classroomGroups &&
        classroomGroups?.length > 0) ||
        (practitioner?.progress === 2 && classroom && classroom?.name) ||
        (classroomGroups && classroomGroups.length > 0)) &&
        isRegistered &&
        isProgress &&
        isProgress > 0 &&
        hasConsent &&
        !missingProgramme) ||
      isTrialPeriod ||
      isCoach
    ) {
      history.push(ROUTES.TRAINING);
    } else if (
      (missingProgramme && isWhiteLabel) ||
      wlNotAcceptThePrincipalInvite
    ) {
      showCompleteProfileBlockingDialog();
    }
  };

  const profilePc =
    userProfilePicture?.file ||
    userData?.profileImageUrl ||
    userProfilePicture?.reference;

  // Hooks for points
  const {
    phase1StatusText,
    isPhase1Completed,
    getCurrentPointsToDo,
    renderPointsToDoProgressBarColor,
    renderPointsToDoScoreCardBgColor,
    showPhase2Card,
  } = usePoints();

  const { renderPointsToDoEmoji } = usePointsToDoEmoji();

  const name =
    userData && userData?.firstName
      ? `Hi ${userData && userData?.firstName}!`
      : 'Welcome!';

  return (
    <>
      <DashboardWrapper />
      <BannerWrapper
        backgroundColour={'white'}
        backgroundImageColour={'primary'}
        avatar={
          profilePc ? (
            <div id="wantToConnectWithPrincipal">
              <div id="wantToConnectWithPrincipal2">
                <Avatar dataUrl={profilePc} size={'sm'} displayBorder={true} />
              </div>
            </div>
          ) : (
            <div id="wantToConnectWithPrincipal">
              <div id="wantToConnectWithPrincipal2">
                <UserAvatar
                  size="sm-md"
                  color="secondary"
                  displayBorder
                  borderColour="secondary"
                />
              </div>
            </div>
          )
        }
        menuItems={isCoach ? navigationForCoach : navigation}
        onNavigation={onNavigation}
        menuLogoUrl={theme?.images?.logoUrl || hamburgerLogo}
        calendarRender={
          (calendarEnabled && isWhiteLabel) || isOpenAccess
            ? () => {
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
              }
            : () => {}
        }
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
        backgroundUrl={TransparentLayer}
        className={styles.bannerContent}
        displayOffline={!isOnline}
        version={`v ${version}`}
      >
        <Typography
          type={'h1'}
          color="white"
          text={name}
          className={styles.welcomeText}
        />
        <div className={`${styles.wrapper} pb-4`}>
          <DashboardItems
            listItems={dashboardItems}
            notification={dashboardNotification}
          />

          {/* Score Card for phase 1 */}
          {(!isPhase1Completed && !isCoach) || totalYearPoints === 0 ? (
            <NoPointsScoreCard
              image={renderPointsToDoEmoji}
              className="mt-1 w-full py-4"
              mainText={''}
              currentPoints={getCurrentPointsToDo}
              maxPoints={
                isTrialPeriod
                  ? 6
                  : practitioner?.isPrincipal ||
                    (!practitioner?.isPrincipal &&
                      planActivitiesPermission?.isActive === true)
                  ? 4
                  : 3
              }
              barBgColour="white"
              barColour={renderPointsToDoProgressBarColor}
              bgColour={renderPointsToDoScoreCardBgColor}
              textColour="black"
              onClick={() => history.push(ROUTES.PRACTITIONER.POINTS.SUMMARY)}
              isBigTitle={false}
              hint={phase1StatusText}
              textPosition="left"
            />
          ) : null}

          {/* Score Card for phase 2 */}
          {isPhase1Completed &&
          showPhase2Card &&
          totalYearPoints &&
          totalYearPoints > 0 &&
          !isCoach &&
          !!pointsScoreProps ? (
            <ScoreCard
              className="mt-1 mb-1 h-20 w-full"
              progressBarClassName="flex pt-2"
              mainText={pointsScoreProps?.mainText!}
              hint={pointsScoreProps?.hint}
              currentPoints={pointsScoreProps?.currentPoints!}
              maxPoints={pointsScoreProps?.maxPoints!}
              onClick={pointsScoreProps?.onClick!}
              barBgColour={pointsScoreProps?.barBgColour!}
              barColour={pointsScoreProps?.barColour!}
              bgColour={pointsScoreProps?.bgColour!}
              image={pointsScoreProps?.image!}
              textColour={pointsScoreProps?.textColour!}
              textPosition={pointsScoreProps?.textPosition!}
            />
          ) : null}
        </div>
      </BannerWrapper>
    </>
  );
};

export default Dashboard;
