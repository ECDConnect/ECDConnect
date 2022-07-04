import CompleteProfile from '../edit-coach-profile/components/complete-profile/complete-profile';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useDocuments } from '@hooks/useDocuments';
import { useHistory } from 'react-router-dom';
import { userSelectors } from '@store/user';
import { useSelector } from 'react-redux';
import { useDialog } from '@ecdlink/core';
import ROUTES from '@routes/routes';
import {
  ActionModal,
  BannerWrapper,
  DialogPosition,
  MenuListDataItem,
  StackedList,
  TabItem,
  TabList,
} from '@ecdlink/ui';

export const CoachProfile: React.FC = () => {
  const { resetAuth, resetAppStaticStores } = useStoreSetup();
  const user = useSelector(userSelectors.getUser);
  const { userProfilePicture } = useDocuments();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const dialog = useDialog();

  const getStackedMenuList = (): MenuListDataItem[] => {
    const stackedMenuList: MenuListDataItem[] = [
      {
        title: `${user?.firstName} ${user?.surname}`,
        subTitle: 'About me',
        menuIconUrl: userProfilePicture?.file,
        menuIcon: 'UserIcon',
        iconBackgroundColor: 'primary',
        iconColor: 'white',

        showIcon: userProfilePicture?.file === undefined,
        onActionClick: () => {
          history.push(ROUTES.COACH.ABOUT);
        },
      },
      {
        title: 'Account',
        subTitle: 'Password',
        menuIcon: 'ShieldCheckIcon',
        menuIconClassName: 'text-white bg-primary',
        iconBackgroundColor: 'primary',
        showIcon: true,
        iconColor: 'white',
        onActionClick: () => {
          history.push(ROUTES.COACH.ACCOUNT);
        },
      },
      {
        title: 'Logout',
        subTitle: 'Logout & reset data',
        menuIcon: 'LogoutIcon',
        iconColor: 'white',
        iconBackgroundColor: 'primary',
        showIcon: true,
        onActionClick: () => {
          dialog({
            position: DialogPosition.Bottom,
            render: (onSubmit, onClose) => {
              return (
                <ActionModal
                  className={'mx-4'}
                  title={'Logout & reset data'}
                  importantText={
                    'Please note that by doing this, all your data will be reset and you will loose all data that has not been synced up.'
                  }
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
                        await resetAppStaticStores();
                        history.push('/');
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

  const tabItem: TabItem[] = [
    {
      title: 'Profile',
      initActive: true,
      child: (
        <div>
          <CompleteProfile />
          <StackedList
            listItems={getStackedMenuList()}
            type={'MenuList'}
          ></StackedList>
        </div>
      ),
    },
  ];

  return (
    <BannerWrapper
      size="normal"
      renderBorder={true}
      title={`${user?.firstName} ${user?.surname}`}
      color={'primary'}
      onBack={() => history.push(ROUTES.ROOT)}
      backgroundColour="uiBg"
      displayOffline={!isOnline}
    >
      <div className="bg-white">
        <TabList tabItems={tabItem} />
      </div>
    </BannerWrapper>
  );
};
