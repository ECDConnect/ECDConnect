import { ActionModal } from '@ecdlink/ui';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

interface OfflineModalProps {
  onClose: () => void;
  title: string;
  detailText?: string;
}

export const OfflineModal = ({
  onClose,
  title,
  detailText,
}: OfflineModalProps) => {
  return (
    <ActionModal
      className="bg-white"
      title={title}
      detailText={detailText}
      customIcon={
        <ExclamationCircleIcon className="text-alertMain h-10 w-10" />
      }
      actionButtons={[
        {
          colour: 'primary',
          text: 'Close',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'XIcon',
          onClick: () => {
            onClose();
          },
        },
      ]}
    />
  );
};
