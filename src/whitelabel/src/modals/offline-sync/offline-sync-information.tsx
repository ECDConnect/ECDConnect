import { ActionModal } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';

export type OfflineSyncInformationProps = {
  onSubmit: () => void;
  onCancel?: () => void;
  isOnline: boolean;
  isManual: boolean;
  generalMessageOveride?: string;
  recommendationTextOveride?: string;
};

export const OfflineSyncInformation: React.FC<OfflineSyncInformationProps> = ({
  isOnline,
  isManual,
  generalMessageOveride,
  recommendationTextOveride,
  onSubmit,
  onCancel,
}) => {
  const generalMessage =
    generalMessageOveride ||
    `We suggest connecting to a wifi network to complete this process.\nAfter syncing your data, the Funda App will continue to work offline.\n`;
  const recommendationText =
    recommendationTextOveride ||
    `If you choose not to sync now, you can still access the update at any time in the notifications area, or choose manual update in your profile.`;

  const actionButtons: ActionModalButton[] = [
    {
      text: isOnline ? 'Sync my app' : 'Go online to sync',
      textColour: 'white',
      colour: 'primary',
      type: 'filled',
      disabled: !isOnline,
      onClick: () => onSubmit && onSubmit(),
      leadingIcon: 'SwitchVerticalIcon',
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
      title={isManual ? 'Manually sync your app' : 'We need to sync your data'}
      paragraphs={[generalMessage, !isManual ? recommendationText : '']}
      actionButtons={actionButtons}
    />
  );
};
