import { ActionModal } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

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
      colour: 'quatenary',
      onClick: () => onSubmit && onSubmit(),
      type: 'filled',
      textColour: 'white',
      leadingIcon: 'CheckCircleIcon',
    },
  ];

  if (onCancel) {
    actionButtons.push({
      text: 'Cancel',
      textColour: 'quatenary',
      colour: 'quatenary',
      type: 'outlined',
      onClick: () => onCancel(),
      leadingIcon: 'XIcon',
    });
  }

  return (
    <ActionModal
      customIcon={
        <ExclamationCircleIcon className="text-alertMain h-12 w-12" />
      }
      iconColor="white"
      iconBorderColor="alertMain"
      title={'Are you sure you want to log out?'}
      actionButtons={actionButtons}
    />
  );
};
