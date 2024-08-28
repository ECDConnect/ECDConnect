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
  NoPointsScoreCard,
} from '@ecdlink/ui';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

import { practitionerSelectors } from '@/store/practitioner';
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
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '@ecdlink/ui/src/assets/emoji/emoji_blue_smileEyes.svg';
import { ReactComponent as EmojiOrangeSmile } from '../../assets/mehFace.svg';
import { ScoreCardProps } from '@ecdlink/ui/lib/components/score-card/score-card.types';
import { CommunityRouteState } from '../community-old/community.types';
import { coachSelectors } from '@/store/coach';
import { getClubForPractitionerSelector } from '@/store/club/club.selectors';
import { isCurrentPointsAtLeast80PercentOfTotal } from '../community-old/clubs-tab/club/individual-club-view';
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
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { differenceInDays, getMonth, getYear } from 'date-fns';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import DashboardWrapper from './dashboard-wrapper/dashboard-wrapper';
import { useAppContext } from '@/walkthrougContext';
import { useTenantModules } from '@/hooks/useTenantModules';
import {
  CalendarIcon,
  ClipboardCheckIcon,
  FireIcon,
} from '@heroicons/react/solid';
import { ReactComponent as Kindgarden } from '@/assets//icon/kindergarten1.svg';
import { ReactComponent as Crown } from '@/assets//icon/crown.svg';

const { version } = require('../../../package.json');

