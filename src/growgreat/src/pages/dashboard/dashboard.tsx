/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useDialog, useTheme } from '@ecdlink/core';
import {
  Avatar,
  BannerWrapper,
  DialogPosition,
  IconBadge,
  NavigationRouteItem,
  NavigationDropdown,
  Typography,
  UserAvatar,
  ScoreCard,
  RoundIcon,
  TitleListItem,
} from '@ecdlink/ui';

import { useDocuments } from '@/hooks/useDocuments';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { OfflineSyncModal } from '@/modals';
import OfflineSyncTimeExceeded from '@/modals/offline-sync/offline-sync-time-exceeded';
import { useAppDispatch } from '@/store';
import { notificationsSelectors } from '@/store/notifications';
import { settingSelectors } from '@/store/settings';
import { userSelectors } from '@/store/user';
import { analyticsActions } from '@/store/analytics';
import { DashboardItems } from '@/pages/dashboard/components/dashboard-items/dashboard-items';
import * as styles from '@/pages/dashboard/dashboard.styles';
import ROUTES from '@routes/routes';
import { version } from '@/../package.json';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import { DashboardRouteState, NavigationTypes } from './dashboard.types';
import { useNotificationService } from '@/hooks/useNotificationService';
import { MenuModal } from './components/menu-modal';
import { NewFolderModal } from './components/new-folder-modal';
import { ScoreCardProps } from '@ecdlink/ui/lib/components/score-card/score-card.types';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { communitySelectors } from '@/store/community';
import {
  getLeaguePointsColours,
  getTierDetails,
} from '@/utils/community/league-position';
import { LeagueType } from '@/constants/Community';

