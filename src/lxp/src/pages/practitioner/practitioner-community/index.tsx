import { BannerWrapper, TabItem, TabList } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { PractitionerCommunityRouteState } from './index.types';
import { format } from 'date-fns';
import { useState } from 'react';
import ROUTES from '@/routes/routes';
import { ClubTab } from './club-tab';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';
import { useSelector } from 'react-redux';
import { getClubForPractitionerSelector } from '@/store/club/club.selectors';
import { AskToJoin } from './club-tab/0-components/ask-to-join';

export const PractitionerCommunity: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { state } = useLocation<PractitionerCommunityRouteState>();
  const date = format(new Date(), 'EEEE, d LLLL');

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 0
  );

  const club = useSelector(getClubForPractitionerSelector);
  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_CLUB_FOR_USER
  );

  const tabItems: TabItem[] = [
    {
      title: 'Club',
      initActive: true,
      child: isLoading || !!club ? <ClubTab /> : <AskToJoin />,
    },
    {
      title: 'League',
      initActive: false,
      child:
        isLoading || !!club ? (
          <div className="text-textDark p-4">Coming soon</div>
        ) : (
          <AskToJoin />
        ),
    },
    {
      title: 'Connect',
      initActive: false,
      child: <div className="text-textDark p-4">Coming soon</div>,
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
