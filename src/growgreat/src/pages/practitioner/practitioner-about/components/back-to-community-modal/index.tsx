import ROUTES from '@/routes/routes';
import { ActionModal } from '@ecdlink/ui';
import React, { ReactElement } from 'react';
import { useHistory } from 'react-router';
import { PractitionerAboutRouteState } from '../../practitioner-about.types';

interface BackToCommunityDialogProps {
  avatar?: ReactElement;
  hideTitle?: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export const BackToCommunityDialog: React.FC<BackToCommunityDialogProps> = ({
  avatar,
  hideTitle,
  onClose,
}) => {
  const history = useHistory();

  return (
    <ActionModal
      className="bg-white"
      customIcon={avatar}
      title={hideTitle ? '' : 'Looking good!'}
      detailText="Do you want to go back to your team page?"
      actionButtons={[
        {
          colour: 'primary',
          text: 'Go back to Community',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'ArrowCircleLeftIcon',
          onClick: () => {
            history.push(ROUTES.COMMUNITY.ROOT, {
              isFromCommunityWelcome: false,
            } as PractitionerAboutRouteState);
            onClose();
          },
        },
        {
          colour: 'primary',
          text: 'Close',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'XIcon',
          onClick: onClose,
        },
      ]}
    />
  );
};
