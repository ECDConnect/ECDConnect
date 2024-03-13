import { BannerWrapper, TabItem, TabList } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { Connect } from './connect-tab/connect';
import { useEffect, useState } from 'react';
import { CommunityRouteState } from './community.types';
import format from 'date-fns/format';
import ROUTES from '@/routes/routes';
import { TeamTab } from './team-tab';
import { LeagueTab } from './league-tab';
import { BreastfeedingClubsTab } from './breastfeeding-clubs-tab';
import { WalkthroughInfoPage } from '@/components/walkthrough/info-page';
import { useWalkthrough } from '@/context/walkthroughContext';
import Joyride from 'react-joyride';
import { Tooltip } from '@/components/walkthrough/tooltip';
import { getJoyrideStyles } from '@/components/walkthrough/styles';
import {
  COMMUNITY_WALKTHROUGH_STEPS,
  communityWalkthroughSteps,
} from './walkthrough/steps';
import { getStringFromClassNameOrId, usePrevious } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import { communitySelectors } from '@/store/community';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { CommunityActions } from '@/store/community/community.actions';
import { CommunityWalkthrough } from './walkthrough';

export const COMMUNITY_TABS = {
  TEAM: 0,
  LEAGUE: 1,
  BREASTFEEDING_CLUBS: 2,
  CONNECT: 3,
};

export const Community: React.FC = () => {
  const [isHelpPageOpen, setIsHelpPageOpen] = useState<boolean>(false);

  const {
    handleCallback,
    walkthroughDispatch,
    walkthroughState,
    setIsWalkthroughSession,
    isWalkthroughSession,
  } = useWalkthrough();

  const wasWalkthroughSession = usePrevious(isWalkthroughSession);

  const isFinalWalkthroughStep =
    walkthroughState?.stepIndex === COMMUNITY_WALKTHROUGH_STEPS.NINE;

  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { state } = useLocation<CommunityRouteState>();
  const date = format(new Date(), 'EEEE, d LLLL');

  const previousTabIndex = state?.activeTabIndex;

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 0
  );

  const clinic = useSelector(communitySelectors.getClinicSelector);

  const { isLoading: isLoadingClinic } = useThunkFetchCall(
    'community',
    CommunityActions.GET_CLINIC_BY_ID
  );

  const tabItems: TabItem[] = [
    {
      title: 'Team',
      initActive: true,
      child: <TeamTab forceReload={!wasWalkthroughSession} />,
    },
    {
      title: 'League',
      initActive: false,
      child: <LeagueTab />,
    },
    {
      id: getStringFromClassNameOrId(
        communityWalkthroughSteps[COMMUNITY_WALKTHROUGH_STEPS.SEVEN].target
      ),
      title: 'Breastfeeding clubs',
      initActive: false,
      child: <BreastfeedingClubsTab />,
    },
    {
      title: 'Connect',
      initActive: false,
      child: <Connect />,
    },
  ];

  const setTabSelected = (tab: TabItem, tabIndex: number) => {
    setSelectedTabIndex(tabIndex);
  };

  const onBackHelpPage = () => {
    setIsHelpPageOpen(false);
  };

  const onHelp = () => {
    onBackHelpPage();
    setIsWalkthroughSession('true');
    walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: true });
    setTimeout(
      () => walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: true }),
      200
    );
  };

  // handle tab change
  useEffect(() => {
    if (
      typeof state?.activeTabIndex === 'number' &&
      previousTabIndex !== selectedTabIndex
    ) {
      setSelectedTabIndex(state?.activeTabIndex || COMMUNITY_TABS.TEAM);
      history.replace(ROUTES.COMMUNITY.ROOT, {
        activeTabIndex: undefined,
      });
    }
  }, [history, previousTabIndex, selectedTabIndex, state?.activeTabIndex]);

  if (isHelpPageOpen) {
    return (
      <BannerWrapper
        showBackground={false}
        size="small"
        displayOffline={!isOnline}
        renderBorder
        title="Community"
        onBack={onBackHelpPage}
      >
        <WalkthroughInfoPage
          disableContentFromPortal
          sectionName="Team"
          onClose={onBackHelpPage}
          onHelp={onHelp}
        />
      </BannerWrapper>
    );
  }

  return (
    <div className="overflow-auto">
      <Joyride
        steps={communityWalkthroughSteps.map((item) => ({
          ...item,
          content: item.content,
        }))}
        run={walkthroughState?.isTourActive}
        stepIndex={walkthroughState?.stepIndex}
        callback={handleCallback}
        continuous={true}
        tooltipComponent={({ ...props }) => (
          <Tooltip
            {...props}
            pollyNeutralSteps={[...Array(8).keys()]}
            pollyImpressedSteps={[COMMUNITY_WALKTHROUGH_STEPS.NINE]}
            displayCloseButton={props.index < props.size - 1}
          />
        )}
        styles={getJoyrideStyles(
          isFinalWalkthroughStep,
          isFinalWalkthroughStep
        )}
      />
      {walkthroughState?.isTourActive && (
        <CommunityWalkthrough
          walkthroughStepIndex={walkthroughState?.stepIndex}
        />
      )}
      {(!walkthroughState?.isTourActive ||
        [
          COMMUNITY_WALKTHROUGH_STEPS.SEVEN,
          COMMUNITY_WALKTHROUGH_STEPS.NINE,
        ].includes(walkthroughState?.stepIndex)) && (
        <BannerWrapper
          showBackground={false}
          size="medium"
          renderBorder
          title="Community"
          subTitle={date}
          color={'primary'}
          onBack={() => history.push(ROUTES.ROOT)}
          displayHelp={
            selectedTabIndex === COMMUNITY_TABS.TEAM &&
            !!clinic &&
            !isLoadingClinic
          }
          onHelp={() => setIsHelpPageOpen(true)}
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
      )}
      <div
        id={getStringFromClassNameOrId(
          communityWalkthroughSteps[COMMUNITY_WALKTHROUGH_STEPS.NINE].target
        )}
        className="absolute bottom-0 w-full"
      />
    </div>
  );
};