export interface DashboardRouteState {
  isFromTraineeFlow?: boolean;
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
    coachRoleEnabled,
    progressEnabled,
    trainingEnabled,
  } = useTenantModules();

  const appName = tenant?.tenant?.applicationName;
  const isOpenAccess = tenant?.isOpenAccess;
  const isWhiteLabel = tenant?.isWhiteLabel;
  const club = useSelector(getClubForPractitionerSelector);
  const shouldUserSync = useSelector(settingSelectors.getShouldUserSync);
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const userData = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
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
  const { setState } = useAppContext();

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
  const isTrialPeriod = useIsTrialPeriod();

  const dashboardNotification = useSelector(
    notificationsSelectors.getDashboardNotification
  );

  // this acceptAgreement is for club leader
  const isPractitionerAcceptAgreementNotification =
    dashboardNotification?.message?.cta?.includes(
      notificationTagConfig.AcceptAgreement.cta!
    );

  const pointsSummaryData = useSelector(pointsSelectors.getPointsSummary);
  const [pointsScoreProps, setPointsScoreProps] = useState<ScoreCardProps>();
  const pointsToDo = useSelector(pointsSelectors.getPointsToDo);
  const totalYearPoints = useSelector(pointsSelectors.getTotalYearPoints);

  const getPointsToDoItems = useCallback(async () => {
    appDispatch(
      pointsThunkActions.pointsTodoItems({ userId: practitioner?.userId! })
    );

    appDispatch(
      pointsThunkActions.yearPointsView({ userId: practitioner?.userId! })
    );
  }, [appDispatch, practitioner?.userId]);

  useEffect(() => {
    if (!coach && isOnline && practitioner) {
      getPointsToDoItems();
    }
  }, []);

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

    const currentMonth = new Date().getMonth(); // +1 for 0 index

    const currentYear = new Date().getFullYear();

    const pointsTotal = pointsSummaryData.reduce((total, current) => {
      const dataMonth = getMonth(new Date(current?.dateScored));
      const dataYear = getYear(new Date(current?.dateScored));
      if (dataMonth + 1 === currentMonth && dataYear === currentYear) {
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

    const promises = [
      appDispatch(settingThunkActions.getSettings({})).unwrap(),
      appDispatch(staticDataThunkActions.getRelations({})).unwrap(),
      appDispatch(staticDataThunkActions.getProgrammeTypes({})).unwrap(),
      appDispatch(
        programmeThunkActions.getProgrammes({ classroomId: classroom?.id })
      ).unwrap(),
      appDispatch(
        staticDataThunkActions.getProgrammeAttendanceReasons({})
      ).unwrap(),
      appDispatch(staticDataThunkActions.getGenders({})).unwrap(),
      appDispatch(staticDataThunkActions.getRaces({})).unwrap(),
      appDispatch(staticDataThunkActions.getLanguages({})).unwrap(),
      appDispatch(staticDataThunkActions.getEducationLevels({})).unwrap(),
      appDispatch(
        staticDataThunkActions.getHolidays({ year: today.getFullYear() })
      ).unwrap(),
      appDispatch(staticDataThunkActions.getProvinces({})).unwrap(),
      appDispatch(staticDataThunkActions.getReasonsForLeaving({})).unwrap(),
      appDispatch(
        staticDataThunkActions.getReasonsForPractitionerLeaving({})
      ).unwrap(),
      appDispatch(
        staticDataThunkActions.getReasonsForPractitionerLeavingProgramme({})
      ).unwrap(),
      appDispatch(staticDataThunkActions.getGrants({})).unwrap(),
      appDispatch(staticDataThunkActions.getDocumentTypes({})).unwrap(),
      appDispatch(staticDataThunkActions.getNoteTypes({})).unwrap(),
      appDispatch(staticDataThunkActions.getPermissions({})).unwrap(),
      appDispatch(staticDataThunkActions.getCommunitySkills({})).unwrap(),
      appDispatch(staticDataThunkActions.getWorkflowStatuses({})).unwrap(),
      appDispatch(statementsThunkActions.getAllExpensesTypes({})).unwrap(),
      appDispatch(statementsThunkActions.getAllIncomeTypes({})).unwrap(),
      appDispatch(statementsThunkActions.getAllPayType({})).unwrap(),

      appDispatch(
        activityThunkActions.getActivities({ locale: 'en-za' })
      ).unwrap(),

      appDispatch(
        storyBookThunkActions.getStoryBooks({ locale: 'en-za' })
      ).unwrap(),

      appDispatch(
        programmeThemeThunkActions.getProgrammeThemes({ locale: 'en-za' })
      ).unwrap(),

      appDispatch(
        calendarThunkActions.getCalendarEventTypes({ locale: 'en-za' })
      ).unwrap(),
    ];

    Promise.allSettled(promises);
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
      ((classroom && classroom.id) ||
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
        isWhiteLabel &&
        missingProgramme) ||
      (navItem.href.includes('calendar') && isWhiteLabel && missingProgramme) ||
      (navItem.href.includes('training') && isWhiteLabel && missingProgramme) ||
      (navItem.href.includes('community') &&
        isWhiteLabel &&
        missingProgramme) ||
      (navItem.href.includes('/practitioner/programme-information') &&
        isWhiteLabel &&
        missingProgramme)
    ) {
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
    ...(isPrincipal || isFundaAppAdmin || isTrialPeriod
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

  if (isPrincipal || isFundaAppAdmin || isTrialPeriod) {
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
      onActionClick: () => {
        goToTraining();
      },
      classNames: 'bg-successBg',
    });

  const goToCommunity = () => {
    if (
      (classroom && classroom.id) ||
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
    } else if (missingProgramme && isWhiteLabel) {
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
    if (
      (classroom && !!classroom.id) ||
      (classroomGroups &&
        classroomGroups.length > 0 &&
        !!classroom?.id &&
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
    } else if (missingProgramme && isWhiteLabel) {
      showCompleteProfileBlockingDialog();
    }
  };

  const goToCalendar = () => {
    if (
      (((classroom && classroom.id) ||
        (classroomGroups && classroomGroups.length > 0)) &&
        isRegistered &&
        isProgress &&
        isProgress > 0 &&
        hasConsent &&
        !missingProgramme) ||
      isTrialPeriod
    ) {
      history.push(ROUTES.CALENDAR);
    } else if (missingProgramme && isWhiteLabel) {
      showCompleteProfileBlockingDialog();
    }
  };

  const goToBusiness = () => {
    if (isPrincipal || isFundaAppAdmin || isTrialPeriod) {
      history.push(ROUTES.BUSINESS);
      return;
    }
  };

  const goToTraining = () => {
    if (
      (((classroom && classroom.id) ||
        (classroomGroups && classroomGroups.length > 0)) &&
        isRegistered &&
        isProgress &&
        isProgress > 0 &&
        hasConsent &&
        !missingProgramme) ||
      isTrialPeriod
    ) {
      history.push(ROUTES.TRAINING);
    } else if (missingProgramme && isWhiteLabel) {
      showCompleteProfileBlockingDialog();
    }
  };

  const profilePc =
    userProfilePicture?.file ||
    userData?.profileImageUrl ||
    userProfilePicture?.reference;

  const getCurrentPointsToDo = useMemo(() => {
    if (pointsToDo) {
      let newPointsToDo = { ...pointsToDo };
      if (practitioner?.isPrincipal) {
        removeMandatoryProperty(
          newPointsToDo,
          'plannedOneDay',
          (value) => practitioner?.isPrincipal === true
        );
      } else {
        removeMandatoryProperty(
          newPointsToDo,
          'savedIncomeOrExpense',
          (value) => !practitioner?.isPrincipal
        );
      }

      const pointsToDoValues = Object.values(newPointsToDo!)?.filter(
        (item) => item === true
      );
      return pointsToDoValues?.length;
    } else {
      return 0;
    }
  }, [pointsToDo, practitioner?.isPrincipal]);

  const renderTodoText = useMemo(() => {
    if (pointsToDo?.viewedCommunitySection) {
      return 'Influencer';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'Boss';
    }

    if (pointsToDo?.plannedOneDay && !practitioner?.isPrincipal) {
      return 'Cwepheshe';
    }
    if (pointsToDo?.isPartOfPreschool) {
      return 'Tichere';
    }

    if (pointsToDo?.signedUpForApp) {
      return 'Umtsha';
    }

    return 'Umtsha';
  }, [
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  const renderPointsToDoScoreCardBgColor = useMemo(() => {
    if (pointsToDo?.viewedCommunitySection) {
      if (getCurrentPointsToDo === 3) {
        return 'quatenaryBg';
      }
      return 'successBg';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'quatenaryBg';
    }

    if (pointsToDo?.plannedOneDay && !practitioner?.isPrincipal) {
      return 'quatenaryBg';
    }

    if (pointsToDo?.isPartOfPreschool) {
      return 'secondaryAccent2';
    }

    if (pointsToDo?.signedUpForApp) {
      return 'alertBg';
    }

    return 'alertBg';
  }, [
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  const renderPointsToDoEmoji = useMemo(() => {
    if (pointsToDo?.viewedCommunitySection) {
      if (getCurrentPointsToDo === 3) {
        return (
          <div className="bg-quatenary mr-4 rounded-full p-3">
            <FireIcon className="font-white h-8 w-8" />
          </div>
        );
      }
      return (
        <div className="bg-successMain mr-4 rounded-full p-3">
          <FireIcon className="font-white h-8 w-8" />
        </div>
      );
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return (
        <div className="bg-quatenary mr-4 rounded-full p-3">
          <Crown className="font-white h-8 w-8" />
        </div>
      );
    }

    if (pointsToDo?.plannedOneDay && !practitioner?.isPrincipal) {
      return (
        <div className="bg-quatenary mr-4 rounded-full p-3">
          <CalendarIcon className="font-white h-8 w-8" />
        </div>
      );
    }

    if (pointsToDo?.isPartOfPreschool) {
      return (
        <div className="bg-secondary mr-4 rounded-full p-3">
          <Kindgarden className="font-white h-8 w-8" />
        </div>
      );
    }

    if (pointsToDo?.signedUpForApp) {
      return (
        <div className="bg-alertMain mr-4 rounded-full p-2">
          <ClipboardCheckIcon className="font-white h-8 w-8" />
        </div>
      );
    }

    return (
      <div className="bg-alertMain mr-4 rounded-full p-2">
        <ClipboardCheckIcon className="font-white h-8 w-8" />
      </div>
    );
  }, [
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  const renderPointsToDoProgressBarColor = useMemo(() => {
    if (pointsToDo?.viewedCommunitySection) {
      if (getCurrentPointsToDo === 3) {
        return 'quatenary';
      }
      return 'successMain';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'quatenary';
    }

    if (pointsToDo?.plannedOneDay && !practitioner?.isPrincipal) {
      return 'quatenary';
    }

    if (pointsToDo?.isPartOfPreschool) {
      return 'secondary';
    }

    if (pointsToDo?.signedUpForApp) {
      return 'alertMain';
    }

    return 'alertMain';
  }, [
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  function removeMandatoryProperty<T, K extends keyof T>(
    obj: T,
    prop: K,
    condition: (value: T[K]) => boolean
  ): void {
    if (condition(obj[prop])) {
      delete (obj as any)[prop]; // Use type assertion to bypass TypeScript checks
    }
  }

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
        menuLogoUrl={hamburgerLogo}
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
        backgroundUrl={theme?.images.graphicOverlayUrl}
        className={styles.bannerContent}
        displayOffline={!isOnline}
        version={`v ${version}`}
      >
        <Typography
          type={'h1'}
          color="white"
          text={`Hi ${
            (userData && userData?.firstName) || userData?.userName
          }!`}
          className={styles.welcomeText}
        />
        <div className={`${!classroom ? styles.wrapper : ''} pb-4`}>
          <DashboardItems
            listItems={dashboardItems}
            notification={dashboardNotification}
          />
          {totalYearPoints &&
            totalYearPoints > 10 &&
            !!pointsScoreProps &&
            !isCoach &&
            getCurrentPointsToDo === 4 && (
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
          {(!totalYearPoints || (totalYearPoints && totalYearPoints <= 10)) && (
            <NoPointsScoreCard
              image={renderPointsToDoEmoji}
              className="mt-5 w-full py-6"
              mainText={''}
              currentPoints={getCurrentPointsToDo}
              maxPoints={4}
              barBgColour="white"
              barColour={renderPointsToDoProgressBarColor}
              bgColour={renderPointsToDoScoreCardBgColor}
              textColour="black"
              onClick={() => history.push(ROUTES.PRACTITIONER.POINTS.SUMMARY)}
              isBigTitle={false}
              hint={renderTodoText}
              textPosition="left"
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
    </>
  );
};

export default Dashboard;
