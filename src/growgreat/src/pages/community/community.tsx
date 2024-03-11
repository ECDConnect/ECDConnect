import { BannerWrapper, TabItem, TabList } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { Connect } from './connect-tab/connect';
import { useEffect, useState } from 'react';
import { COMMUNITY_TABS, CommunityRouteState } from './community.types';
import format from 'date-fns/format';
import ROUTES from '@/routes/routes';
import { TeamTab } from './team-tab';
import { LeagueTab } from './league-tab';
import { BreastfeedingClubsTab } from './breastfeeding-clubs-tab';

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
      title: COMMUNITY_TABS.TEAM.TITLE,
      initActive: true,
      child: <TeamTab />,
    },
    {
      title: COMMUNITY_TABS.LEAGUE.TITLE,
      initActive: false,
      child: <LeagueTab />,
    },
    {
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

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder
      title="Community"
      subTitle={date}
      color={'primary'}
      onBack={() => history.push(ROUTES.ROOT)}
      displayHelp={selectedTabIndex === COMMUNITY_TABS.TEAM.INDEX}
      onHelp={() => {}}
      displayOffline={!isOnline}
    >
      <TabList
        className="bg-uiBg"
        tabClassName="min-w-0 mr-8"
        tabItems={tabItems}
        setSelectedIndex={selectedTabIndex}
        tabSelected={(tab: TabItem, tabIndex: number) =>
          setTabSelected(tab, tabIndex)
        }
      />
    </BannerWrapper>
  );
};
