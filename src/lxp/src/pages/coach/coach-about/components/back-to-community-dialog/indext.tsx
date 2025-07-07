import { ActionModal } from '@ecdlink/ui';
import React, { ReactElement } from 'react';

interface BackToCommunityDialogProps {
  avatar?: ReactElement;
  hideTitle?: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export const BackToCommunityDialog: React.FC<BackToCommunityDialogProps> = ({
  avatar,
  hideTitle,
  onSubmit,
  onClose,
}) => {
  return (
    <ActionModal
      className="bg-white"
      customIcon={avatar}
      title={hideTitle ? '' : 'Looking good!'}
      detailText="Do you want to go back to the Community section?"
      actionButtons={[
        {
          colour: 'primary',
          text: 'Go back to Community',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'ArrowCircleLeftIcon',
          onClick: onSubmit,
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
