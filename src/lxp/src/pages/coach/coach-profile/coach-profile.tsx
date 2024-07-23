import CompleteProfile from '../edit-coach-profile/components/complete-profile/complete-profile';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { analyticsActions } from '@store/analytics';
import { useDocuments } from '@hooks/useDocuments';
import { useHistory } from 'react-router-dom';
import { coachSelectors } from '@store/coach';
import { useSelector } from 'react-redux';
import { useDialog } from '@ecdlink/core';
import { useAppDispatch } from '@store';
import { userSelectors } from '@store/user';
import ROUTES from '@routes/routes';
import { useEffect } from 'react';
import {
  ActionModal,
  BannerWrapper,
  DialogPosition,
  MenuListDataItem,
  StackedList,
  TabItem,
  TabList,
} from '@ecdlink/ui';
import { syncThunkActions } from '@/store/sync';
import { settingActions } from '@/store/settings';
import { NavigationNames } from '@/pages/navigation';

export const CoachProfile: React.FC = () => {
  const { resetAuth, resetAppStore } = useStoreSetup();
  const user = useSelector(userSelectors.getUser);
  const { userProfilePicture } = useDocuments();
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();

  const coach = useSelector(coachSelectors.getCoach);

  const sync = async () => {
    await appDispatch(syncThunkActions.syncOfflineData({}));
    appDispatch(settingActions.setLastDataSync());
  };

  const handleSync = async () => {
    if (isOnline) {
      await sync();
      await resetAppStore();
      await resetAuth();
      history.push('/');
    } else {
      history.push(ROUTES.LOGIN);
    }
  };

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Coach Profile',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const getStackedMenuList = (): MenuListDataItem[] => {
    const titleStyle = 'text-textDark font-semibold text-base leading-snug';
    const subTitleStyle = 'text-sm font-h1 font-normal text-textMid';
    const profilePc =
      userProfilePicture?.file ||
      user?.profileImageUrl ||
      userProfilePicture?.reference;
    const stackedMenuList: MenuListDataItem[] = [
      {
        title: `${coach?.user?.firstName} ${coach?.user?.surname}`.slice(0, 25),
        titleStyle,
        subTitle: 'About me',
        subTitleStyle,
        menuIconUrl: profilePc,
        menuIcon: 'UserIcon',
        iconBackgroundColor: 'quatenary',
        iconColor: 'white',

        showIcon: profilePc === undefined,
        onActionClick: () => {
          history.push(ROUTES.COACH.ABOUT.ROOT);
        },
      },

      {
        title: 'Account',
        titleStyle,
        subTitle: 'Password',
        subTitleStyle,
        menuIcon: 'ShieldCheckIcon',
        iconBackgroundColor: 'quatenary',
        showIcon: true,
        iconColor: 'white',
        onActionClick: () => {
          history.push(ROUTES.COACH.ACCOUNT);
        },
      },
      {
        title: NavigationNames.Logout,
        titleStyle,
        subTitle: 'Sign out of the app',
        subTitleStyle,
        menuIcon: 'LogoutIcon',
        iconColor: 'white',
        iconBackgroundColor: 'quatenary',
        showIcon: true,
        onActionClick: () => {
          dialog({
            position: DialogPosition.Middle,
            render: (onSubmit, onClose) => {
              return (
                <ActionModal
                  className={'mx-4'}
                  title={'Are you sure you want to log out?'}
                  importantText={''}
                  icon={'ExclamationCircleIcon'}
                  iconColor={'alertDark'}
                  iconBorderColor={'alertBg'}
                  actionButtons={[
                    {
                      text: 'Yes, log out',
                      colour: 'quatenary',
                      onClick: async () => {
                        await handleSync();
                        onSubmit();
                      },
                      type: 'filled',
                      textColour: 'white',
                      leadingIcon: 'CheckCircleIcon',
                    },
                    {
                      text: 'No, cancel',
                      textColour: 'quatenary',
                      colour: 'quatenary',
                      type: 'outlined',
                      onClick: () => onClose && onClose(),
                      leadingIcon: 'XCircleIcon',
                    },
                  ]}
                />
              );
            },
          });
        },
      },
    ];

    return stackedMenuList;
  };

  const isProfileComplete =
    !!coach?.user?.firstName &&
    !!coach?.user?.surname &&
    !!coach?.user?.email &&
    !!coach?.siteAddress;

  const tabItem: TabItem[] = [
    {
      title: 'Profile',
      initActive: true,
      child: (
        <div>
          <StackedList
            listItems={getStackedMenuList()}
            type={'MenuList'}
            className={'-mt-0.5 flex flex-col gap-1 px-4'}
          ></StackedList>
        </div>
      ),
    },
  ];

  return (
    <BannerWrapper
      size="normal"
      renderBorder={true}
      title={`${coach?.user?.firstName} ${coach?.user?.surname}`}
      color={'primary'}
      onBack={() => history.push(ROUTES.ROOT)}
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <TabList tabItems={tabItem} />
    </BannerWrapper>
  );
};
