import React from 'react';
import { ActionModal } from '@ecdlink/ui';

export type SyncTimeExceededProps = {
  onSubmit: () => void;
};

const SyncTimeExceeded: React.FC<SyncTimeExceededProps> = ({ onSubmit }) => {
  return (
    <ActionModal
      icon={'ExclamationCircleIcon'}
      iconColor={'alertDark'}
      iconBorderColor={'alertBg'}
      title="You've been signed out"
      detailText="Please log in again to continue."
      actionButtons={[
        {
          text: 'Log in',
          textColour: 'white',
          colour: 'quatenary',
          type: 'filled',
          onClick: () => onSubmit && onSubmit(),
          leadingIcon: 'BadgeCheckIcon',
        },
      ]}
    />
  );
};

export default SyncTimeExceeded;
