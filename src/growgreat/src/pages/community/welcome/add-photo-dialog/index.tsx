import { ActionModal } from '@ecdlink/ui';
import { ReactComponent as PollyInformational } from '@/assets/pollyInformational.svg';

interface AddPhotoDialogProps {
  onSubmit: () => void;
  onClose: () => void;
}

export const AddPhotoDialog: React.FC<AddPhotoDialogProps> = ({
  onSubmit,
  onClose,
}) => {
  return (
    <ActionModal
      className="bg-white"
      customIcon={<PollyInformational className="mb-4 h-24 w-24" />}
      title="Add a photo of yourself so your team members will recognise you!"
      detailText="You can add and edit your photo on your CHW Connect profile at any time."
      actionButtons={[
        {
          colour: 'primary',
          text: 'Add a photo',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'CameraIcon',
          onClick: onSubmit,
        },
        {
          colour: 'primary',
          text: 'Do this later',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'ClockIcon',
          onClick: onClose,
        },
      ]}
    />
  );
};
