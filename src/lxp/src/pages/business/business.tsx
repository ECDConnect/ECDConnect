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
import { ClassDashboardRouteState } from './business.types';
import { Money } from './money/money';
import { Walkthrough } from './components/statements-walkthrough';
import { useAppContext } from '@/walkthrougContext';
import { InfoPage } from './money/submit-income-statements/components/info-page';
import { NavigationNames } from '../navigation';
import PractitionersList from '../classroom/class-dashboard/practitioners/practitioners-list/practitioners-list';
import { MoreInformationTypeEnum } from '@ecdlink/core';
import { ComingSoon } from './components/coming-soon/coming-soon';
import { Resources } from './components/resources/resources';

export const Business: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation<ClassDashboardRouteState>();
  const date = format(new Date(), 'EEEE, d LLLL');
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 0
  );
  const appDispatch = useAppDispatch();
  const [currentTab, setCurrentTab] = useState<TabItem>();
  const { isOnline } = useOnlineStatus();

  const backToDashboard = () => {
    history.push('/');
  };

  const [showInfo, setShowInfo] = useState(false);

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
      title: NavigationNames.Business.Staff,
      initActive: false,
      child: <PractitionersList />,
    },
    {
      title: NavigationNames.Business.Money,
      initActive: true,
      child: <Money />,
    },
    {
      title: NavigationNames.Business.Resources,
      initActive: false,
      child: (
        <div className={'p-4'}>
          <Resources />
        </div>
      ),
    },
  ];

  const setTabSelected = (tabIndex: number) => {
    setSelectedTabIndex(tabIndex);
  };

  const displayHelp =
    currentTab?.title === 'Money' || currentTab?.title === 'Programme';

  const { setState } = useAppContext();

  return (
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={'Business'}
        subTitle={date}
        color={'primary'}
        onBack={() => {
          backToDashboard();
          setState({ run: false });
        }}
        displayHelp={displayHelp}
        onHelp={() => setShowInfo(true)}
        displayOffline={!isOnline}
      >
        <TabList
          className="bg-uiBg"
          tabItems={tabItemsForPrincipal}
          setSelectedIndex={selectedTabIndex}
          tabSelected={(_, tabIndex: number) => setTabSelected(tabIndex)}
        />
      </BannerWrapper>
      <Dialog fullScreen visible={showInfo} position={DialogPosition.Full}>
        <InfoPage
          title="Income statements"
          section={MoreInformationTypeEnum.IncomeStatements}
          onClose={() => setShowInfo(false)}
        >
          <Walkthrough onBack={() => setShowInfo(false)} />
        </InfoPage>
      </Dialog>
    </>
  );
};

export default Business;
