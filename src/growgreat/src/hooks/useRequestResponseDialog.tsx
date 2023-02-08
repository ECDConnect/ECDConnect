import { ActionModal, DialogPosition } from '@ecdlink/ui';
import { useDialog } from '@ecdlink/core';
import momImage from '@/assets/momImage.png';
import happyMomImage from '@/assets/happyMom.svg';

export const useRequestResponseDialog = () => {
  const dialog = useDialog();

  const errorDialog = () => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            title="Something went wrong"
            detailText="Please try again"
            customIcon={
              <div
                className="bg-tertiary mb-4 flex h-auto justify-center overflow-hidden rounded-full"
                style={{ width: 85 }}
              >
                <img src={momImage} alt="card" />
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
                <img src={happyMomImage} className="h-20 w-20" alt="card" />
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
