import { ActionModal } from '@ecdlink/ui';

export const PostalCodeModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <ActionModal
      icon="ExclamationCircleIcon"
      title="This will cost data. Do you want to continue?"
      detailText="You can use the Postalcodez website to look up your postal code. Going to the website will use your data."
      actionButtons={[
        {
          leadingIcon: 'ExternalLinkIcon',
          colour: 'quatenary',
          type: 'filled',
          textColour: 'white',
          text: 'Yes, go to website',
          onClick: () => {
            onClose();
            window.open('https://postalcodez.co.za/', '_blank');
          },
        },
        {
          leadingIcon: 'XIcon',
          textColour: 'quatenary',
          colour: 'quatenary',
          type: 'outlined',
          text: 'No, cancel',
          onClick: onClose,
        },
      ]}
    />
  );
};
