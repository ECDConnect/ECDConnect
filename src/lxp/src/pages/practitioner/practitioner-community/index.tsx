import {
  BannerWrapper,
  EmptyPage,
  LoadingSpinner,
  TabItem,
  TabList,
} from '@ecdlink/ui';
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
import { PractitionerLeagueView } from './league-tab';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { useWindowSize } from '@reach/window-size';
import { practitionerSelectors } from '@/store/practitioner';

export const PractitionerCommunity: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { state } = useLocation<PractitionerCommunityRouteState>();
  const date = format(new Date(), 'EEEE, d LLLL');

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 0
  );

  const { height } = useWindowSize();
  const header_height = 121;

  const club = useSelector(getClubForPractitionerSelector);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_CLUB_FOR_USER
  );

  const tabItems: TabItem[] = [
    {
      title: 'Club',
      initActive: true,
      child: !practitioner?.clubId ? <AskToJoin /> : <ClubTab />,
    },
    {
      title: 'League',
      initActive: false,
      child: !practitioner?.clubId ? (
        <AskToJoin />
      ) : isLoading ? (
        <LoadingSpinner
          className="mt-4"
          size="medium"
          spinnerColor="primary"
          backgroundColor="uiLight"
        />
      ) : !!club?.league ? (
        <PractitionerLeagueView />
      ) : (
        <EmptyPage
          className="mx-4"
          image={AlienImage}
          title="Your club is not in a league"
          subTitle="Clubs are added to leagues from 1 April every year."
        />
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
      <div style={{ height: height - header_height }}>
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
