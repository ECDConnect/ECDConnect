import { BannerWrapper, DialogPosition, TabItem, TabList } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { Connect } from './connect-tab/connect';
import { useCallback, useEffect, useState } from 'react';
import {
  COMMUNITY_SESSION_STORAGE_KEY,
  COMMUNITY_TABS,
  CommunityRouteState,
} from './community.types';
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
import {
  getStringFromClassNameOrId,
  useDialog,
  usePrevious,
  useSessionStorage,
} from '@ecdlink/core';
import { useSelector } from 'react-redux';
import { communitySelectors } from '@/store/community';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { CommunityActions } from '@/store/community/community.actions';
import { CommunityWalkthrough } from './walkthrough';
import { useTranslation } from 'react-i18next';
import { WalkthroughModal } from '@/components/walkthrough/modal';
import { LanguageCode } from '@/i18n/types';

export const Community: React.FC = () => {
  const [isFromCommunityWelcome, setIsFromCommunityWelcome] = useSessionStorage(
    COMMUNITY_SESSION_STORAGE_KEY
  );

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

  const dialog = useDialog();

  const { t } = useTranslation();

  const previousTabIndex = state?.activeTabIndex;

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 0
  );

  const walkthroughAvailableLanguages: LanguageCode[] = ['en-za', 'nso']!;

  const clinic = useSelector(communitySelectors.getClinicSelector);

  const { isLoading: isLoadingClinic, wasLoading: wasLoadingClinic } =
    useThunkFetchCall('community', CommunityActions.GET_CLINIC_BY_ID);

  const tabItems: TabItem[] = [
    {
      title: COMMUNITY_TABS.TEAM.TITLE,
      initActive: true,
      child: <TeamTab forceReload={!wasWalkthroughSession} />,
    },
    {
      title: COMMUNITY_TABS.LEAGUE.TITLE,
      initActive: false,
      child: <LeagueTab />,
    },
    {
      id: getStringFromClassNameOrId(
        communityWalkthroughSteps[COMMUNITY_WALKTHROUGH_STEPS.SEVEN].target
      ),
      title: COMMUNITY_TABS.BREASTFEEDING_CLUBS.TITLE,
      initActive: false,
      child: <BreastfeedingClubsTab />,
    },
    {
      title: COMMUNITY_TABS.CONNECT.TITLE,
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

  const onHelp = useCallback(() => {
    onBackHelpPage();
    setIsWalkthroughSession('true');
    walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: true });
    setTimeout(
      () => walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: true }),
      200
    );
  }, [setIsWalkthroughSession, walkthroughDispatch]);

  const handleFirstTimeWalkthrough = useCallback(() => {
    if (
      wasLoadingClinic &&
      !isLoadingClinic &&
      isFromCommunityWelcome === 'true'
    ) {
      setIsFromCommunityWelcome('false');
      dialog({
        position: DialogPosition.Middle,
        blocking: true,
        color: 'bg-white',
        render: (onClose) => (
          <WalkthroughModal
            availableLanguages={walkthroughAvailableLanguages}
            onStart={() => {
              onClose();
              onHelp();
            }}
            onClose={onClose}
          />
        ),
      });
    }
  }, [
    dialog,
    isFromCommunityWelcome,
    isLoadingClinic,
    onHelp,
    setIsFromCommunityWelcome,
    walkthroughAvailableLanguages,
    wasLoadingClinic,
  ]);

  // handle tab change
  useEffect(() => {
    if (
      typeof state?.activeTabIndex === 'number' &&
      previousTabIndex !== selectedTabIndex
    ) {
      setSelectedTabIndex(state?.activeTabIndex || COMMUNITY_TABS.TEAM.INDEX);
      history.replace(ROUTES.COMMUNITY.ROOT, {
        activeTabIndex: undefined,
      });
    }
  }, [history, previousTabIndex, selectedTabIndex, state?.activeTabIndex]);

  useEffect(() => {
    handleFirstTimeWalkthrough();
  }, [handleFirstTimeWalkthrough]);

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
          // TODO: Add more translations
          availableLanguages={['en-za', 'nso']}
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
          content: t(item.content as string),
        }))}
        run={walkthroughState?.isTourActive}
        stepIndex={walkthroughState?.stepIndex}
        callback={handleCallback}
        continuous={true}
        tooltipComponent={({ ...props }) => (
          <Tooltip
            {...props}
            className={
              walkthroughState?.stepIndex === COMMUNITY_WALKTHROUGH_STEPS.SEVEN
                ? 'mt-20'
                : ''
            }
            pollyNeutralSteps={[...Array(8).keys()]}
            pollyImpressedSteps={[COMMUNITY_WALKTHROUGH_STEPS.NINE]}
            displayCloseButton={props.index < props.size - 1}
          />
        )}
        styles={getJoyrideStyles(
          isFinalWalkthroughStep,
          walkthroughState?.stepIndex === COMMUNITY_WALKTHROUGH_STEPS.SEVEN ||
            isFinalWalkthroughStep
        )}
      />
      {walkthroughState?.isTourActive && (
        <CommunityWalkthrough
          walkthroughStepIndex={walkthroughState?.stepIndex}
        />
      )}
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder
        title="Community"
        subTitle={date}
        color={'primary'}
        onBack={() => history.push(ROUTES.ROOT)}
        displayHelp={
          selectedTabIndex === COMMUNITY_TABS.TEAM.INDEX &&
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
      <div
        id={getStringFromClassNameOrId(
          communityWalkthroughSteps[COMMUNITY_WALKTHROUGH_STEPS.NINE].target
        )}
        className="absolute bottom-0 w-full"
      />
    </div>
  );
};
