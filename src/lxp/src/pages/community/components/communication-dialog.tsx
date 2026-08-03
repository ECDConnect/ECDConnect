import { ActionModal } from '@ecdlink/ui';
import iconRobotImage from '@/assets/iconRobot.svg';

interface CommunicationDialogProps {
  onSelect: (shareEmail: boolean, sharePhoneNumber: boolean) => void;
  onClose: () => void;
}

export const CommunicationDialog: React.FC<CommunicationDialogProps> = ({
  onSelect,
  onClose,
}) => {
  return (
    <ActionModal
      customIcon={<img src={iconRobotImage} className="h-16 w-16" alt="" />}
      title="Which information do you want to share with your contacts?"
      actionButtons={[
        {
          colour: 'quatenary',
          type: 'filled',
          text: 'Phone number',
          textColour: 'white',
          onClick: () => {
            onSelect(false, true);
            onClose();
          },
          leadingIcon: 'PhoneIcon',
        },
        {
          colour: 'quatenary',
          type: 'outlined',
          text: 'Email address',
          textColour: 'quatenary',
          onClick: () => {
            onSelect(true, false);
            onClose();
          },
          leadingIcon: 'MailIcon',
        },
        {
          colour: 'quatenary',
          type: 'outlined',
          text: 'Phone number and email',
          textColour: 'quatenary',
          onClick: () => {
            onSelect(true, true);
            onClose();
          },
          leadingIcon: 'PlusCircleIcon',
        },
        {
          colour: 'quatenary',
          type: 'outlined',
          text: "Don't share",
          textColour: 'quatenary',
          onClick: () => {
            onSelect(false, false);
            onClose();
          },
          leadingIcon: 'XIcon',
        },
      ]}
    ></ActionModal>
  );
};
