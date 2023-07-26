import {
  LocalStorageKeys,
  getStringFromClassNameOrId,
  replaceBraces,
  useDialog,
  usePrevious,
} from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  DialogPosition,
  TabItem,
  TabList,
} from '@ecdlink/ui';
import format from 'date-fns/format';
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import { getStorageItem } from '@utils/common/local-storage.utils';
import { ClientDashboardRouteState } from './class-dashboard.types';
import { ClientList } from '../clients-tab/client-list';
import { VisitList } from '../visits-tab/visit-dashboard';
import { HighlightsTab } from '../highlights-tab/highlights-tab';
import { useWalkthrough } from '@/context/walkthroughContext';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactComponent as AwardIcon } from '@/assets/awardIcon.svg';
import { useSelector } from 'react-redux';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import { HealthCareWorkerModelInput } from '@ecdlink/graphql';
import { updateHealthCareWorkerTabs } from '@/store/healthCareWorker/healthCareWorker.actions';
import { SuccessCard } from '@/components/success-card/success-card';
import Joyride, { Step } from 'react-joyride';
import {
  WalkthroughInfoPage,
  WalkthroughInfoPageProps,
} from '@/components/walkthrough/info-page';
import ROUTES from '@/routes/routes';
import { Tooltip } from '@/components/walkthrough/tooltip';
import { getJoyrideStyles } from '@/components/walkthrough/styles';
import { clientSteps } from '../clients-tab/walkthrough/steps';
import { getInfants } from '@/store/infant/infant.selectors';
import { getMothers } from '@/store/mother/mother.selectors';
import { multipleClientsSteps } from '../clients-tab/walkthrough/steps_multiple_clients';

export const CLIENT_TABS = {
  CLIENT: 0,
  VISIT: 1,
  HIGHLIGHTS: 2,
};

