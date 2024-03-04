import { ActionModal, Dialog, DialogPosition } from '@ecdlink/ui';

interface ShareContactDialogProps {
  isLoading: boolean;
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
}

export const ShareContactDialog = ({
  onClose,
  onShare,
  isLoading,
  visible,
}: ShareContactDialogProps) => (
  <Dialog
    visible={visible}
    position={DialogPosition.Middle}
    className="m-4 overflow-auto"
  >
    <ActionModal
      icon="ExclamationCircleIcon"
      iconColor="alertMain"
      title="Are you sure you want to share your contact details?"
      detailText="Your phone and WhatsApp numbers will be shared with your team members."
      actionButtons={[
        {
          isLoading,
          disabled: isLoading,
          colour: 'primary',
          textColour: 'white',
          type: 'filled',
          text: 'Share',
          leadingIcon: 'ShareIcon',
          onClick: () => onShare(),
        },
        {
          disabled: isLoading,
          colour: 'primary',
          textColour: 'primary',
          type: 'outlined',
          text: 'Cancel',
          leadingIcon: 'XIcon',
          onClick: onClose,
        },
      ]}
    />
  </Dialog>
);