export const Dashboard: React.FC = () => {
  const history = useHistory();
  const { theme } = useTheme();
  const location = useLocation<DashboardRouteState>();
  const isFromLogin =
    location?.state?.isFromLogin || location?.state?.isFromSignUp;
  const userData = useSelector(userSelectors.getUser);
  const shouldUserSync = useSelector(settingSelectors.getShouldUserSync);
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const newNotificationCount = useSelector(
    notificationsSelectors.getNewNotificationCount
  );
  const dashboardNotification = useSelector(
    notificationsSelectors.getDashboardNotification
  );
  const healthCareWorker = useSelector(
    healthCareWorkerSelectors?.getHealthCareWorker
  );
  const clinicDetails = useSelector(communitySelectors.getClinicSelector);

  const { tierName, tierColor } = getTierDetails(
    (clinicDetails?.league?.leagueTypeName as LeagueType) ?? LeagueType.League,
    clinicDetails?.points?.pointsTotal ?? 0
  );

  const { userProfilePicture } = useDocuments();

  const { startService } = useNotificationService();

  const isFirstTimeCommunitySection = healthCareWorker?.isNewAtClinic;
  // TODO: get the length of the league
  const isTop25PercentInTheLeague = false;
  // TODO: get the length of the league
  const isMiddle50PercentInTheLeague = false;

  const leaguePointsColours = getLeaguePointsColours(
    isTop25PercentInTheLeague,
    isMiddle50PercentInTheLeague
  );

  function goToProfile() {
    history.push(ROUTES.PRACTITIONER.PROFILE.ROOT);
  }

  useEffect(() => {
    if (healthCareWorker && isFromLogin) {
      if (healthCareWorker?.isRegistered !== true) {
        history?.push(ROUTES?.HEALTH_CAREWORKER_PROFILE_SETUP);
        return;
      }
    }
  }, [healthCareWorker, isFromLogin]);

  useEffect(() => {
    if (!healthCareWorker?.isRegistered || !healthCareWorker.languageId) {
      startService();
    }
  }, []);

  function onNavigation(navItem: any) {
    history.push(navItem.href, navItem.params);
  }

  function showNewFolderDialog() {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      render: (onClose) => {
        return <NewFolderModal onClose={onClose} />;
      },
    });
  }

  function showMenuDialog() {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      render: (onClose) => {
        return (
          <MenuModal
            onClose={onClose}
            showNewFolderDialog={showNewFolderDialog}
          />
        );
      },
    });
  }

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Dashboard',
        })
      );
    }
  }, [isOnline]);

  const navigation: (NavigationRouteItem | NavigationDropdown)[] = [
    { name: NavigationTypes.Home, href: '/', icon: 'HomeIcon', current: true },
    {
      name: NavigationTypes.ClientFolders,
      icon: 'UserGroupIcon',
      current: false,
      nestedChildren: [
        {
          name: NavigationTypes.Clients,
          href: ROUTES.CLIENTS.ROOT,
          params: { activeTabIndex: 0 },
          current: false,
        },
        {
          name: NavigationTypes.Visits,
          href: ROUTES.CLIENTS.ROOT,
          params: { activeTabIndex: 1 },
          current: false,
        },
        {
          name: NavigationTypes.Highlights,
          href: ROUTES.CLIENTS.ROOT,
          params: { activeTabIndex: 2 },
          current: false,
        },
      ],
    },
    {
      name: NavigationTypes.Calendar,
      href: ROUTES.CALENDAR,
      icon: 'CalendarIcon',
      current: false,
      showDivider: true,
    },
    {
      name: NavigationTypes.Profile,
      href: ROUTES.PRACTITIONER.PROFILE.ROOT,
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
        return Number(newNotificationCount);
      },
    },
    {
      name: NavigationTypes.Training,
      href: ROUTES.TRAINING,
      icon: 'BellIcon',
      current: false,
      showDivider: true,
    },
    ...(clinicDetails
      ? [
          {
            name: NavigationTypes.Community,
            href: isFirstTimeCommunitySection
              ? ROUTES.COMMUNITY.WELCOME
              : ROUTES.COMMUNITY.ROOT,
            icon: 'UserGroupIcon',
            current: false,
            showDivider: true,
          },
        ]
      : []),
    {
      name: NavigationTypes.Logout,
      href: ROUTES.LOGOUT,
      icon: 'ExternalLinkIcon',
      current: false,
      showDivider: true,
    },
  ];

  const dashboardItems = [
    {
      title: 'Client folders',
      titleIcon: 'UserGroupIcon',
      titleIconClassName: styles.classRoomIcon,
      onActionClick: () => {
        showMenuDialog();
      },
      classNames: 'bg-secondaryAccent2',
    },
    {
      title: 'Calendar',
      titleIcon: 'CalendarIcon',
      titleIconClassName: styles.classRoomIcon,
      onActionClick: () => {
        history.push(ROUTES.CALENDAR);
      },
      classNames: 'bg-secondaryAccent2',
    },
    {
      title: 'Training',
      titleIcon: 'BriefcaseIcon',
      titleIconClassName: styles.businessIcon,
      onActionClick: () => {
        history.push(ROUTES.TRAINING);
      },
      classNames: 'bg-uiBg',
    },
  ];

  const communityCard = useMemo(
    (): ScoreCardProps => ({
      image: !!clinicDetails?.points?.leagueRanking ? (
        <div className="relative mr-4 flex h-14 w-14 items-center justify-center">
          <Badge
            className="absolute z-0 h-12 w-12"
            fill={`var(--${leaguePointsColours.mainColour})`}
          />
          <Typography
            className="relative z-10"
            color="white"
            type="h1"
            text={String(clinicDetails?.points?.leagueRanking ?? '')}
          />
        </div>
      ) : (
        <RoundIcon
          backgroundColor="tertiary"
          className="mr-4 h-12 w-12"
          icon="UserGroupIcon"
        />
      ),
      currentPoints: clinicDetails?.points?.pointsTotal ?? 0,
      maxPoints: clinicDetails?.points?.maxPointsTotal ?? 0,
      barBgColour: 'white',
      barColour: leaguePointsColours.mainColour,
      hint: clinicDetails?.name ?? 'Community',
      mainText: '',
      hintClassName: 'mt-10',
      bgColour: leaguePointsColours.backgroundColour,
      textColour: 'textDark',
      statusChip: {
        backgroundColour: tierColor,
        borderColour: tierColor,
        textColour: 'white',
        text: tierName,
        textWeight: 'normal',
      },
      onClick: () =>
        history.push(
          isFirstTimeCommunitySection
            ? ROUTES.COMMUNITY.WELCOME
            : ROUTES.COMMUNITY.ROOT
        ),
    }),
    []
  );

  useEffect(() => {
    if (shouldUserSync) {
      dialog({
        position: DialogPosition.Bottom,
        blocking: true,
        render: (onSubmitParent) => {
          return (
            <OfflineSyncTimeExceeded
              onSubmit={() => {
                onSubmitParent();

                dialog({
                  position: DialogPosition.Bottom,
                  blocking: true,
                  render: (onSubmit) => {
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

  return (
    <BannerWrapper
      backgroundColour={'white'}
      backgroundImageColour={'primary'}
      avatar={
        userProfilePicture?.file || userData?.profileImageUrl ? (
          <Avatar
            dataUrl={userProfilePicture?.file || userData?.profileImageUrl!}
            size={'sm'}
            displayBorder={true}
          />
        ) : (
          <UserAvatar
            size="sm-md"
            color="secondary"
            displayBorder
            borderColour="secondary"
          />
        )
      }
      menuItems={navigation}
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

      <div className={`${styles.wrapper}`}>
        <DashboardItems
          listItems={dashboardItems}
          notification={dashboardNotification}
        />
        {!!clinicDetails && (
          <>
            {!!clinicDetails?.league ? (
              <ScoreCard
                className="mt-30 h-20 w-full"
                mainText={communityCard.mainText}
                hint={communityCard.hint}
                hintClassName={communityCard.hintClassName}
                textPosition="left"
                currentPoints={communityCard.currentPoints}
                maxPoints={communityCard.maxPoints}
                onClick={communityCard.onClick}
                barBgColour={communityCard.barBgColour}
                barColour={communityCard.barColour}
                bgColour={communityCard.bgColour}
                image={communityCard.image}
                textColour={communityCard.textColour}
                onClickClassName="text-textLight"
                statusChip={communityCard.statusChip}
              />
            ) : (
              <TitleListItem
                item={{
                  title: communityCard.hint,
                  onActionClick: communityCard.onClick!,
                  titleIcon: 'UserGroupIcon',
                  titleIconClassName: 'bg-tertiary text-white',
                  classNames: 'bg-uiBg w-full mt-30',
                }}
              />
            )}
          </>
        )}
      </div>
    </BannerWrapper>
  );
};

export default Dashboard;
