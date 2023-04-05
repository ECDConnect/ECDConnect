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
import { practitionerSelectors } from '@/store/practitioner';

export const PractitionerProfile: React.FC = () => {
  const { resetAuth, resetAppStore } = useStoreSetup();
  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors?.getPractitioners);
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomForPractitionerAnyType: any = classroom;
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const lastDataSyncDate = useSelector(settingSelectors.getLastDataSync);
  const appDispatch = useAppDispatch();
  const { userProfilePicture, classroomImage } = useDocuments();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const dialog = useDialog();

  const principalPractitioner = practitioners?.find(
    (item) => item?.userId === user?.id
  );

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
    const titleStyle = 'text-textDark font-semibold text-base leading-snug';
    const subTitleStyle = 'text-sm font-h1 font-normal text-textMid';
    const profilePc =
      userProfilePicture?.file ||
      user?.profileImageUrl ||
      userProfilePicture?.reference;
    const stackedMenuList: MenuListDataItem[] = [
      {
        title: `${user?.firstName} ${user?.surname}`.slice(0, 25),
        titleStyle,
        subTitle: 'About me',
        subTitleStyle,
        menuIconUrl: profilePc,
        menuIcon: 'UserIcon',
        iconBackgroundColor: 'tertiary',
        iconColor: 'white',
        showIcon: profilePc === undefined,
        onActionClick: () => {
          history.push(ROUTES.PRACTITIONER.ABOUT.ROOT);
        },
      },
      {
        title: 'Programme information',
        titleStyle,
        subTitle:
          classroomForPractitionerAnyType && practitioner?.isPrincipal !== true
            ? classroomForPractitionerAnyType?.name
            : classroom?.name || 'N/A',
        subTitleStyle,
        menuIconUrl: classroomImage?.file,
        menuIcon: 'HeartIcon',
        menuIconClassName: 'text-white bg-primary',
        iconBackgroundColor: 'tertiary',
        iconColor: 'white',
        showIcon: classroomImage?.file === undefined,
        onActionClick: () => {
          if ((classroom && classroom.id) || classroomGroups) {
            history.push(ROUTES.PRACTITIONER.PROGRAMME_INFORMATION);
          } else {
            dialog({
              render: (onSubmit, onCancel) => {
                return (
                  <ActionModal
                    icon="ExclamationCircleIcon"
                    iconBorderColor="alertBg"
                    iconColor="alertMain"
                    title="Tell us more about you!"
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
        titleStyle,
        subTitleStyle,
        subTitle: 'Password',
        menuIcon: 'ShieldCheckIcon',
        menuIconClassName: 'text-white bg-primary',
        iconBackgroundColor: 'tertiary',
        showIcon: true,
        iconColor: 'white',
        onActionClick: () => {
          history.push(ROUTES.PRACTITIONER.ACCOUNT);
        },
      },
      {
        title: 'Sync App Data',
        titleStyle,
        subTitleStyle,
        subTitle: lastDataSyncDate,
        menuIcon: 'RefreshIcon',
        iconColor: 'white',
        iconBackgroundColor: 'tertiary',
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
        titleStyle,
        subTitleStyle,
        subTitle: 'Logout & reset data',
        menuIcon: 'LogoutIcon',
        iconColor: 'white',
        iconBackgroundColor: 'tertiary',
        showIcon: true,
        onActionClick: () => {
          dialog({
            position: DialogPosition.Bottom,
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
                      colour: 'primary',
                      onClick: async () => {
                        onSubmit();
                        await resetAuth();
                        await resetAppStore();
                        history.push('/');
                      },
                      type: 'filled',
                      textColour: 'white',
                      leadingIcon: 'CheckCircleIcon',
                    },
                    {
                      text: 'No, cancel',
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
          {principalPractitioner?.isRegistered ||
          practitioner?.isRegistered ? null : (
            <CompleteProfile />
          )}
          <StackedList
            listItems={getStackedMenuList()}
            type={'MenuList'}
            className={'flex flex-col gap-1 px-4 pt-1'}
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
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <div className="bg-white">
        <TabList className="mb-1 bg-white" tabItems={tabItem} />
      </div>
    </BannerWrapper>
  );
};
