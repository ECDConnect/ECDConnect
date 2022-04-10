/* eslint-disable react-hooks/exhaustive-deps */
import { useDialog, useTheme } from '@ecdlink/core';
import {
  ActionModal,
  Avatar,
  BannerWrapper,
  DialogPosition,
  IconBadge,
  NavigationItem,
  Typography,
  UserAvatar,
} from '@ecdlink/ui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useDocuments } from '@hooks/useDocuments';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { OfflineSyncModal } from '../../modals';
import OfflineSyncTimeExceeded from '../../modals/offline-sync/offline-sync-time-exceeded';
import { useAppDispatch } from '../../store';
import { classroomsSelectors } from '../../store/classroom';
import { notificationsSelectors } from '../../store/notifications';
import { settingSelectors } from '../../store/settings';
import { userSelectors } from '../../store/user';
import { analyticsActions } from '../../store/analytics';
import { DashboardItems } from './components/dashboard-items/dashboard-items';
import * as styles from './dashboard.styles';
const { version } = require('../../../package.json');

export enum NavigationTypes {
  Home = 'Home',
  Classroom = 'Classroom',
  Attendance = 'Attendance',
  Children = 'Children',
  Programme = 'Programme',
  Profile = 'Profile',
  Messages = 'Messages',
}

export const Dashboard: React.FC = () => {
  const history = useHistory();
  const { theme } = useTheme();
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const userData = useSelector(userSelectors.getUser);
  const shouldUserSync = useSelector(settingSelectors.getShouldUserSync);
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const newNotificationCount = useSelector(notificationsSelectors.getNewNotificationCount);
  const dashboardNotification = useSelector(notificationsSelectors.getDashboardNotification);
  const { userProfilePicture } = useDocuments();

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

  const navigation: NavigationItem[] = [
    { name: NavigationTypes.Home, href: '/', icon: 'HomeIcon', current: true },
    {
      name: NavigationTypes.Classroom,
      href: '/classroom',
      icon: 'AcademicCapIcon',
      current: false,
    },
    {
      name: NavigationTypes.Attendance,
      href: '/classroom',
      params: { activeTabIndex: 0 },
      current: false,
    },
    {
      name: NavigationTypes.Children,
      href: '/classroom',
      params: { activeTabIndex: 1 },
      current: false,
    },
    {
      name: NavigationTypes.Programme,
      href: '/classroom',
      params: { activeTabIndex: 2 },
      current: false,
    },
    {
      name: NavigationTypes.Profile,
      href: '/practitioner/profile',
      icon: 'UserIcon',
      current: false,
    },
    {
      name: NavigationTypes.Messages,
      href: '/messages',
      icon: 'BellIcon',
      current: false,
      getNotificationCount: () => {
        return newNotificationCount;
      },
    },
  ];

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
                    return <OfflineSyncModal onSubmit={onSubmit}></OfflineSyncModal>;
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
    history.push('/practitioner/profile');
  };

  const goToClassroom = () => {
    if (classroom && classroom.id) {
      history.push('/classroom', { activeTabIndex: 1 });
    } else {
      showCompleteProfileBlockingDialog();
    }
  };

  const onNavigation = (navItem: any) => {
    if (classroom && classroom.id && navItem.href.includes('classroom')) {
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
      render: (onSubmit, onCancel) => {
        return (
          <ActionModal
            className="z-50"
            icon="XCircleIcon"
            iconBorderColor="errorBg"
            iconColor="errorMain"
            title="Missing programme information"
            paragraphs={[
              `Before you begin, please fill in your type of ECD service and programme name.`,
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
                  history.push('/practitioner/profile/edit/');
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
      position: DialogPosition.Bottom,
    });
  };

  return (
    <BannerWrapper
      backgroundColour={'primary'}
      backgroundImageColour={'primary'}
      avatar={
        userProfilePicture?.file ? (
          <Avatar dataUrl={userProfilePicture?.file} size={'sm'} displayBorder={true} />
        ) : (
          <UserAvatar size="sm-md" color="transparent" displayBorder borderColour="white" />
        )
      }
      menuItems={navigation}
      onNavigation={onNavigation}
      menuLogoUrl={theme?.images.logoUrl}
      notificationRender={() => {
        return (
          <IconBadge
            onClick={() => history.push('/messages')}
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
        lineHeight={'none'}
        className={styles.welcomeText}
      />

      <div className={`${!classroom ? styles.wrapper : 'bg-white rounded p-0.5'}`}>
        <DashboardItems
          listItems={[
            {
              title: 'Classroom',
              titleIcon: 'AcademicCapIcon',
              titleIconClassName: styles.classRoomIcon,
              onActionClick: () => {
                goToClassroom();
              },
            },
            {
              title: 'Business',
              titleIcon: 'AcademicCapIcon',
              titleIconClassName: styles.businessIcon,
              onActionClick: () => ({}),
              chipConfig: {
                colorPalette: {
                  backgroundColour: 'white',
                  borderColour: 'errorMain',
                  textColour: 'errorMain',
                },
                text: 'Coming soon',
              },
            },
          ]}
          notification={dashboardNotification}
        />
      </div>
    </BannerWrapper>
  );
};

export default Dashboard;
