import { ActionModal, AlertType } from '@ecdlink/ui';
import React from 'react';

export type AlertModalProps = {
  title: string;
  btnText?: string[];
  message: string;
  isLoading?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  hasAlert?: boolean;
  alertMessage?: string;
  alertType?: AlertType;
};

const AlertModal: React.FC<AlertModalProps> = ({
  title,
  message,
  btnText,
  isLoading,
  onSubmit,
  onCancel,
  hasAlert,
  alertMessage,
  alertType,
}) => {
  return (
    <ActionModal
      icon={'ExclamationCircleIcon'}
      iconColor="alertMain"
      iconBorderColor="alertBg"
      title={title}
      detailText={message}
      alertMessage={alertMessage}
      hasAlert={hasAlert}
      alertType={alertType}
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
