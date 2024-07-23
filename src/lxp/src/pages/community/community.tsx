import { useMemo, useState } from 'react';

import { CommunityTabs } from './community-tabs/community-tabs';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { NewCommunityWelcome } from './community-welcome/community-welcome';

export const Community: React.FC = () => {
  const [joinCommunity, setJoinCommunity] = useState(false);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isFirstTimeInCommunity = practitioner?.clickedCommunityTab;

  const renderCommunityScreen = useMemo(() => {
    if (!isFirstTimeInCommunity || joinCommunity) {
      return <NewCommunityWelcome setJoinCommunity={setJoinCommunity} />;
    } else return <CommunityTabs setJoinCommunity={setJoinCommunity} />;
  }, [joinCommunity, isFirstTimeInCommunity]);

  return <div>{renderCommunityScreen}</div>;
};
