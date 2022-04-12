import React from 'react';
import { ActionModal } from '@ecdlink/ui';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

export type OfflineSyncTimeExceededProps = {
  onSubmit: () => void;
};

const OfflineSyncTimeExceeded: React.FC<OfflineSyncTimeExceededProps> = ({
  onSubmit,
}) => {
  const { isOnline } = useOnlineStatus();

  const generalMessage = `We suggest connecting to a wifi network to complete this process.\nAfter syncing your data, the Funda App will continue to work offline.\n`;

  return (
    <ActionModal
      icon={'XCircleIcon'}
      iconColor="errorMain"
      iconBorderColor="errorBg"
      title="You have been offline for 30 days"
      detailText={generalMessage}
      actionButtons={[
        {
          text: isOnline ? 'Sync my app' : 'Go online to sync',
          textColour: 'white',
          colour: 'primary',
          type: 'filled',
          disabled: !isOnline,
          onClick: () => onSubmit && onSubmit(),
          leadingIcon: 'SwitchVerticalIcon',
        },
      ]}
    />
  );
};

export default OfflineSyncTimeExceeded;
