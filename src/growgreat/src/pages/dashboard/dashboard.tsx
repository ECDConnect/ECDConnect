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
import { motherSelectors } from '@/store/mother';
import { notificationsSelectors } from '@/store/notifications';
import { settingSelectors } from '@/store/settings';
import { userSelectors } from '@/store/user';
import { analyticsActions } from '@/store/analytics';
import { DashboardItems } from '@/pages/dashboard/components/dashboard-items/dashboard-items';
import * as styles from '@/pages/dashboard/dashboard.styles';
import ROUTES from '@routes/routes';
import { getInfants } from '@/store/infant/infant.selectors';
import { version } from '@/../package.json';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import { DashboardRouteState } from './dashboard.types';

export enum NavigationTypes {
  Home = 'Home',
  ClientFolders = 'Client folders',
  Pregnant_Mom = 'Pregnant Mom',
  Child = 'Child',
  Profile = 'Profile',
  Messages = 'Messages',
  Logout = 'Logout',
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
  const mothers = useSelector(motherSelectors.getMothers);
  const infants = useSelector(getInfants);

  function goToProfile() {
    history.push(ROUTES.PRACTITIONER.PROFILE.ROOT);
  }

  function goToClientFolders() {
    if (mothers.length > 0 || infants.length > 0) {
      return history.push(ROUTES.CLASSROOM, { activeTabIndex: 1 });
    } else {
      showCompleteProfileBlockingDialog();
    }
  }

  useEffect(() => {
    if (healthCareWorker && isFromLogin) {
      if (healthCareWorker?.isRegistered !== true) {
        history?.push(ROUTES?.HEALTH_CAREWORKER_PROFILE_SETUP);
        return;
      }
    }
  }, [healthCareWorker, isFromLogin]);

  function onNavigation(navItem: any) {
    history.push(navItem.href, navItem.params);
  }

  function showCompleteProfileBlockingDialog() {
    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => {
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
          name: NavigationTypes.Pregnant_Mom,
          href: ROUTES.MOM_REGISTER,
          params: { activeTabIndex: 0 },
          current: false,
        },
        {
          name: NavigationTypes.Child,
          href: ROUTES.INFANT_REGISTER,
          params: { activeTabIndex: 1 },
          current: false,
        },
      ],
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
                goToClientFolders();
              },
              classNames: 'bg-secondaryAccent2',
            },
            {
              title: 'Training',
              titleIcon: 'BriefcaseIcon',
              titleIconClassName: styles.businessIcon,
              onActionClick: () => ({}),
              chipConfig: {
                colorPalette: {
                  backgroundColour: 'successMain',
                  borderColour: 'successMain',
                  textColour: 'white',
                },
                text: 'Coming soon',
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
