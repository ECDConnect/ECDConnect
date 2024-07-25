import {
  ActionModal,
  Button,
  DialogPosition,
  EmptyPage,
  Typography,
} from '@ecdlink/ui';
import AlienImage from '@/assets/ECD_Connect_alien2.svg';
import { useTenant } from '@/hooks/useTenant';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { communitySelectors } from '@/store/community';
import { CommunityDashboard } from '../community-dashboard/community-dashboard';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { useDialog } from '@ecdlink/core';
import { practitionerSelectors } from '@/store/practitioner';

export const CommunityItem = ({
  setJoinCommunity,
  notJoining,
}: {
  setJoinCommunity: (item: boolean) => void;
  notJoining?: boolean;
}) => {
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const dialog = useDialog();
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isFirstTimeInCommunity = !practitioner?.clickedCommunityTab;

  const handleDialog = () => {
    dialog({
      position: DialogPosition.Bottom,
      render: (onSubmit, onCancel) => {
        return (
          <ActionModal
            textAlignment="center"
            customDetailText={
              <Typography
                type="h4"
                className="mb-7 mt-4"
                text={`Ok, you can tap this button when you are ready to join!`}
                color="black"
                align="center"
              />
            }
            actionButtons={[
              {
                text: 'Close',
                textColour: 'white',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => onSubmit(),
                leadingIcon: 'XIcon',
              },
            ]}
            customIcon={
              <div className="mb-2 flex w-full justify-center">
                <Cebisa />
              </div>
            }
          />
        );
      },
    });
  };

  useEffect(() => {
    if (notJoining || isFirstTimeInCommunity) {
      handleDialog();
    }
  }, [notJoining, isFirstTimeInCommunity]);

  const renderCommunityItemScreen = useMemo(() => {
    if (!communityProfile) {
      return (
        <div>
          <EmptyPage
            image={AlienImage}
            title={`You haven't joined the ${appName} community yet!`}
            className="p-4"
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
  }, [appName, communityProfile, setJoinCommunity]);
  return <div>{renderCommunityItemScreen}</div>;
};
