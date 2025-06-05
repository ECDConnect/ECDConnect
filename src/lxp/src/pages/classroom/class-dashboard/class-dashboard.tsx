import {
  LocalStorageKeys,
  RoleSystemNameEnum,
  useDialog,
  usePrevious,
} from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Dialog,
  DialogPosition,
  TabItem,
  TabList,
  Typography,
} from '@ecdlink/ui';
import format from 'date-fns/format';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import {
  getStorageItem,
  setStorageItem,
} from '@utils/common/local-storage.utils';
import { AttendanceComponent } from '../attendance/attendance';
import AttendanceTutorial from '../attendance/components/attendance-tutorial/attendance-tutorial';
import * as styles from './class-dashboard.styles';
import { ClassDashboardRouteState, TabsItems } from './class-dashboard.types';
import ROUTES from '@routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import walkthroughImage from '../../../assets/walktroughImage.png';
import { childrenSelectors } from '@/store/children';
import { userSelectors } from '@/store/user';
import {
  programmeThemeSelectors,
  programmeThemeThunkActions,
} from '@/store/content/programme-theme';
import { usePractitionerAbsentees } from '@/hooks/usePractitionerAbsentees';
import { Classes } from '../classes/classes';
import { NavigationNames } from '@/pages/navigation';
import { WalkthroughModal } from '@/components/walkthrough/modal';
import { InitialAttendanceTutorialModal } from '../attendance/components/attendance-tutorial/initial-tutorial-modal/initial-tutorial-modal';
import { ActivitiesTab } from '../activities/activities';
import { useTenant } from '@/hooks/useTenant';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { ChildProgressLanding } from '../progress/progress-tab/child-progress-landing';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useAppContext } from '@/walkthrougContext';
import { PractitionerListRouteState } from '@/pages/practitioner/practitioner-programme-information/practitioner-list/practitioner-list.types';
import { useTenantModules } from '@/hooks/useTenantModules';
import { Resources } from '../resources/resources';
import { ProgressInfoPage } from '../progress/info/progress-info-page';

