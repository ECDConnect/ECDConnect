import { useDialog } from '@ecdlink/core';
import {
  Alert,
  ActionModal,
  BannerWrapper,
  DialogPosition,
  MenuListDataItem,
  StackedList,
  TabItem,
  TabList,
  Card,
  Typography,
  Button,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useDocuments } from '@hooks/useDocuments';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { OfflineSyncModal, LogoutModal } from '../../../modals';
import { useAppDispatch } from '@store';
import { classroomsSelectors } from '@store/classroom';
import { settingSelectors } from '@store/settings';
import { userSelectors } from '@store/user';
import { analyticsActions } from '@store/analytics';
import CompleteProfile from '../edit-practitioner-profile/components/complete-profile/complete-profile';
import ROUTES from '@routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { PractitionerJourney } from './practitioner-journey';
import { usePrevious } from 'react-use';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import { PractitionerProfileRouteState } from './practitioner-profile.types';
import { NavigationNames } from '@/pages/navigation';
import { JoinOrAddPreschoolModal } from '@/components/join-or-add-preschool-modal/join-or-add-preschool-modal';
// import { syncThunkActions } from '@/store/sync';

export const PractitionerProfile: React.FC = () => {
  const [isJourneyFormOpen, setJourneyFormOpen] = useState(false);
  // const { resetAuth, resetAppStore } = useStoreSetup();
  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isTrainee = practitioner?.isTrainee;
  const isPrincipal = practitioner?.isPrincipal;
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomForPractitionerAnyType: any = classroom;
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const lastDataSyncDate = useSelector(settingSelectors.getLastDataSync);
  const appDispatch = useAppDispatch();
  const { userProfilePicture, classroomImage } = useDocuments();
  const { isOnline } = useOnlineStatus();
  const [displayError] = useState(false);
  const history = useHistory();
  const dialog = useDialog();
  const missingProgramme =
    (practitioner?.isRegistered === null || practitioner?.isRegistered) &&
    !practitioner?.principalHierarchy &&
    !isPrincipal;

  const location = useLocation<PractitionerProfileRouteState>();

  const wasJourneyFormOpen = usePrevious(isJourneyFormOpen);

  const selectedTab =
    wasJourneyFormOpen && !isJourneyFormOpen
      ? 1
      : location.state?.tabIndex || undefined;
  // const sync = async () => {
  //   if (practitioner?.isPrincipal === true) {
  //     await appDispatch(syncThunkActions.syncOfflineData({}));
  //   } else {
  //     await appDispatch(syncThunkActions.syncOfflineDataForPractitioner({}));
  //   }
  //   await appDispatch(settingActions.setLastDataSync());
  // };

  const handleOnlineCallback = (callback: () => void) => {
    if (isOnline) {
      callback();
    } else {
      dialog({
        color: 'bg-white',
        position: DialogPosition.Middle,
        render: (onSubmit) => {
          return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
        },
      });
    }
  };

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

  const handleReassignClass = useCallback(
    (practitionerId: string, allAbsenteeClasses?: AbsenteeDto[]) => {
      if (allAbsenteeClasses) {
        history.push(ROUTES.PRINCIPAL.PRACTITIONER_REASSIGN_CLASS, {
          practitionerId,
          allAbsenteeClasses,
        });
        return;
      }

      history.push(ROUTES.PRINCIPAL.PRACTITIONER_REASSIGN_CLASS, {
        practitionerId,
        principalPractitioner: practitioner,
      });
    },
    [history, practitioner]
  );

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <OnlineOnlyModal
            overrideText={'You need to go online to use this feature.'}
            onSubmit={onSubmit}
          ></OnlineOnlyModal>
        );
      },
    });
  };

  const showCompleteProfileBlockingDialog = () => {
    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => {
        return <JoinOrAddPreschoolModal onSubmit={onSubmit} />;
      },
    });
  };

  const getStackedMenuList = (): MenuListDataItem[] => {
    const titleStyle = 'text-textDark font-semibold text-base leading-snug';
    const subTitleStyle = 'text-sm font-h1 font-normal text-textMid';
    const profilePc =
      userProfilePicture?.file ||
      user?.profileImageUrl ||
      userProfilePicture?.reference;
    const stackedMenuList: MenuListDataItem[] = [
      {
        title: 'About me',
        titleStyle,
        subTitle: 'Login, contact details',
        subTitleStyle,
        menuIconUrl: profilePc,
        menuIcon: 'UserIcon',
        iconBackgroundColor: 'quatenary',
        iconColor: 'white',
        showIcon: profilePc === undefined,
        backgroundColor: 'quatenaryBg',
        onActionClick: () => {
          history.push(ROUTES.PRACTITIONER.ABOUT.ROOT);
        },
      },
      // {
      //   title: 'Account',
      //   titleStyle,
      //   subTitleStyle,
      //   subTitle: 'Password',
      //   menuIcon: 'ShieldCheckIcon',
      //   menuIconClassName: 'text-white',
      //   iconBackgroundColor: 'tertiary',
      //   showIcon: true,
      //   iconColor: 'white',
      //   onActionClick: () => {
      //     history.push(ROUTES.PRACTITIONER.ACCOUNT);
      //   },
      // },
      {
        title: NavigationNames.Logout,
        titleStyle,
        subTitleStyle,
        subTitle: 'Sign out of the app',
        menuIcon: 'LogoutIcon',
        iconColor: 'white',
        iconBackgroundColor: 'tertiary',
        backgroundColor: 'tertiaryAccent2',
        showIcon: true,
        onActionClick: () => {
          dialog({
            position: DialogPosition.Bottom,
            render: (onSubmit, onCancel) => {
              return (
                <LogoutModal
                  onSubmit={onSubmit}
                  onCancel={onCancel}
                ></LogoutModal>
              );
            },
          });
        },
      },
    ];

    if (!isTrainee) {
      stackedMenuList.splice(2, 0, {
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
            blocking: true,
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
      });

      stackedMenuList?.splice(1, 0, {
        title: 'Preschool',
        titleStyle,
        subTitle:
          classroomForPractitionerAnyType && practitioner?.isPrincipal !== true
            ? classroomForPractitionerAnyType?.name
            : classroom?.name || 'N/A',
        subTitleStyle,
        menuIconUrl: classroomImage?.file,
        menuIcon: 'HeartIcon',
        menuIconClassName: 'text-white',
        iconBackgroundColor: 'secondary',
        backgroundColor: 'secondaryAccent2',
        iconColor: 'white',
        showIcon: classroomImage?.file === undefined,
        onActionClick: () => {
          if (
            (classroom && classroom.id) ||
            (classroomGroups && !missingProgramme)
          ) {
            if (isOnline) {
              history.push(ROUTES.PRACTITIONER.PROGRAMME_INFORMATION);
            } else {
              showOnlineOnly();
            }
          } else {
            showCompleteProfileBlockingDialog();
          }
        },
      });
    }

    return stackedMenuList;
  };

  const tabItem: TabItem[] = [
    {
      title: 'Profile',
      initActive: true,
      child: (
        <div>
          {/* {practitioner?.progress !== 0 ? null : <CompleteProfile />} */}
          <StackedList
            listItems={getStackedMenuList()}
            type={'MenuList'}
            className={'flex flex-col gap-1 px-4 pt-1'}
          ></StackedList>
        </div>
      ),
    },
    {
      title: 'Journey',
      initActive: false,
      child: <PractitionerJourney onIsDisplayFormChange={setJourneyFormOpen} />,
    },
  ];

  if (isJourneyFormOpen) {
    return <PractitionerJourney onIsDisplayFormChange={setJourneyFormOpen} />;
  }

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
      <TabList
        className="bg-uiBg mb-1"
        tabItems={tabItem}
        setSelectedIndex={selectedTab}
      />
      {displayError && (
        <Alert
          className={'mt-5 mb-3'}
          message={'Password or Username incorrect. Please try again'}
          type={'error'}
        />
      )}
      {practitioner?.isPrincipal && (
        <Card className={'bg-uiBg mt-4 ml-4 mb-8 w-11/12 rounded-xl pt-2'}>
          <div className={'mt-6 ml-4'}>
            <Typography
              type={'h1'}
              color="textDark"
              text={`Log my time off`}
              className={'mt-6 ml-4'}
            />
            <Typography
              type={'body'}
              color="textMid"
              text={`Need time off for more than 1 day? Record your leave here and your coach will get a notification.`}
              className={'mt-4 ml-4'}
            />
            <div className="flex justify-center">
              <Button
                type="filled"
                color="primary"
                className={'mt-6 mb-6 w-11/12 rounded-2xl'}
                onClick={() => handleReassignClass(practitioner?.userId!)}
              >
                {renderIcon(
                  'PencilAltIcon',
                  'w-5 h-5 color-white text-white mr-1'
                )}
                <Typography
                  type="body"
                  className="mr-4"
                  color="white"
                  text={'Take time off'}
                ></Typography>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </BannerWrapper>
  );
};
