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

export const COMMUNITY_TABS = {
  TEAM: 0,
  LEAGUE: 1,
  BREASTFEEDING_CLUBS: 2,
  CONNECT: 3,
};

export const Community: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { state } = useLocation<CommunityRouteState>();
  const date = format(new Date(), 'EEEE, d LLLL');

  const previousTabIndex = state?.activeTabIndex;

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 0
  );

  const tabItems: TabItem[] = [
    {
      title: 'Team',
      initActive: true,
      child: <TeamTab />,
    },
    {
      title: 'League',
      initActive: false,
      child: <LeagueTab />,
    },
    {
      title: 'Breastfeeding clubs',
      initActive: false,
      child: 'Coming Soon!',
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

  // handle tab change
  useEffect(() => {
    if (state?.activeTabIndex && previousTabIndex !== selectedTabIndex) {
      setSelectedTabIndex(state?.activeTabIndex || COMMUNITY_TABS.TEAM);
      history.replace(ROUTES.COMMUNITY.ROOT, {
        activeTabIndex: undefined,
      });
    }
  }, [history, previousTabIndex, selectedTabIndex, state?.activeTabIndex]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder
      title="Community"
      subTitle={date}
      color={'primary'}
      onBack={() => history.push(ROUTES.ROOT)}
      displayHelp={selectedTabIndex === COMMUNITY_TABS.TEAM}
      onHelp={() => {}}
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
