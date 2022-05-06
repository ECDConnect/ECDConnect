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
import { useDocuments } from '@hooks/useDocuments';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { OfflineSyncModal } from '../../../modals';
import { useAppDispatch } from '@store';
import { classroomsSelectors } from '@store/classroom';
import { settingSelectors } from '@store/settings';
import { userSelectors } from '@store/user';
import { analyticsActions } from '@store/analytics';
import CompleteProfile from '../edit-practitioner-profile/components/complete-profile/complete-profile';
import ROUTES from '@routes/routes';

export const PractitionerProfile: React.FC = () => {
  const { resetAuth, resetAppStaticStores } = useStoreSetup();
  const user = useSelector(userSelectors.getUser);
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const lastDataSyncDate = useSelector(settingSelectors.getLastDataSync);
  const appDispatch = useAppDispatch();
  const { userProfilePicture, classroomImage } = useDocuments();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const dialog = useDialog();

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
          history.push(ROUTES.PRACTITIONER.ABOUT);
        },
      },
      {
        title: 'Programme information',
        subTitle: classroom?.name,
        menuIconUrl: classroomImage?.file,
        menuIcon: 'HeartIcon',
        menuIconClassName: 'text-white bg-primary',
        iconBackgroundColor: 'primary',
        iconColor: 'white',
        showIcon: classroomImage?.file === undefined,
        onActionClick: () => {
          if (classroom && classroom.id) {
            history.push(ROUTES.PRACTITIONER.PROGRAMME_INFORMATION);
          } else {
            dialog({
              render: (onSubmit, onCancel) => {
                return (
                  <ActionModal
                    icon="ExclamationCircleIcon"
                    iconBorderColor="alertBg"
                    iconColor="alertMain"
                    title="Complete your profile!"
                    paragraphs={[
                      `Please Complete your profile to unlock the classroom feature`,
                    ]}
                    actionButtons={[
                      {
                        colour: 'primary',
                        text: 'Okay',
                        textColour: 'white',
                        type: 'filled',
                        leadingIcon: 'ArrowCircleRightIcon',
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
                          onCancel();
                        },
                      },
                    ]}
                  />
                );
              },
              position: DialogPosition.Bottom,
            });
          }
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
          history.push(ROUTES.PRACTITIONER.ACCOUNT);
        },
      },
      {
        title: 'Sync App Data',
        subTitle: lastDataSyncDate,
        menuIcon: 'RefreshIcon',
        iconColor: 'white',
        iconBackgroundColor: 'primary',
        showIcon: true,
        onActionClick: () => {
          dialog({
            position: DialogPosition.Bottom,
            render: (onSubmit, onCancel) => {
              return (
                <OfflineSyncModal
                  isManual
                  onSubmit={onSubmit}
                  onCancel={onCancel}
                ></OfflineSyncModal>
              );
            },
          });
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
          {classroom ? null : <CompleteProfile />}
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
