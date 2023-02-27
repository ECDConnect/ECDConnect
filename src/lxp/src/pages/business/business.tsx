/* eslint-disable @typescript-eslint/no-unused-vars */
import { LocalStorageKeys } from '@ecdlink/core';
import {
  BannerWrapper,
  TabItem,
  TabList,
  Typography,
  DialogPosition,
  Dialog,
} from '@ecdlink/ui';
import format from 'date-fns/format';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import { getStorageItem } from '@utils/common/local-storage.utils';
import { ClassDashboardRouteState } from './business.types';
import ROUTES from '@routes/routes';
import { Money } from './money/money';
import { StatementsInfoPage } from './components/statements-info-page';

export const Business: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation<ClassDashboardRouteState>();
  const date = format(new Date(), 'EEEE, d LLLL');
  const [attendanceTutorialActive, setAttendanceTutorialActive] =
    useState<boolean>(false);
  const [attendanceTutorialComplete, setAttendanceTutorialComplete] =
    useState<boolean>(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 0
  );
  const appDispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [previousTabIndex, setPreviousTabIndex] = useState<number>();
  const [currentTab, setCurrentTab] = useState<TabItem>();
  const { isOnline } = useOnlineStatus();
  const [showInfo, setShowInfo] = useState(false);

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
    setShowInfo(true);
  };

  const displayHelp =
    currentTab?.title === 'Money' || currentTab?.title === 'Programme';

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
        onHelp={() => displayTutorial()}
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
      <Dialog
        fullScreen={false}
        visible={showInfo}
        position={DialogPosition.Full}
      >
        <StatementsInfoPage setShowInfo={setShowInfo} />
      </Dialog>
    </>
  );
};

export default Business;
