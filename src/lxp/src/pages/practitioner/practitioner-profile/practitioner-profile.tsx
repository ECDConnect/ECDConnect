import { useDialog } from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  DialogPosition,
  MenuListDataItem,
  StackedList,
  TabItem,
  TabList,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useDocuments } from '@hooks/useDocuments';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { LogoutModal } from '../../../modals';
import { useAppDispatch } from '@store';
import { classroomsSelectors } from '@store/classroom';
import { userSelectors } from '@store/user';
import { analyticsActions } from '@store/analytics';
import ROUTES from '@routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { usePrevious } from 'react-use';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import { PractitionerProfileRouteState } from './practitioner-profile.types';
import { NavigationNames } from '@/pages/navigation';
import { JoinOrAddPreschoolModal } from '@/components/join-or-add-preschool-modal/join-or-add-preschool-modal';
import { useTenant } from '@/hooks/useTenant';
import { ReassignClassPageState } from '@/pages/classroom/class-dashboard/practitioners/reassign-class/reassign-class.types';
import { AbsenceCard } from '@/pages/classroom/class-dashboard/practitioners/principal-practitioner-profile/components/absence-card/absence-card';
import { JourneyTimeline } from './practitioner-journey/journey-timeline-index';
import { PublishedFormsList } from './practitioner-journey/published-forms';
import { ViewPublishedForm } from './practitioner-journey/published-forms/published-form-view';

export const PractitionerProfile: React.FC = () => {
  const [isJourneyFormOpen, setIsJourneyFormOpen] = useState(false);
  const [isJourneyReportOpen, setIsJourneyReportOpen] = useState(false);
  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomForPractitionerAnyType: any = classroom;
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
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
  const tenant = useTenant();
  const isOpenAccess = tenant?.isOpenAccess;
  const location = useLocation<PractitionerProfileRouteState>();

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    location.state?.tabIndex !== undefined ? location.state?.tabIndex : 0
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
        isFromPrincipalPractitionerProfile: true,
      } as ReassignClassPageState);
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
        return (
          <JoinOrAddPreschoolModal onSubmit={onSubmit} isTrialPeriod={false} />
        );
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
      {
        title: 'Get help',
        titleStyle,
        subTitle: 'Help videos & chat support',
        subTitleStyle,
        menuIcon: 'QuestionMarkCircleIcon',
        showIcon: true,
        iconBackgroundColor: 'warning',
        iconColor: 'white',
        backgroundColor: 'warningBg',
        onActionClick: () => {
          if (isOnline) {
            history.push(ROUTES.PRACTITIONER.HELP.ROOT);
          } else {
            showOnlineOnly();
          }
        },
      },
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
            position: DialogPosition.Middle,
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
          ((classroom &&
            classroom.id &&
            classroomGroups &&
            classroomGroups?.length > 0) ||
            (classroomGroups && !missingProgramme) ||
            isOpenAccess) &&
          !(!classroom && practitioner?.principalHierarchy)
        ) {
          if (isOnline) {
            history.push(ROUTES.PRACTITIONER.PROGRAMME_INFORMATION);
          } else {
            showOnlineOnly();
          }
        } else if (!isOpenAccess) {
          showCompleteProfileBlockingDialog();
        }
      },
    });

    return stackedMenuList.filter(
      (item) => item.title !== 'Get help' || isOpenAccess
    );
  };

  const tabItem: TabItem[] = [
    {
      title: 'Profile',
      initActive: true,
      child: (
        <div>
          <StackedList
            listItems={getStackedMenuList()}
            type={'MenuList'}
            className={'flex flex-col gap-1 bg-white px-4 pt-1'}
          ></StackedList>
        </div>
      ),
    },
    {
      title: 'Journey',
      initActive: false,
      child: (
        <JourneyTimeline
          onIsDisplayFormChange={setIsJourneyFormOpen}
          onIsDisplayReportChange={setIsJourneyReportOpen}
          tenantName={tenant.tenant?.applicationName || ''}
        />
      ),
    },
  ];

  const handleOnBack = useCallback(() => {
    setIsJourneyFormOpen(false);
    setIsJourneyReportOpen(false);
  }, []);

  const setTabSelected = (tabIndex: number) => {
    setSelectedTabIndex(tabIndex);
  };

  if (isJourneyFormOpen) {
    return <PublishedFormsList onBack={handleOnBack} />;
  }

  if (isJourneyReportOpen) {
    return <ViewPublishedForm onBack={handleOnBack} />;
  }

  return (
    <BannerWrapper
      size="normal"
      renderBorder={true}
      title={`${user?.firstName || user?.userName} ${
        user?.surname ? user?.surname : ''
      }`}
      color={'primary'}
      onBack={() => history.push(ROUTES.ROOT)}
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <TabList
        className="bg-uiBg mb-1 bg-white"
        tabItems={tabItem}
        setSelectedIndex={selectedTabIndex}
        tabSelected={(_, tabIndex: number) => setTabSelected(tabIndex)}
      />
      {displayError && (
        <Alert
          className={'mt-5 mb-3'}
          message={'Password or Username incorrect. Please try again'}
          type={'error'}
        />
      )}
      {practitioner?.isPrincipal && selectedTabIndex === 0 && (
        <AbsenceCard
          className="w-12/12 ml-4 mr-4 mt-5 shadow"
          practitioner={practitioner!}
          handleReassignClass={handleReassignClass}
          practitionerUserId={practitioner?.userId!}
        />
      )}
    </BannerWrapper>
  );
};
