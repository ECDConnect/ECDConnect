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
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import { getStorageItem } from '@utils/common/local-storage.utils';
import { AttendanceComponent } from '../classroom/attendance/attendance';
import ChildList from '../classroom/child-list/child-list';
import ProgrammeDashboard from '../classroom/programme-planning/programme-dashboard/programme-dashboard';
import { ClassDashboardRouteState } from './business.types';
import ROUTES from '@routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { Money } from './money/money';

export const Business: React.FC = () => {
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
  const appDispatch = useAppDispatch();
  const [previousTabIndex, setPreviousTabIndex] = useState<number>();
  const [currentTab, setCurrentTab] = useState<TabItem>();
  const { isOnline } = useOnlineStatus();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);

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
      setCurrentTab(tabItemsForPrincipal[selectedTabIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabIndex]);

  const tabItemsForPrincipal: TabItem[] = [
    {
      title: 'Money',
      initActive: true,
      child: <Money />,
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
    currentTab?.title === 'Money' || currentTab?.title === 'Programme';

  const updatePractitionerProgress = async () => {
    await new PractitionerService(
      userAuth?.auth_token!
    ).UpdatePractitionerProgress(practitioner?.userId!, 3.0);
  };

  return (
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={'Business'}
        subTitle={date}
        color={'primary'}
        onBack={() => backToDashboard()}
        displayHelp={displayHelp}
        onHelp={() => displayTutorial(currentTab?.title)}
        displayOffline={!isOnline}
      >
        <TabList
          className="bg-uiBg"
          tabItems={tabItemsForPrincipal}
          setSelectedIndex={selectedTabIndex}
          tabSelected={(tab: TabItem, tabIndex: number) =>
            setTabSelected(tab, tabIndex)
          }
        />
      </BannerWrapper>
    </>
  );
};

export default Business;
