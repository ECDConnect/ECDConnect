import { LocalStorageKeys, useDialog } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Card,
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
import { getStorageItem } from '@utils/common/local-storage.utils';
import { ClientDashboardRouteState } from './class-dashboard.types';
import { ClientList } from '../clients-tab/client-list';
import momImage from '@/assets/happyMom.svg';
import { VisitList } from '../visits-tab/visit-dashboard';
import { HighlightsTab } from '../highlights-tab/highlights-tab';

export const CLIENT_TABS = {
  CLIENT: 0,
  VISIT: 1,
  HIGHLIGHTS: 2,
};

export const ClassDashboard: React.FC = () => {
  const history = useHistory();

  const { state } = useLocation<ClientDashboardRouteState>();

  const date = format(new Date(), 'EEEE, d LLLL');

  const dialog = useDialog();

  const [attendanceTutorialComplete, setAttendanceTutorialComplete] =
    useState<boolean>(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 0
  );
  const [currentTab, setCurrentTab] = useState<TabItem>();

  const appDispatch = useAppDispatch();

  const { isOnline } = useOnlineStatus();

  const tabItems: TabItem[] = [
    {
      title: 'Clients',
      initActive: true,
      child: <ClientList />,
    },
    {
      title: 'Visits',
      initActive: false,
      child: <VisitList />,
    },
    {
      title: 'Highlights',
      initActive: false,
      child: <HighlightsTab />,
    },
  ];

  function backToDashboard() {
    history.push('/');
  }

  function setTabSelected(tab: TabItem, tabIndex: number) {
    if (tab.title === 'Attendance' && !attendanceTutorialComplete) {
      displayTutorial('Attendance');
    }

    setSelectedTabIndex(tabIndex);
  }

  // TODO: add walkthrough
  const showTutorial = () =>
    dialog({
      position: DialogPosition.Middle,
      color: 'bg-transparent',
      render(_, onClose) {
        return (
          <Card
            shadowSize={'lg'}
            borderRaduis={'3xl'}
            className="flex flex-col items-center justify-center px-4 py-6"
          >
            <div className="bg-tertiary flex h-28 w-28 justify-center overflow-hidden rounded-full">
              <img className={'mt-6'} src={momImage} alt="card" />
            </div>
            <Typography
              type="h3"
              weight="bold"
              className="mt-4"
              lineHeight="snug"
              text={'Hello!'}
            />
            <Typography
              type="body"
              color="textMid"
              className="mt-4 text-center"
              lineHeight="snug"
              text={'Walkthrough is coming soon'}
            />
            <div className={'mt-4 flex w-full justify-center'}>
              <Button
                text={`Ok`}
                icon={'CheckCircleIcon'}
                type={'filled'}
                color={'primary'}
                textColor={'white'}
                className={'max-h-10 w-full'}
                iconPosition={'start'}
                onClick={onClose}
              />
            </div>
          </Card>
        );
      },
    });

  function displayTutorial(type?: string) {
    // TODO: add walkthrough
    switch (type) {
      default:
        showTutorial();
        break;
    }
  }

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
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Client Folders'}
      subTitle={date}
      color={'primary'}
      onBack={() => backToDashboard()}
      displayHelp
      onHelp={() => displayTutorial(currentTab?.title)}
      displayOffline={!isOnline}
    >
      <TabList
        className="bg-uiBg"
        tabItems={tabItems}
        setSelectedIndex={selectedTabIndex}
        tabSelected={(tab: TabItem, tabIndex: number) =>
          setTabSelected(tab, tabIndex)
        }
      />
    </BannerWrapper>
  );
};

export default ClassDashboard;
