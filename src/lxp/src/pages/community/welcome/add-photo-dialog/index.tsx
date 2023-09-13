import { ActionModal } from '@ecdlink/ui';
import { ReactComponent as Robot } from '@/assets/iconRobot.svg';

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
      customIcon={<Robot className="mb-4" />}
      title="Add a photo of yourself so SmartStarters will recognise you!"
      detailText="You can add a photo to your Funda App profile."
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
