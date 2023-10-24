import {
  BannerWrapper,
  TabItem,
  TabList,
  Typography,
  DialogPosition,
  Dialog,
} from '@ecdlink/ui';
import format from 'date-fns/format';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import { ClassDashboardRouteState } from './business.types';
import { Money } from './money/money';
import { StatementsInfoPage } from './components/statements-info-page';
import { useAppContext } from '@/walkthrougContext';
import { useSelector } from 'react-redux';
import { getPractitioner } from '@/store/practitioner/practitioner.selectors';
import { practitionerThunkActions } from '@/store/practitioner';

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
  const [isFromAutomaticallyStart, setIsFromAutomaticallyStart] =
    useState(false);

  const backToDashboard = () => {
    history.push('/');
  };

  const practitioner = useSelector(getPractitioner);
  const [showInfo, setShowInfo] = useState(
    !practitioner?.isCompletedBusinessWalkThrough || false
  );

  const updateWalkThroughStatus = useCallback(
    (status: boolean) => {
      if (status && !practitioner?.isCompletedBusinessWalkThrough) {
        appDispatch(
          practitionerThunkActions.updatePractitionerBusinessWalkThrough({
            userId: practitioner?.userId!,
          })
        );
      }
    },
    [appDispatch, practitioner?.userId]
  );

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

  const setTabSelected = (tabIndex: number) => {
    setSelectedTabIndex(tabIndex);
  };

  const displayTutorial = (type?: string) => {
    setShowInfo(true);
  };

  const displayHelp =
    currentTab?.title === 'Money' || currentTab?.title === 'Programme';

  const { setState } = useAppContext();

  return (
    <div className="h-screen">
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
        onHelp={() => displayTutorial()}
        displayOffline={!isOnline}
      >
        <TabList
          className="bg-uiBg"
          tabItems={tabItemsForPrincipal}
          setSelectedIndex={selectedTabIndex}
          tabSelected={(_, tabIndex: number) => setTabSelected(tabIndex)}
        />
      </BannerWrapper>
      <Dialog
        fullScreen={true}
        visible={showInfo}
        position={DialogPosition.Full}
      >
        <StatementsInfoPage
          setShowInfo={setShowInfo}
          isFromAutomaticallyStart={isFromAutomaticallyStart}
          setIsFromAutomaticallyStart={setIsFromAutomaticallyStart}
          updateWalkThroughStatus={updateWalkThroughStatus}
        />
      </Dialog>
    </div>
  );
};

export default Business;
