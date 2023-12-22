import { ActionModal } from '@ecdlink/ui';
import React from 'react';

export type AlertModalProps = {
  title: string;
  btnText?: string[];
  message: string;
  isLoading?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

const AlertModal: React.FC<AlertModalProps> = ({
  title,
  message,
  btnText,
  isLoading,
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
      buttonClass="rounded-xl"
      actionButtons={[
        {
          text: btnText?.[0] ?? 'Yes',
          textColour: 'white',
          colour: 'secondary',
          type: 'filled',
          onClick: () => onSubmit && onSubmit(),
          leadingIcon: 'TrashIcon',
          isLoading: isLoading,
          disabled: isLoading,
        },
        {
          text: btnText?.[1] ?? 'No',
          textColour: 'secondary',
          colour: 'secondary',
          type: 'outlined',
          onClick: () => onCancel && onCancel(),
          leadingIcon: btnText?.[1] === 'Keep editing' ? 'PencilIcon' : 'XIcon',
          disabled: isLoading,
        },
      ]}
    />
  );
};

export default AlertModal;
