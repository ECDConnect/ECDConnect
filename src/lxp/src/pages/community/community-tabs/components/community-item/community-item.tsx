import { Button, EmptyPage } from '@ecdlink/ui';
import AlienImage from '@/assets/ECD_Connect_alien2.svg';
import { useTenant } from '@/hooks/useTenant';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { communitySelectors } from '@/store/community';
import { CommunityDashboard } from '../community-dashboard/community-dashboard';

export const CommunityItem = ({
  setJoinCommunity,
}: {
  setJoinCommunity: (item: boolean) => void;
}) => {
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);

  const renderCommunityItemScreen = useMemo(() => {
    if (!communityProfile) {
      return (
        <div>
          <EmptyPage
            image={AlienImage}
            title={`You haven't joined the ${appName} community yet!`}
          />
          <div className="flex w-full justify-center">
            <Button
              className="w-11/12 rounded-xl px-2"
              type="filled"
              color="quatenary"
              textColor="white"
              text="Join the community!"
              icon="UserGroupIcon"
              iconPosition="start"
              onClick={() => setJoinCommunity(true)}
            />
          </div>
        </div>
      );
    } else {
      return <CommunityDashboard />;
    }
  }, [communityProfile]);
  return <div>{renderCommunityItemScreen}</div>;
};
