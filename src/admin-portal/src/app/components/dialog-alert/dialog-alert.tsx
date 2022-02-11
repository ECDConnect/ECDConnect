import { ActionModal } from '@ecdlink/ui';
import React from 'react';

export type AlertModalProps = {
  title: string;
  message: string;
  onSubmit: () => void;
  onCancel: () => void;
};

const AlertModal: React.FC<AlertModalProps> = ({ title, message, onSubmit, onCancel }) => {
  return (
    <ActionModal
      icon={'ExclamationCircleIcon'}
      iconColor="alertMain"
      iconBorderColor="alertBg"
      title={title}
      detailText={message}
      actionButtons={[
        {
          text: 'Okay',
          textColour: 'white',
          colour: 'primary',
          type: 'filled',
          onClick: () => onSubmit && onSubmit(),
          leadingIcon: 'CheckCircleIcon',
        },
        {
          text: 'Cancel',
          textColour: 'white',
          colour: 'primary',
          type: 'filled',
          onClick: () => onCancel && onCancel(),
          leadingIcon: 'XCircleIcon',
        },
      ]}
    />
  );
};

export default AlertModal;
