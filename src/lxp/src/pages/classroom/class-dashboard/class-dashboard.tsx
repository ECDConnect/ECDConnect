import { LocalStorageKeys, RoleSystemNameEnum, useDialog } from '@ecdlink/core';
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
import ProgrammeDashboard from '../programme-planning/programme-dashboard/programme-dashboard';
import * as styles from './class-dashboard.styles';
import { ClassDashboardRouteState, TabsItems } from './class-dashboard.types';
import ROUTES from '@routes/routes';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import walkthroughImage from '../../../assets/walktroughImage.png';
import { childrenSelectors } from '@/store/children';
import { getReportingPeriodDateInReportDate } from '@/utils/child/child-profile-utils';
import { userSelectors } from '@/store/user';
import { contentReportSelectors } from '@/store/content/report';
import {
  programmeThemeSelectors,
  programmeThemeThunkActions,
} from '@/store/content/programme-theme';
import { usePractitionerAbsentees } from '@/hooks/usePractitionerAbsentees';
import { Classes } from '../classes/classes';
import { NavigationNames } from '@/pages/navigation';

export const ClassDashboard: React.FC = () => {
  const dialog = useDialog();
  const history = useHistory();
  const { state } = useLocation<ClassDashboardRouteState>();
  const date = format(new Date(), 'EEEE, d LLLL');
  const [attendanceTutorialActive, setAttendanceTutorialActive] =
    useState<boolean>(false);
  const [attendanceTutorialComplete, setAttendanceTutorialComplete] =
    useState<boolean>(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 1
  );
  const [programmeStartDate, setProgrammeStartDate] = useState(
    state?.programmeStartDate
  );
  const [promptPhotoReportPermission, setPromptPhotoReportPermission] =
    useState<boolean>(false);
  const [showAttendance, setShowAttendance] = useState(true);
  const appDispatch = useAppDispatch();
  const [previousTabIndex, setPreviousTabIndex] = useState<number>();
  const [currentTab, setCurrentTab] = useState<TabItem>();
  const { isOnline } = useOnlineStatus();
  const user = useSelector(userSelectors.getUser);
  const isCoach = user?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const children = useSelector(childrenSelectors.getChildren);
  const themes = useSelector(programmeThemeSelectors.getProgrammeThemes);
  const showAttendanceTutorial = useMemo(
    () =>
      selectedTabIndex === 0 &&
      (practitioner?.progress! < 3 || practitioner?.progress === undefined) &&
      children?.length! > 0 &&
      showAttendance,
    [children?.length, practitioner?.progress, selectedTabIndex, showAttendance]
  );

  const reportingPeriod = useMemo(
    () => getReportingPeriodDateInReportDate(new Date()),
    []
  );

  const { practitionerIsOnLeave } = usePractitionerAbsentees(practitioner!);

  const hasCreatedReportForCurrentPeriod = useSelector(
    contentReportSelectors.hasChildSummaryReportsForReportingPeriod(
      reportingPeriod?.reportingDate
    )
  );

  const backToDashboard = () => {
    history.push('/');
  };

  const isPrincipal = practitioner?.isPrincipal === true;

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
    if (!practitioner || !user || !user.profileImageUrl) return;
    if (!reportingPeriod || hasCreatedReportForCurrentPeriod) return;
    const prefix = `${reportingPeriod.monthName}-${reportingPeriod.year}-`;
    if (
      !practitioner.usePhotoInReport ||
      !practitioner.usePhotoInReport.startsWith(prefix)
    ) {
      setPromptPhotoReportPermission(true);
    }
  }, [practitioner]);

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

  useEffect(() => {
    if (selectedTabIndex !== undefined && selectedTabIndex >= 0) {
      if (isPrincipal && practitioners?.length! > 0) {
        setCurrentTab(tabItemsForPrincipal[selectedTabIndex]);
      } else {
        setCurrentTab(tabItems[selectedTabIndex]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabIndex]);

  const tabItems: TabItem[] = [
    {
      title: NavigationNames.Classroom.Classes,
      initActive: true,
      child: <Classes />,
    },
    {
      title: NavigationNames.Classroom.Attendance,
      initActive: false,
      child: <AttendanceComponent />,
    },
    {
      title: NavigationNames.Classroom.Progress,
      initActive: false,
      child: (
        <div className={'p-4'}>
          <Typography type={'body'} color="textDark" text={'Coming soon'} />
        </div>
      ),
    },
    {
      title: NavigationNames.Classroom.Activities,
      initActive: false,
      child: <ProgrammeDashboard programmeStartDate={programmeStartDate} />,
    },
    {
      title: NavigationNames.Classroom.Resources,
      initActive: false,
      child: (
        <div className={'p-4'}>
          <Typography type={'body'} color="textDark" text={'Coming soon'} />
        </div>
      ),
    },
  ];

  const tabItemsForPrincipal: TabItem[] = [
    {
      title: NavigationNames.Classroom.Classes,
      initActive: true,
      child: <Classes />,
    },
    {
      title: NavigationNames.Classroom.Attendance,
      initActive: false,
      child: <AttendanceComponent />,
    },
    {
      title: NavigationNames.Classroom.Progress,
      initActive: false,
      child: (
        <div className={'p-4'}>
          <Typography type={'body'} color="textDark" text={'Coming soon'} />
        </div>
      ),
    },
    {
      title: NavigationNames.Classroom.Activities,
      initActive: false,
      child: <ProgrammeDashboard programmeStartDate={programmeStartDate} />,
    },
    {
      title: NavigationNames.Classroom.Resources,
      initActive: false,
      child: (
        <div className={'p-4'}>
          <Typography type={'body'} color="textDark" text={'Coming soon'} />
        </div>
      ),
    },
  ];

  const setTabSelected = (tab: TabItem, tabIndex: number) => {
    setProgrammeStartDate(new Date());
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
        setAttendanceTutorialActive(true);
        break;
      case NavigationNames.Classroom.Programme:
        history.push(ROUTES.PROGRAMMES.TUTORIAL.GETTING_STARTED);
        break;
      default:
        break;
    }
  };

  const displayHelp =
    currentTab?.title === NavigationNames.Classroom.Attendance ||
    currentTab?.title === NavigationNames.Classroom.Programme;

  const closeAttendanceTutorial = useCallback(() => {
    if (!attendanceTutorialComplete && previousTabIndex) {
      setSelectedTabIndex(previousTabIndex);
    }
    setAttendanceTutorialActive(false);
  }, [attendanceTutorialComplete, previousTabIndex]);

  const updatePractitionerProgress = async () => {
    await appDispatch(
      practitionerThunkActions.updatePractitionerProgress({
        practitionerId: practitioner?.userId,
        progress: 3.0,
      })
    );
  };

  const completeTutorial = () => {
    setStorageItem(true, LocalStorageKeys.attendanceTutorialComplete);
    setAttendanceTutorialComplete(true);
    setSelectedTabIndex(0);
    setAttendanceTutorialActive(false);
    updatePractitionerProgress();
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
              colour: 'primary',
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

  const handleAttendanceTutorial = useCallback(() => {
    if (practitionerIsOnLeave) return;

    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <ActionModal
          customIcon={
            <img src={walkthroughImage} alt="profile" className="mb-2" />
          }
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Want to learn how to track attendance on Funda App?`}
          actionButtons={[
            {
              text: 'Yes, help me!',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                setAttendanceTutorialActive(true);
                submit();
              },
              leadingIcon: 'ChevronRightIcon',
            },
            {
              text: 'No, skip',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                setShowAttendance(false);
                handleDeclineAttendanceTutorial();
              },
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
  }, [dialog, handleDeclineAttendanceTutorial, practitionerIsOnLeave]);

  useEffect(() => {
    if (showAttendanceTutorial && !attendanceTutorialComplete) {
      handleAttendanceTutorial();
    }
  }, [
    attendanceTutorialComplete,
    handleAttendanceTutorial,
    showAttendanceTutorial,
  ]);

  const updatePractitionerUsePhotoReportPermission = useCallback(
    async (usePhotoInReport: string) => {
      await appDispatch(
        practitionerThunkActions.updatePractitionerUsePhotoInReport({
          practitionerId: practitioner?.userId,
          usePhotoInReport: usePhotoInReport,
        })
      );
    },
    [appDispatch, practitioner?.userId]
  );

  const handlePromptPhotoReportPermission = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <ActionModal
          className="bg-white"
          customIcon={
            <div className="flex">
              <img
                src={user?.profileImageUrl}
                alt="profile avatar"
                className="mb-5 h-20 w-20"
              />
            </div>
          }
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Would you like to include your Funda App profile photo on your ${reportingPeriod?.monthName} ${reportingPeriod?.year} child progress reports?`}
          detailText={'You can change this photo in your profile.'}
          actionButtons={[
            {
              text: 'Yes, include photo!',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                submit();
                updatePractitionerUsePhotoReportPermission(
                  `${reportingPeriod?.monthName}-${reportingPeriod?.year}-yes`
                );
              },
              leadingIcon: 'CheckCircleIcon',
            },
            {
              text: 'No, skip',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                submit();
                updatePractitionerUsePhotoReportPermission(
                  `${reportingPeriod?.monthName}-${reportingPeriod?.year}-no`
                );
              },
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
  }, [
    dialog,
    reportingPeriod?.monthName,
    reportingPeriod?.year,
    updatePractitionerUsePhotoReportPermission,
    user?.profileImageUrl,
  ]);

  useEffect(() => {
    if (promptPhotoReportPermission) {
      handlePromptPhotoReportPermission();
      setPromptPhotoReportPermission(false);
    }
  }, [handlePromptPhotoReportPermission, promptPhotoReportPermission]);

  useEffect(() => {
    if (isCoach) {
      history.push(ROUTES.COACH.ROOT);
    }
  }, [history, isCoach]);

  useEffect(() => {
    if (
      state?.activeTabIndex !== undefined &&
      state?.activeTabIndex !== selectedTabIndex
    ) {
      setSelectedTabIndex(state?.activeTabIndex || 0);
      history.replace({
        state: {
          activeTabIndex: undefined,
        },
      });
    }
  }, [history, selectedTabIndex, state?.activeTabIndex]);

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
          className="bg-uiBg"
          tabItems={
            isPrincipal && practitioners?.length! > 0
              ? tabItemsForPrincipal
              : tabItems
          }
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
          <AttendanceTutorial
            onComplete={completeTutorial}
            onClose={() => closeAttendanceTutorial()}
            updatePractitionerProgress={updatePractitionerProgress}
          />
        </div>
      </Dialog>
    </>
  );
};

export default ClassDashboard;