export const ClassDashboard: React.FC = () => {
  const dialog = useDialog();
  const history = useHistory();
  const isTrialPeriod = useIsTrialPeriod();
  const location = useLocation<ClassDashboardRouteState>();
  const date = format(new Date(), 'EEEE, d LLLL');
  const [attendanceTutorialActive, setAttendanceTutorialActive] =
    useState<boolean>(false);
  const [attendanceTutorialComplete, setAttendanceTutorialComplete] =
    useState<boolean>(false);

  const [showAttendanceWalkthrough, setShowAttendanceWalkthrough] =
    useState(false);
  const messageReference = location?.state?.messageReference;
  const appDispatch = useAppDispatch();
  const [previousTabIndex, setPreviousTabIndex] = useState<number>();
  const [currentTab, setCurrentTab] = useState<TabItem>();
  const { isOnline } = useOnlineStatus();
  const user = useSelector(userSelectors.getUser);
  const isCoach = user?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const children = useSelector(childrenSelectors.getChildren);
  const themes = useSelector(programmeThemeSelectors.getProgrammeThemes);
  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;
  const { attendanceEnabled, classroomActivitiesEnabled, progressEnabled } =
    useTenantModules();
  const [showProgressInfo, setShowProgressInfo] = useState(false);

  const { setState } = useAppContext();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const isToShowAttendanceTutorial = useMemo(
    () =>
      selectedTabIndex === TabsItems.ATTENDANCE &&
      (practitioner?.progress! < 3 || practitioner?.progress === undefined) &&
      children?.length! > 0,
    [children?.length, practitioner?.progress, selectedTabIndex]
  );

  const { practitionerIsOnLeave, currentAbsentee } = usePractitionerAbsentees(
    practitioner!
  );

  const { hasPermissionToTakeAttendance } = useUserPermissions();

  const hasPermissionToEdit =
    practitioner?.isPrincipal || hasPermissionToTakeAttendance || isTrialPeriod;

  const backToDashboard = () => {
    history.push('/');
  };

  useEffect(() => {
    const isTutorialComplete = getStorageItem<boolean>(
      LocalStorageKeys.attendanceTutorialComplete
    );
    if (isTutorialComplete !== undefined) {
      setAttendanceTutorialComplete(isTutorialComplete);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location.state?.activeTabIndex !== undefined) {
      setSelectedTabIndex(Number(location.state.activeTabIndex));
    }
  }, [location.state]);

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Classroom-Dashboard',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const tabItems: TabItem[] = useMemo(
    () => [
      {
        title: NavigationNames.Classroom.Classes,
        initActive: true,
        child: <Classes setSelectedTabIndex={setSelectedTabIndex} />,
      },
      {
        title: NavigationNames.Classroom.Attendance,
        initActive: false,
        child: <AttendanceComponent />,
      },
      {
        title: NavigationNames.Classroom.Progress,
        initActive: false,
        child: <ChildProgressLanding messageReference={messageReference} />,
      },
      {
        title: NavigationNames.Classroom.Activities,
        initActive: false,
        child: <ActivitiesTab />,
      },
      {
        title: NavigationNames.Classroom.Resources,
        initActive: false,
        child: <Resources />,
      },
    ],
    [messageReference]
  );

  const setTabSelected = (tab: TabItem, tabIndex: number) => {
    setPreviousTabIndex(selectedTabIndex);
    setSelectedTabIndex(tabIndex);
    if (tabIndex === TabsItems.ACTIVITES) {
      if (themes.length === 0) {
        appDispatch(
          programmeThemeThunkActions.getProgrammeThemes({ locale: 'en-za' })
        );
      }
    }
  };

  const displayTutorial = (type?: string) => {
    switch (type) {
      case NavigationNames.Classroom.Attendance:
        setAttendanceTutorialActive(!!hasPermissionToEdit);
        return;
      case NavigationNames.Classroom.Progress:
        setShowProgressInfo(true);
        return;
      default:
        break;
    }
  };

  const displayHelp =
    hasPermissionToEdit &&
    (currentTab?.title === NavigationNames.Classroom.Attendance ||
      currentTab?.title === NavigationNames.Classroom.Programme ||
      currentTab?.title === NavigationNames.Classroom.Progress);

  const closeAttendanceTutorial = useCallback(() => {
    if (!attendanceTutorialComplete && previousTabIndex) {
      setSelectedTabIndex(previousTabIndex);
    }
    setAttendanceTutorialActive(false);
  }, [attendanceTutorialComplete, previousTabIndex]);

  const completeTutorial = () => {
    setStorageItem(true, LocalStorageKeys.attendanceTutorialComplete);
    setAttendanceTutorialComplete(true);
    setAttendanceTutorialActive(false);
  };

  const handleDeclineAttendanceTutorial = useCallback(() => {
    dialog({
      position: DialogPosition.Bottom,
      render: (submit, cancel) => (
        <ActionModal
          customIcon={
            <div className="flex">
              <img src={walkthroughImage} alt="profile" className="mb-2" />
              <Typography
                text="Ok, you can always get  help by tapping the question mark at the top of the screen!"
                type={'body'}
                color={'textDark'}
                align="center"
                className="mt-2"
              />
            </div>
          }
          iconColor="alertMain"
          iconBorderColor="alertBg"
          actionButtons={[
            {
              text: 'Close',
              textColour: 'white',
              colour: 'quatenary',
              type: 'filled',
              onClick: () => {
                submit();
                setStorageItem(
                  true,
                  LocalStorageKeys.attendanceTutorialComplete
                );
              },
              leadingIcon: 'XIcon',
            },
          ]}
        />
      ),
    });
  }, [dialog]);

  const handleWalkthroughStart = useCallback(() => {
    setState({ run: true, tourActive: true, stepIndex: 0 });
    history.push(ROUTES.ATTENDANCE_TUTORIAL_WALKTHROUGH);
  }, [history, setState]);

  const handleAttendanceWalkthroughLanguage = useCallback(() => {
    setShowAttendanceWalkthrough(false);

    return dialog({
      blocking: true,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => (
        <WalkthroughModal
          onStart={() => {
            handleWalkthroughStart();
            onClose();
          }}
        />
      ),
    });
  }, [dialog, handleWalkthroughStart]);

  useEffect(() => {
    if (
      hasPermissionToEdit &&
      isToShowAttendanceTutorial &&
      !attendanceTutorialComplete &&
      !practitionerIsOnLeave
    ) {
      setShowAttendanceWalkthrough(true);
    }
  }, [
    hasPermissionToEdit,
    attendanceTutorialComplete,
    practitionerIsOnLeave,
    isToShowAttendanceTutorial,
  ]);

  const handleIsOnLeaveModal = useCallback(() => {
    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        history.push(ROUTES.DASHBOARD);

        return (
          <ActionModal
            icon="ExclamationCircleIcon"
            iconColor="alertMain"
            iconSize={24}
            importantText={`You are on leave and cannot use this section`}
            detailText={`You are on leave from ${format(
              new Date((currentAbsentee?.absentDate as Date) || new Date()),
              'd MMM yyyy'
            )} to ${format(
              currentAbsentee?.absentDateEnd
                ? new Date(currentAbsentee?.absentDateEnd)
                : new Date(),

              'd MMM yyyy'
            )}. If you believe this is a mistake please reach out to ${
              currentAbsentee?.loggedByPerson
            }.`}
            actionButtons={[
              {
                text: `Contact ${currentAbsentee?.loggedByPerson}`,
                textColour: 'white',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => {
                  history.push({
                    pathname: ROUTES.PRINCIPAL.PRACTITIONER_LIST,
                    state: {
                      ...location.state,
                      returnRoute: ROUTES.DASHBOARD,
                      isToShowPrincipal: true,
                    } as PractitionerListRouteState,
                  });
                  onClose();
                },
                leadingIcon: 'ChatAltIcon',
              },
              {
                text: `Close`,
                textColour: 'quatenary',
                colour: 'quatenary',
                type: 'outlined',
                onClick: () => {
                  history.push(ROUTES.DASHBOARD);
                  onClose();
                },
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  }, [
    currentAbsentee?.absentDate,
    currentAbsentee?.absentDateEnd,
    currentAbsentee?.loggedByPerson,
    dialog,
    history,
    location.state,
  ]);

  useEffect(() => {
    if (
      practitionerIsOnLeave &&
      !practitioner?.isPrincipal &&
      !practitioner?.isLeaving
    ) {
      handleIsOnLeaveModal();
    }

    // INFO: render once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitionerIsOnLeave, practitioner]);

  useEffect(() => {
    if (isCoach) {
      history.push({
        pathname: ROUTES.COACH.ROOT,
        state: location.state, // Preserve the state
      });
    }
  }, [history, isCoach, location.state]);

  // useEffect(() => {
  //   if (
  //     state?.activeTabIndex !== undefined &&
  //     state?.activeTabIndex !== selectedTabIndex
  //   ) {
  //     setSelectedTabIndex(state?.activeTabIndex || selectedTabIndex);
  //     history.replace({
  //       state: {
  //         ...state,
  //         activeTabIndex: undefined,
  //       },
  //     });
  //   }
  // }, [history, selectedTabIndex, state, state?.activeTabIndex]);

  return (
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={'Classroom'}
        subTitle={date}
        color={'primary'}
        onBack={() => backToDashboard()}
        displayHelp={displayHelp}
        onHelp={() => displayTutorial(currentTab?.title)}
        displayOffline={!isOnline}
        id={'header'}
      >
        <TabList
          activeTabColour="quatenary"
          className="bg-uiBg"
          tabItems={tabItems
            ?.filter((item) =>
              !attendanceEnabled && isWhiteLabel
                ? item?.title !== NavigationNames.Classroom.Attendance
                : item
            )
            ?.filter((item) =>
              !classroomActivitiesEnabled && isWhiteLabel
                ? item?.title !== NavigationNames.Classroom.Activities
                : item
            )
            ?.filter((item) =>
              !progressEnabled && isWhiteLabel
                ? item?.title !== NavigationNames.Classroom.Progress
                : item
            )}
          setSelectedIndex={selectedTabIndex}
          tabSelected={(tab: TabItem, tabIndex: number) =>
            setTabSelected(tab, tabIndex)
          }
        />
      </BannerWrapper>
      <Dialog
        fullScreen
        visible={attendanceTutorialActive}
        position={DialogPosition.Top}
      >
        <div className={styles.dialogContent}>
          <AttendanceTutorial onClose={() => closeAttendanceTutorial()} />
        </div>
      </Dialog>
      <div className={styles.dialogContent}>
        <Dialog
          fullScreen={true}
          visible={showProgressInfo}
          position={DialogPosition.Full}
        >
          <ProgressInfoPage onClose={() => setShowProgressInfo(false)} />
        </Dialog>
      </div>
      <Dialog
        visible={showAttendanceWalkthrough}
        position={DialogPosition.Middle}
        className="px-4"
      >
        <InitialAttendanceTutorialModal
          onStart={handleAttendanceWalkthroughLanguage}
          onClose={() => {
            setShowAttendanceWalkthrough(false);
            handleDeclineAttendanceTutorial();
            completeTutorial();
          }}
        />
      </Dialog>
    </>
  );
};

export default ClassDashboard;
