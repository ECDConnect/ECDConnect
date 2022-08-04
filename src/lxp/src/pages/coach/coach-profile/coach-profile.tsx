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

export const CoachProfile: React.FC = () => {
  const { resetAuth, resetAppStaticStores } = useStoreSetup();
  const { userProfilePicture } = useDocuments();
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();

  const coach = useSelector(coachSelectors.getCoach);

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
    const stackedMenuList: MenuListDataItem[] = [
      {
        title: `${coach?.user?.firstName} ${coach?.user?.surname}`,
        subTitle: 'About me',
        menuIconUrl: userProfilePicture?.file,
        menuIcon: 'UserIcon',
        iconBackgroundColor: 'primary',
        iconColor: 'white',

        showIcon: userProfilePicture?.file === undefined,
        onActionClick: () => {
          history.push(ROUTES.COACH.ABOUT.ROOT);
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

  const isProfileComplete =
    !!coach?.user?.firstName &&
    !!coach?.user?.surname &&
    !!coach?.user?.phoneNumber;

  const tabItem: TabItem[] = [
    {
      title: 'Profile',
      initActive: true,
      child: (
        <div>
          {isProfileComplete ? null : <CompleteProfile />}
          <StackedList
            listItems={getStackedMenuList()}
            type={'MenuList'}
            className={'-mt-0.5 px-4 flex flex-col gap-1'}
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
