import { ActionModal } from '@ecdlink/ui';
import React from 'react';

export type AlertModalProps = {
  title: string;
  btnText?: string[];
  message: string;
  onSubmit: () => void;
  onCancel: () => void;
};

const AlertModal: React.FC<AlertModalProps> = ({
  title,
  message,
  btnText,
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
          
          text: btnText[0] ?? 'Yes',
          textColour: 'white',
          colour: 'secondary',
          type: 'filled',
          onClick: () => onSubmit && onSubmit(),
          leadingIcon: 'TrashIcon',
        },
        {
          text:  btnText[1] ?? 'No',
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
