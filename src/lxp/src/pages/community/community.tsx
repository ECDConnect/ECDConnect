import { BannerWrapper, TabItem, TabList } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { Connect } from './connect-tab/connect';
import { useState } from 'react';
import { CommunityRouteState } from './community.types';
import format from 'date-fns/format';
import { CoachCircles } from './coach-circles/coach-circles';
import ROUTES from '@/routes/routes';
import { ClubsTab } from './clubs-tab';

export const COMMUNITY_TABS = {
  CONNECT: 0,
};

export const Community: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { state } = useLocation<CommunityRouteState>();
  const date = format(new Date(), 'EEEE, d LLLL');

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 0
  );
  const [currentTab] = useState<TabItem>();

  const tabItems: TabItem[] = [
    {
      title: 'Clubs',
      initActive: true,
      child: <ClubsTab />,
    },
    {
      title: 'Leagues',
      initActive: false,
      child: 'Coming Soon!',
    },
    {
      title: 'Circles',
      initActive: false,
      child: <CoachCircles />,
    },
    {
      title: 'Connect',
      initActive: true,
      child: <Connect />,
    },
  ];

  function setTabSelected(tab: TabItem, tabIndex: number) {
    setSelectedTabIndex(tabIndex);
  }

  function displayTutorial(type?: string) {
    // TODO: add walkthrough
    switch (type) {
      default:
        // showTutorial();
        break;
    }
  }

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Community'}
      subTitle={date}
      color={'primary'}
      onBack={() => history.push(ROUTES.DASHBOARD)}
      displayHelp
      onHelp={() => displayTutorial(currentTab?.title)}
      displayOffline={!isOnline}
    >
      <div className="h-screen">
        <TabList
          className="bg-uiBg"
          tabItems={tabItems}
          setSelectedIndex={selectedTabIndex}
          tabSelected={(tab: TabItem, tabIndex: number) =>
            setTabSelected(tab, tabIndex)
          }
        />
      </div>
    </BannerWrapper>
  );
};
