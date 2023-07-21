import { ActionModal } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';

export type LogoutInformationProps = {
  onSubmit: () => void;
  onCancel?: () => void;
  isOnline: boolean;
};

export const LogoutInformation: React.FC<LogoutInformationProps> = ({
  isOnline,
  onSubmit,
  onCancel,
}) => {
  const actionButtons: ActionModalButton[] = [
    {
      text: 'Yes, log out',
      colour: 'primary',
      onClick: () => onSubmit && onSubmit(),
      type: 'filled',
      textColour: 'white',
      leadingIcon: 'CheckCircleIcon',
    },
  ];

  if (onCancel) {
    actionButtons.push({
      text: 'Cancel',
      textColour: 'primary',
      colour: 'primary',
      type: 'outlined',
      onClick: () => onCancel(),
      leadingIcon: 'XIcon',
    });
  }

  return (
    <ActionModal
      icon={'SwitchVerticalIcon'}
      iconColor="primary"
      iconBorderColor="errorBg"
      title={'Are you sure you want to log out?'}
      actionButtons={actionButtons}
    />
  );
};
