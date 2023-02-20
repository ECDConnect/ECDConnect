import { LocalStorageKeys, useDialog } from '@ecdlink/core';
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
import ChildList from '../child-list/child-list';
import ProgrammeDashboard from '../programme-planning/programme-dashboard/programme-dashboard';
import * as styles from './class-dashboard.styles';
import { ClassDashboardRouteState } from './class-dashboard.types';
import ROUTES from '@routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import PractitionersList from './practitioners/practitioners-list/practitioners-list';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import walktroughImage from '../../../assets/walktroughImage.png';
import { childrenSelectors } from '@/store/children';

export const ClassDashboard: React.FC = () => {
  const dialog = useDialog();
  const userAuth = useSelector(authSelectors.getAuthUser);
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
  const [showAttendance, setShowAttendance] = useState(true);
  const appDispatch = useAppDispatch();
  const [previousTabIndex, setPreviousTabIndex] = useState<number>();
  const [currentTab, setCurrentTab] = useState<TabItem>();
  const { isOnline } = useOnlineStatus();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const children = useSelector(childrenSelectors.getChildren);
  const showAttendanceTutorial = useMemo(
    () =>
      selectedTabIndex === 0 &&
      (practitioner?.progress! < 3 || practitioner?.progress === undefined) &&
      children?.length! > 0 &&
      showAttendance,
    [children?.length, practitioner?.progress, selectedTabIndex, showAttendance]
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
      if (isPrincipal && practitioners?.length! > 1) {
        setCurrentTab(tabItemsForPrincipal[selectedTabIndex]);
      } else {
        setCurrentTab(tabItems[selectedTabIndex]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabIndex]);

  const tabItems: TabItem[] = [
    {
      title: 'Attendance',
      initActive: false,
      child: <AttendanceComponent />,
    },
    {
      title: 'Children',
      initActive: false,
      child: <ChildList />,
    },
    {
      title: 'Programme',
      initActive: false,
      child: <ProgrammeDashboard />,
    },
    {
      title: 'Resources',
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
      title: 'Attendance',
      initActive: false,
      child: <AttendanceComponent />,
    },
    {
      title: 'Practitioners',
      initActive: false,
      child: <PractitionersList />,
    },
    {
      title: 'Children',
      initActive: false,
      child: <ChildList />,
    },
    {
      title: 'Programme',
      initActive: false,
      child: <ProgrammeDashboard />,
    },
    {
      title: 'Resources',
      initActive: false,
      child: (
        <div className={'p-4'}>
          <Typography type={'body'} color="textDark" text={'Coming soon'} />
        </div>
      ),
    },
  ];

  const setTabSelected = (tab: TabItem, tabIndex: number) => {
    setPreviousTabIndex(selectedTabIndex);
    setSelectedTabIndex(tabIndex);
  };

  const displayTutorial = (type?: string) => {
    switch (type) {
      case 'Attendance':
        setAttendanceTutorialActive(true);
        break;
      case 'Programme':
        history.push(ROUTES.PROGRAMMES.TUTORIAL.GETTING_STARTED);
        break;
      default:
        break;
    }
  };

  const displayHelp =
    currentTab?.title === 'Attendance' || currentTab?.title === 'Programme';

  const closeAttendanceTutorial = useCallback(() => {
    if (!attendanceTutorialComplete && previousTabIndex) {
      setSelectedTabIndex(previousTabIndex);
    }
    setAttendanceTutorialActive(false);
  }, [attendanceTutorialComplete, previousTabIndex]);

  const updatePractitionerProgress = async () => {
    await new PractitionerService(
      userAuth?.auth_token!
    ).UpdatePractitionerProgress(practitioner?.userId!, 3.0);
  };

  const completeTutorial = () => {
    setStorageItem(true, LocalStorageKeys.attendanceTutorialComplete);
    setAttendanceTutorialComplete(true);
    setSelectedTabIndex(0);
    setAttendanceTutorialActive(false);
    updatePractitionerProgress();
  };

  const handleDeclineAttendanceTutorial = () => {
    dialog({
      position: DialogPosition.Bottom,
      render: (submit, cancel) => (
        <ActionModal
          customIcon={
            <div className="flex">
              <img src={walktroughImage} alt="profile" className="mb-2" />
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
  };

  const handleAttendanceTutorial = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <ActionModal
          customIcon={
            <img src={walktroughImage} alt="profile" className="mb-2" />
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
  };

  useEffect(() => {
    if (showAttendanceTutorial && !attendanceTutorialComplete) {
      handleAttendanceTutorial();
    }
  }, [showAttendanceTutorial]);

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
            isPrincipal && practitioners?.length! > 1
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
          />
        </div>
      </Dialog>
    </>
  );
};

export default ClassDashboard;
