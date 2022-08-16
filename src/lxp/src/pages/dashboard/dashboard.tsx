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
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useDocuments } from '@hooks/useDocuments';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { OfflineSyncModal } from '../../modals';
import OfflineSyncTimeExceeded from '../../modals/offline-sync/offline-sync-time-exceeded';
import { useAppDispatch } from '@store';
import { classroomsSelectors } from '@store/classroom';
import { notificationsSelectors } from '@store/notifications';
import { settingSelectors } from '@store/settings';
import { userSelectors } from '@store/user';
import { analyticsActions } from '@store/analytics';
import { DashboardItems } from './components/dashboard-items/dashboard-items';
import { practitionerThunkActions } from '@/store/practitioner';
import { childrenThunkActions } from '@/store/children';
import * as styles from './dashboard.styles';
import ROUTES from '@routes/routes';
const { version } = require('../../../package.json');

export enum NavigationTypes {
  Home = 'Home',
  ClientFolders = 'Client folders',
  Attendance = 'Attendance',
  Children = 'Children',
  Programme = 'Programme',
  Profile = 'Profile',
  Messages = 'Messages',
  Logout = 'Logout',
}

export const Dashboard: React.FC = () => {
  const shouldUserSync = useSelector(settingSelectors.getShouldUserSync);
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const userData = useSelector(userSelectors.getUser);
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { theme } = useTheme();
  const dialog = useDialog();

  const newNotificationCount = useSelector(
    notificationsSelectors.getNewNotificationCount
  );

  const dashboardNotification = useSelector(
    notificationsSelectors.getDashboardNotification
  );

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

  /**
   * Data loading for coaches:
   * 1. Practitioners
   * 2. Children of Practitioners
   */
  useEffect(() => {
    if (userData?.roles?.some((role) => role.name === 'Coach')) {
      (async () =>
        await appDispatch(
          practitionerThunkActions.getPractitionersForCoach({})
        ).unwrap())();

      (async () =>
        await appDispatch(
          childrenThunkActions.getChildrenForCoach({})
        ).unwrap())();
    }
  }, []);

  const navigation: (NavigationRouteItem | NavigationDropdown)[] = [
    { name: NavigationTypes.Home, href: '/', icon: 'HomeIcon', current: true },
    {
      name: NavigationTypes.ClientFolders,
      icon: 'AcademicCapIcon',
      current: false,
      nestedChildren: [
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
        return newNotificationCount;
      },
    },
    {
      name: NavigationTypes.Logout,
      href: ROUTES.LOGIN,
      icon: 'ExternalLinkIcon',
      current: false,
      showDivider: true,
    },
  ];

  const dashboardItems: StackedListItemType[] = [];

  if (userData?.roles?.some((role) => role.name === 'Coach')) {
    dashboardItems.push(
      {
        title: 'Smartstarters',
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
        chipConfig: {
          colorPalette: {
            backgroundColour: 'white',
            borderColour: 'errorMain',
            textColour: 'errorMain',
          },
          text: 'Coming soon',
        },
        classNames: 'bg-uiBg',
      }
    );
  } else {
    dashboardItems.push(
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
      }
    );
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
    if (classroom && classroom.id) {
      history.push(ROUTES.CLASSROOM, { activeTabIndex: 1 });
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

  return (
    <BannerWrapper
      backgroundColour={'white'}
      backgroundImageColour={'primary'}
      avatar={
        userProfilePicture?.file ? (
          <Avatar
            dataUrl={userProfilePicture?.file}
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
