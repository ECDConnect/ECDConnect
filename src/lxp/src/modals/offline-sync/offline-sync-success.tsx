import React from 'react';
import { ActionModal } from '@ecdlink/ui';

export type OfflineSyncSuccessProps = {
  isLoading: boolean;
  onSubmit: () => void;
};

const OfflineSyncSuccess: React.FC<OfflineSyncSuccessProps> = ({
  onSubmit,
  isLoading,
}) => {
  return (
    <ActionModal
      icon={'CheckCircleIcon'}
      iconColor="successMain"
      iconBorderColor="errorBg"
      title="Success!"
      detailText={`We have succesfully synced your data.\nYou can now continue to use the Funda App offline.`}
      actionButtons={[
        {
          text: 'Okay',
          textColour: 'white',
          colour: 'primary',
          type: 'filled',
          onClick: () => onSubmit && onSubmit(),
          leadingIcon: 'CheckCircleIcon',
          isLoading,
          disabled: isLoading,
        },
      ]}
    />
  );
};

export default OfflineSyncSuccess;
