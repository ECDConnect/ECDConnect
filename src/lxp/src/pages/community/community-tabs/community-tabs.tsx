import { BannerWrapper, TabItem, TabList } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';
import ROUTES from '@/routes/routes';
import { CommunityItem } from './components/community-item/community-item';
import { CommunityLinks } from './components/community-links/community-links';
import { CommunityRouteState } from '../community.types';
import { useAppDispatch } from '@/store';
import { communityThunkActions } from '@/store/community';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';

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
  const { state } = useLocation<CommunityRouteState>();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const appDispatch = useAppDispatch();

  // only fetch once
  useEffect(() => {
    appDispatch(communityThunkActions.getCommunityProfile({})).unwrap();
  }, []);

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

  const goBack = () => {
    if (state?.isFromAboutPage) {
      history.push(ROUTES.PRACTITIONER.ABOUT.ROOT);
      return;
    }

    history.push(ROUTES.DASHBOARD);
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Community'}
      subTitle={date}
      color={'primary'}
      onBack={() => goBack()}
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
