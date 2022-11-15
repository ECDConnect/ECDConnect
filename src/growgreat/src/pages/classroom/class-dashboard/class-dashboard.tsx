import { LocalStorageKeys } from '@ecdlink/core';
import {
  BannerWrapper,
  Dialog,
  DialogPosition,
  TabItem,
  TabList,
  Typography,
} from '@ecdlink/ui';
import format from 'date-fns/format';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import {
  getStorageItem,
  // setStorageItem,
} from '@utils/common/local-storage.utils';
// import { AttendanceComponent } from '../attendance/attendance';
// import AttendanceTutorial from '../attendance/components/attendance-tutorial/attendance-tutorial';
// import ChildList from '../child-list/child-list';
// import ProgrammeDashboard from '../programme-planning/programme-dashboard/programme-dashboard';
import * as styles from './class-dashboard.styles';
import { ClassDashboardRouteState } from './class-dashboard.types';
import ROUTES from '@routes/routes';
// import { MotherList } from '../mother-list/mother-list';
// import { InfantList } from '../infant-list/infant-list';
import { ClientList } from '../client-list/client-list';

export const ClassDashboard: React.FC = () => {
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
  const appDispatch = useAppDispatch();
  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    previousTabIndex,
    setPreviousTabIndex,
  ] = useState<number>();
  const [currentTab, setCurrentTab] = useState<TabItem>();
  const { isOnline } = useOnlineStatus();

  const tabItems: TabItem[] = [
    {
      title: 'Highlights',
      initActive: false,
      child: (
        <Typography
          className={'p-4'}
          type={'body'}
          color="textDark"
          text={'Coming soon'}
        />
      ),
    },
    {
      title: 'Clients',
      initActive: true,
      child: <ClientList />,
    },
    {
      title: 'Visits',
      initActive: false,
      child: (
        <Typography
          className={'p-4'}
          type={'body'}
          color="textDark"
          text={'Coming soon'}
        />
      ),
    },
  ];

  function backToDashboard() {
    history.push('/');
  }

  function setTabSelected(tab: TabItem, tabIndex: number) {
    if (tab.title === 'Attendance' && !attendanceTutorialComplete) {
      displayTutorial('Attendance');
    }

    setPreviousTabIndex(selectedTabIndex);
    setSelectedTabIndex(tabIndex);
  }

  function displayTutorial(type?: string) {
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
  }

  const displayHelp =
    currentTab?.title === 'Attendance' || currentTab?.title === 'Programme';

  // const closeAttendanceTutorial = () => {
  //   if (!attendanceTutorialComplete && previousTabIndex) {
  //     setSelectedTabIndex(previousTabIndex);
  //   }
  //   setAttendanceTutorialActive(false);
  // };

  // const completeTutorial = () => {
  //   setStorageItem(true, LocalStorageKeys.attendanceTutorialComplete);
  //   setAttendanceTutorialComplete(true);
  //   setSelectedTabIndex(0);
  //   setAttendanceTutorialActive(false);
  // };

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
          title: 'Clients-Dashboard',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  useEffect(() => {
    if (selectedTabIndex !== undefined && selectedTabIndex >= 0) {
      setCurrentTab(tabItems[selectedTabIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabIndex]);

  return (
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={'Client Folders'}
        subTitle={date}
        color={'primary'}
        onBack={() => backToDashboard()}
        displayHelp={displayHelp}
        onHelp={() => displayTutorial(currentTab?.title)}
        displayOffline={!isOnline}
      >
        <TabList
          className="bg-white"
          tabItems={tabItems}
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
          {/* <AttendanceTutorial
            onComplete={completeTutorial}
            onClose={() => closeAttendanceTutorial()}
          /> */}
        </div>
      </Dialog>
    </>
  );
};

export default ClassDashboard;