export const ClassDashboard: React.FC = () => {
  const [isInfoPage, setIsInfoPage] = useState(false);
  const {
    handleCallback,
    walkthroughDispatch,
    walkthroughState,
    walkthroughStepIndex,
    isWalkthroughSession,
    setIsWalkthroughSession,
  } = useWalkthrough();

  const appDispatch = useAppDispatch();
  const { state } = useLocation<ClientDashboardRouteState>();
  const previousActiveTab = usePrevious(state?.activeTabIndex);
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const history = useHistory();
  const location = useLocation();

  const date = format(new Date(), 'EEEE, d LLLL');

  const infants = useSelector(getInfants);
  const mothers = useSelector(getMothers);

  const totalClients = infants.length + mothers.length;

  const healthCareWorker = useSelector(
    healthCareWorkerSelectors?.getHealthCareWorker
  );

  const [attendanceTutorialComplete, setAttendanceTutorialComplete] =
    useState<boolean>(false);

  const tabItems: TabItem[] = [
    {
      title: 'Clients',
      initActive: true,
      index: CLIENT_TABS.CLIENT,
      child: <ClientList />,
    },
    {
      title: 'Visits',
      initActive: false,
      index: CLIENT_TABS.VISIT,
      child: <VisitList />,
    },
    {
      title: 'Highlights',
      initActive: false,
      index: CLIENT_TABS.HIGHLIGHTS,
      child: <HighlightsTab />,
    },
  ];

  const {
    steps,
    infoPageSection,
    hideJoyRideBorders,
    infoPageTitle,
    displayExtraComponent,
  } = useMemo((): {
    steps: Step[];
    infoPageTitle: string;
    infoPageSection: WalkthroughInfoPageProps['sectionName'];
    hideJoyRideBorders?: boolean;
    displayExtraComponent?: boolean;
  } => {
    switch (state?.activeTabIndex ?? 0) {
      // case CLIENT_TABS.VISIT:
      //   return {
      //     steps: visitSteps,
      //     infoPageTitle: 'Visits',
      //     infoPageSection: 'visits tab',
      //     hideJoyRideBorders: walkthroughStepIndex === 2,
      //   };
      // case CLIENT_TABS.HIGHLIGHTS:
      //   return {
      //     steps: highlightSteps,
      //     infoPageTitle: 'Highlights',
      //     infoPageSection: 'highlights tab',
      //     hideJoyRideBorders: walkthroughStepIndex === 2,
      //   };
      default:
        var _clientSteps = clientSteps;
        var _walkthroughStepIndex = 2;
        if (totalClients > 3) {
          _clientSteps = multipleClientsSteps;
          _walkthroughStepIndex = 5;
        }

        return {
          steps: _clientSteps,
          infoPageTitle: 'Clients',
          infoPageSection: 'clients tab',
          hideJoyRideBorders: walkthroughStepIndex === _walkthroughStepIndex,
          displayExtraComponent: true,
        };
    }
  }, [state?.activeTabIndex, walkthroughStepIndex]);

  const onHelp = useCallback(() => {
    setIsInfoPage(false);
    setIsWalkthroughSession('true');
    walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: true });
    setTimeout(
      () => walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: true }),
      200
    );
  }, [setIsWalkthroughSession, walkthroughDispatch]);

  const backToDashboard = useCallback(() => {
    if (isInfoPage) {
      return setIsInfoPage(false);
    }

    return history.push('/');
  }, [history, isInfoPage]);

  const updateClickedTab = useCallback(() => {
    var input: HealthCareWorkerModelInput = {
      clickedDashboardClientsTab: healthCareWorker?.clickedDashboardClientsTab,
      clickedDashboardHighlightsTab:
        healthCareWorker?.clickedDashboardHighlightsTab,
      clickedDashboardVisitsTab: healthCareWorker?.clickedDashboardVisitsTab,
      clickedVisitTab: healthCareWorker?.clickedVisitTab,
      clickedProgressTab: healthCareWorker?.clickedProgressTab,
      clickedReferralsTab: healthCareWorker?.clickedReferralsTab,
      clickedContactTab: healthCareWorker?.clickedContactTab,
      isRegistered: true,
    };

    switch (state?.activeTabIndex) {
      // case CLIENT_TABS.VISIT:
      //   input = {
      //     ...input,
      //     clickedDashboardVisitsTab: true,
      //   };
      //   break;
      // case CLIENT_TABS.HIGHLIGHTS:
      //   input = {
      //     ...input,
      //     clickedDashboardHighlightsTab: true,
      //   };
      //   break;
      default:
        input = {
          ...input,
          clickedDashboardClientsTab: true,
        };
        break;
    }
    appDispatch(
      updateHealthCareWorkerTabs({
        input: input,
        userId: healthCareWorker?.id!,
      })
    );
  }, [appDispatch, healthCareWorker, state?.activeTabIndex]);

  const handleWelcomeDialog = useCallback(() => {
    const currentTab = state?.activeTabIndex ?? 0;
    if (
      // (currentTab === CLIENT_TABS.VISIT &&
      //   !healthCareWorker?.clickedDashboardVisitsTab) ||
      currentTab === CLIENT_TABS.CLIENT &&
      !healthCareWorker?.clickedDashboardClientsTab
      // (currentTab === CLIENT_TABS.HIGHLIGHTS &&
      //   !healthCareWorker?.clickedDashboardHighlightsTab)
    ) {
      let tabName = '';

      switch (currentTab) {
        // case CLIENT_TABS.VISIT:
        //   tabName = 'visits';
        //   break;
        // case CLIENT_TABS.HIGHLIGHTS:
        //   tabName = 'highlights';
        //   break;
        default:
          tabName = 'clients';
          break;
      }

      return dialog({
        position: DialogPosition.Middle,
        color: 'bg-white',
        render(onClose) {
          return (
            <ActionModal
              customIcon={<PollyNeutral className="mb-3 h-24 w-24" />}
              title={` Welcome to the ${tabName} tab!`}
              detailText="Can I show you how this works?"
              actionButtons={[
                {
                  colour: 'primary',
                  text: 'Yes, help me!',
                  textColour: 'white',
                  type: 'filled',
                  leadingIcon: 'CheckCircleIcon',
                  onClick: () => {
                    updateClickedTab();
                    setIsWalkthroughSession('true');
                    onHelp();
                    onClose();
                  },
                },
                {
                  colour: 'primary',
                  text: 'No, skip',
                  textColour: 'primary',
                  type: 'outlined',
                  leadingIcon: 'ClockIcon',
                  onClick: () => {
                    updateClickedTab();
                    onClose();
                  },
                },
              ]}
            />
          );
        },
      });
    }
  }, [
    dialog,
    healthCareWorker,
    onHelp,
    setIsWalkthroughSession,
    state?.activeTabIndex,
    updateClickedTab,
  ]);

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

  // useEffect(() => {
  //   if (selectedTabIndex !== undefined && selectedTabIndex >= 0) {
  //     setCurrentTab(tabItems[selectedTabIndex]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedTabIndex]);

  const goBack = useCallback(() => {
    if (isInfoPage) {
      return setIsInfoPage(false);
    }

    return history.push(ROUTES.CLIENTS.ROOT);
  }, [history, isInfoPage]);

  useEffect(() => {
    if (previousActiveTab !== state?.activeTabIndex) {
      handleWelcomeDialog();
    }
  }, [handleWelcomeDialog, previousActiveTab, state?.activeTabIndex]);

  useLayoutEffect(() => {
    if (isWalkthroughSession) {
      window.sessionStorage.clear();
      return;
    }
  }, [appDispatch, isWalkthroughSession]);

  return (
    <>
      <Joyride
        steps={steps.map((item) => ({
          ...item,
          content: replaceBraces(
            String(item?.content),
            healthCareWorker?.user?.firstName || ''
          ),
        }))}
        run={walkthroughState?.isTourActive}
        stepIndex={walkthroughStepIndex}
        callback={handleCallback}
        continuous={true}
        tooltipComponent={({ ...props }) => (
          <Tooltip
            {...props}
            pollyInformationalSteps={[0, 2]}
            pollyNeutralSteps={[1]}
            pollyImpressedSteps={[3]}
            displayCloseButton={props.index < props.size - 1}
          />
        )}
        styles={getJoyrideStyles(hideJoyRideBorders)}
      />

      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        //title={'Client folders'}
        title={infoPageTitle}
        subTitle={date}
        color={'primary'}
        onBack={() => backToDashboard()}
        displayHelp={state?.activeTabIndex === 0 ? true : false}
        onHelp={() => setIsInfoPage(true)}
        displayOffline={!isOnline}
      >
        {isInfoPage ? (
          <WalkthroughInfoPage
            sectionName={infoPageSection}
            onHelp={onHelp}
            onClose={goBack}
            extraElement={
              displayExtraComponent ? (
                <SuccessCard
                  className="my-4"
                  customIcon={<AwardIcon className="h-14	w-14" />}
                  text={`Client folders in CHW Connect`}
                  subText={`Use this section to see all of your clients and to search for, filter, or sort your client folder list.`}
                  textColour="successDark"
                  color="successBg"
                />
              ) : (
                <></>
              )
            }
          />
        ) : (
          <TabList
            id="walkthrough-dashboard-client-step-1"
            className="bg-uiBg"
            tabItems={tabItems}
            setSelectedIndex={state?.activeTabIndex ?? 0}
            tabSelected={(tab) =>
              history.push(location.pathname, { activeTabIndex: tab.index })
            }
          />
        )}
        <div id="walkthrough-last-step" className="w-full"></div>
      </BannerWrapper>
    </>
  );
};

export default ClassDashboard;
