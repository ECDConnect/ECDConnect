import { Button, EmptyPage } from '@ecdlink/ui';
import AlienImage from '@/assets/ECD_Connect_alien2.svg';
import { useTenant } from '@/hooks/useTenant';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { communitySelectors } from '@/store/community';
import { CommunityDashboard } from '../community-dashboard/community-dashboard';
import { useDialog } from '@ecdlink/core';
import { practitionerSelectors } from '@/store/practitioner';
import CommunityWrapper from './community-wrapper/CommunityWrapper';
import { useAppContext } from '@/walkthrougContext';

export const CommunityItem = ({
  setJoinCommunity,
  notJoining,
}: {
  setJoinCommunity: (item: boolean) => void;
  notJoining?: boolean;
}) => {
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isFirstTimeInCommunity = !practitioner?.clickedCommunityTab;
  const { setState } = useAppContext();
  const screenHeight = window.innerHeight;

  useEffect(() => {
    if (notJoining || isFirstTimeInCommunity) {
      setState({ run: true, tourActive: true, stepIndex: 0 });
    }
  }, [notJoining, isFirstTimeInCommunity, setState]);

  const renderCommunityItemScreen = useMemo(() => {
    if (!communityProfile) {
      return (
        <div>
          <CommunityWrapper />
          <EmptyPage
            image={AlienImage}
            title={`You haven't joined the ${appName} community yet!`}
            className="p-4"
            isSmallScreen={screenHeight < 650 ? true : false}
          />
          <div className="flex w-full justify-center" id="firstTimeECDHeroes">
            <Button
              className="z-70 w-11/12 rounded-xl px-2"
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
  }, [appName, communityProfile, screenHeight, setJoinCommunity]);
  return <div>{renderCommunityItemScreen}</div>;
};
