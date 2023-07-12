import { ActionModal } from '@ecdlink/ui';
import React from 'react';

export type AlertModalProps = {
  title: string;
  message: string;
  onSubmit: () => void;
  onCancel: () => void;
};

const AlertModal: React.FC<AlertModalProps> = ({
  title,
  message,
  onSubmit,
  onCancel,
}) => {
  return (
    
    <ActionModal
      icon={'ExclamationCircleIcon'}
      iconColor="alertMain"
      iconBorderColor="alertBg"
      title={title}
      detailText={message}
      buttonClass='rounded-xl'
      actionButtons={[
        {
          
          text: 'Yes, Deactivate User',
          textColour: 'white',
          colour: 'secondary',
          type: 'filled',
          onClick: () => onSubmit && onSubmit(),
          leadingIcon: 'TrashIcon',
        },
        {
          text: 'No, Cancel',
          textColour: 'secondary',
          colour: 'secondary',
          type: 'outlined',
          onClick: () =>  onCancel && onCancel(),
          leadingIcon: 'XIcon',
        },
      ]}
    />
  );
};

export default AlertModal;
