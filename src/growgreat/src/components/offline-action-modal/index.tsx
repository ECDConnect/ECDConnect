import { ActionModal } from '@ecdlink/ui';
import { ExclamationIcon } from '@heroicons/react/solid';

export const OfflineActionModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <ActionModal
      customIcon={<ExclamationIcon className="text-alertMain w-24" />}
      title="You need to go online to use this feature"
      detailText="Switch on your mobile data or connect to a wifi network to use this feature. "
      actionButtons={[
        {
          colour: 'primary',
          text: 'Okay',
          onClick: onClose,
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'CheckCircleIcon',
        },
      ]}
    />
  );
};
