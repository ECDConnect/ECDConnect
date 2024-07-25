import { useMemo, useState } from 'react';

import { CommunityTabs } from './community-tabs/community-tabs';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { NewCommunityWelcome } from './community-welcome/community-welcome';

export const Community: React.FC = () => {
  const [joinCommunity, setJoinCommunity] = useState(false);
  const [notJoining, seNotJoining] = useState(false);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isFirstTimeInCommunity = practitioner?.clickedCommunityTab;

  const renderCommunityScreen = useMemo(() => {
    if (!isFirstTimeInCommunity || joinCommunity) {
      return (
        <NewCommunityWelcome
          setJoinCommunity={setJoinCommunity}
          seNotJoining={seNotJoining}
        />
      );
    } else {
      return (
        <CommunityTabs
          setJoinCommunity={setJoinCommunity}
          notJoining={notJoining}
          seNotJoining={seNotJoining}
        />
      );
    }
  }, [joinCommunity, isFirstTimeInCommunity]);

  return <div>{renderCommunityScreen}</div>;
};
