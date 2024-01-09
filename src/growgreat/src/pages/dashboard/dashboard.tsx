/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useDialog, useTheme } from '@ecdlink/core';
import {
  ActionModal,
  Avatar,
  BannerWrapper,
  DialogPosition,
  IconBadge,
  NavigationRouteItem,
  NavigationDropdown,
  Typography,
  UserAvatar,
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
import { DashboardRouteState } from './dashboard.types';
import { useNotificationService } from '@/hooks/useNotificationService';
import { CLIENT_TABS } from '../client/client-dashboard/class-dashboard';

export enum NavigationTypes {
  Home = 'Home',
  ClientFolders = 'Client folders',
  Clients = 'Clients',
  Visits = 'Visits',
  Highlights = 'Highlights',
  Calendar = 'Calendar',
  Profile = 'Profile',
  Messages = 'Messages',
  Training = 'Training',
  Community = 'Community',
  Logout = 'Log out',
}

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

  const { userProfilePicture } = useDocuments();

  const { startService } = useNotificationService();

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
      render: (onSubmit) => {
        return (
          <ActionModal
            className="z-50"
            title="Open a new folder"
            actionButtons={[
              {
                colour: 'primary',
                text: 'Pregnant mom',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'UserAddIcon',
                onClick: async () => {
                  onSubmit();
                  history.push(ROUTES.MOM_REGISTER);
                },
              },
              {
                colour: 'primary',
                text: 'Child',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'UserGroupIcon',
                onClick: () => {
                  onSubmit();
                  history.push(ROUTES.INFANT_REGISTER);
                },
              },
            ]}
          />
        );
      },
    });
  }

  function showMenuDialog() {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <ActionModal
            className="z-50"
            title="What do you want to do?"
            actionButtons={[
              {
                colour: 'primary',
                text: 'Visit clients',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'HomeIcon',
                onClick: () => {
                  onSubmit();
                  history.push(ROUTES.CLIENTS.ROOT, {
                    activeTabIndex: CLIENT_TABS.VISIT,
                  });
                },
              },
              {
                colour: 'primary',
                text: 'Find a client folder',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'FolderOpenIcon',
                onClick: () => {
                  onSubmit();
                  history.push(ROUTES.CLIENTS.ROOT, {
                    activeTabIndex: CLIENT_TABS.CLIENT,
                    isFindClient: true,
                  });
                },
              },
              {
                colour: 'primary',
                text: 'Open a new folder',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'FolderAddIcon',
                onClick: () => {
                  onSubmit();
                  showNewFolderDialog();
                },
              },
              {
                colour: 'primary',
                text: 'See my highlights',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'PresentationChartLineIcon',
                onClick: () => {
                  onSubmit();
                  history.push(ROUTES.CLIENTS.ROOT, {
                    activeTabIndex: CLIENT_TABS.HIGHLIGHTS,
                  });
                },
              },
              {
                colour: 'primary',
                text: 'Something else',
                textColour: 'primary',
                type: 'outlined',
                onClick: () => {
                  onSubmit();
                  history.push(ROUTES.CLIENTS.ROOT, {
                    activeTabIndex: CLIENT_TABS.CLIENT,
                  });
                },
              },
            ]}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          listItems={[
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
          ]}
          notification={dashboardNotification}
        />
      </div>
    </BannerWrapper>
  );
};

export default Dashboard;
