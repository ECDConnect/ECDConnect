import { useDialog } from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  DialogPosition,
  MenuListDataItem,
  StackedList,
  TabItem,
  TabList,
} from '@ecdlink/ui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useDocuments } from '@/hooks/useDocuments';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useStoreSetup } from '@/hooks/useStoreSetup';
// import { OfflineSyncModal } from '../../../modals';
import { useAppDispatch } from '@/store';
import { userSelectors } from '@/store/user';
import { analyticsActions } from '@/store/analytics';
import ROUTES from '@/routes/routes';

export const PractitionerProfile: React.FC = () => {
  const { resetAuth, resetAppStore } = useStoreSetup();
  const user = useSelector(userSelectors.getUser);
  // const lastDataSyncDate = useSelector(settingSelectors.getLastDataSync);
  const appDispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userProfilePicture, classroomImage } = useDocuments();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const dialog = useDialog();

  const tabItem: TabItem[] = [
    {
      title: 'Profile',
      initActive: true,
      child: (
        <StackedList
          type={'MenuList'}
          className={'secondary flex flex-col gap-3'}
          listItems={getStackedMenuList()}
        />
      ),
    },
  ];

  function getStackedMenuList(): MenuListDataItem[] {
    const stackedMenuList: MenuListDataItem[] = [
      {
        title: `${user?.firstName} ${user?.surname}`,
        subTitle: 'About me',
        menuIconUrl: userProfilePicture?.file || user?.profileImageUrl,
        menuIcon: 'UserIcon',
        iconBackgroundColor: 'primary',
        iconColor: 'white',

        showIcon: !userProfilePicture?.file && !user?.profileImageUrl,
        onActionClick() {
          return history.push(ROUTES.PRACTITIONER.ABOUT);
        },
      },
      {
        title: 'Account',
        subTitle: 'Login, password, contact details',
        menuIcon: 'ShieldCheckIcon',
        menuIconClassName: 'text-white bg-primary',
        iconBackgroundColor: 'primary',
        showIcon: true,
        iconColor: 'white',
        onActionClick() {
          return history.push(ROUTES.PRACTITIONER.ACCOUNT);
        },
      },
      {
        title: 'Logout',
        subTitle: 'Logout & reset data',
        menuIcon: 'LogoutIcon',
        iconColor: 'white',
        iconBackgroundColor: 'primary',
        showIcon: true,
        onActionClick() {
          return dialog({
            position: DialogPosition.Bottom,
            render(onSubmit, onClose) {
              return (
                <ActionModal
                  className={'mx-4'}
                  title={'Are you sure you want to log out?'}
                  icon={'ExclamationCircleIcon'}
                  iconColor={'alertDark'}
                  iconBorderColor={'alertBg'}
                  actionButtons={[
                    {
                      text: 'Okay',
                      colour: 'primary',
                      onClick: async () => {
                        onSubmit();
                        await resetAuth();
                        await resetAppStore();
                        history.push(ROUTES.ROOT);
                      },
                      type: 'filled',
                      textColour: 'white',
                      leadingIcon: 'CheckCircleIcon',
                    },
                    {
                      text: 'Cancel',
                      textColour: 'white',
                      colour: 'primary',
                      type: 'filled',
                      leadingIcon: 'XCircleIcon',
                      onClick() {
                        return onClose && onClose();
                      },
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
  }

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Practitioner Profile',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  return (
    <BannerWrapper
      size="normal"
      color={'primary'}
      renderBorder={true}
      backgroundColour="white"
      displayOffline={!isOnline}
      onBack={() => history.push(ROUTES.ROOT)}
      title={`${user?.firstName} ${user?.surname}`}
    >
      <div className="secondary text-textDark flex flex-col justify-between bg-white px-5">
        <TabList tabItems={tabItem} />
      </div>
    </BannerWrapper>
  );
};
