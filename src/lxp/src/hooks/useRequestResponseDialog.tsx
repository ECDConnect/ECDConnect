import { ActionModal, DialogPosition } from '@ecdlink/ui';
import { useDialog } from '@ecdlink/core';
import successImage from '@/assets/cebisa.svg';

export const useRequestResponseDialog = () => {
  const dialog = useDialog();

  const errorDialog = (detailText?: string) => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            iconColor="alertMain"
            iconBorderColor="errorBg"
            title="Eish! Something went wrong!"
            detailText={detailText || 'Please try again'}
            icon={'ExclamationCircleIcon'}
            actionButtons={[
              {
                colour: 'primary',
                text: 'Close',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'XIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  };

  const successDialog = () => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            title="Your submission has been sent"
            customIcon={
              <div className="bg-tertiary mb-4 flex h-24 w-24 justify-center overflow-hidden rounded-full pt-4">
                <img src={successImage} className="h-20 w-20" alt="card" />
              </div>
            }
            actionButtons={[
              {
                colour: 'primary',
                text: 'Close',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'XIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  };

  return { errorDialog, successDialog };
};
