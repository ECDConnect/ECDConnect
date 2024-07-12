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
      title="Add a photo of yourself so your fellow ECD Heroes will recognise you!"
      detailText="You can add and edit your photo on your profile at any time."
      actionButtons={[
        {
          colour: 'quatenary',
          text: 'Add a photo',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'CameraIcon',
          onClick: onSubmit,
        },
        {
          colour: 'quatenary',
          text: 'Do this later',
          textColour: 'quatenary',
          type: 'outlined',
          leadingIcon: 'ClockIcon',
          onClick: onClose,
        },
      ]}
    />
  );
};
