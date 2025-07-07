import { BannerWrapper, TabItem, TabList } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useState } from 'react';
import format from 'date-fns/format';
import ROUTES from '@/routes/routes';
import { CommunityItem } from './components/community-item/community-item';
import { CommunityLinks } from './components/community-links/community-links';

export const COMMUNITY_TABS = {
  CONNECT: 0,
};

export const CommunityTabs = ({
  setJoinCommunity,
  notJoining,
}: {
  setJoinCommunity: (item: boolean) => void;
  seNotJoining: (item: boolean) => void;
  notJoining: boolean;
}) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const date = format(new Date(), 'dd LLLL y');

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

  const tabItems: TabItem[] = [
    {
      title: 'Community',
      initActive: true,
      child: (
        <CommunityItem
          setJoinCommunity={setJoinCommunity}
          notJoining={notJoining}
        />
      ),
    },
    {
      title: 'Resources',
      initActive: false,
      child: <CommunityLinks />,
    },
  ];

  function setTabSelected(tab: TabItem, tabIndex: number) {
    setSelectedTabIndex(tabIndex);
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
