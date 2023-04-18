import React from 'react';
import { ActionModal } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';

export type OfflineSyncErrorProps = {
  onSubmit: () => void;
  onCancel?: () => void;
};

const OfflineSyncError: React.FC<OfflineSyncErrorProps> = ({
  onSubmit,
  onCancel,
}) => {
  const actionButtons: ActionModalButton[] = [
    {
      text: 'Sync my app',
      textColour: 'primary',
      colour: 'primary',
      type: 'outlined',
      onClick: () => onSubmit && onSubmit(),
      leadingIcon: 'SwitchVerticalIcon',
    },
  ];

  if (onCancel) {
    actionButtons.push({
      text: 'Cancel this data sync',
      textColour: 'white',
      colour: 'primary',
      type: 'filled',
      onClick: () => onCancel(),
      leadingIcon: 'XIcon',
    });
  }

  return (
    <ActionModal
      icon={'ExclamationCircleIcon'}
      iconColor="alertMain"
      iconBorderColor="errorBg"
      title="Unable to sync?"
      detailText={`If you are unable to sync you may cancel and continue without syncing.\nRemember, after 30 days of being offline this app will no longer work. Connect to a wifi network or make sure you have enough data and try again.`}
      actionButtons={actionButtons}
    />
  );
};

export default OfflineSyncError;
