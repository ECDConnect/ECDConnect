import { ActionModal } from '@ecdlink/ui';
import { ReactComponent as IconRobot } from '@/assets/iconRobot.svg';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface ChildrenDialogProps {
  name: string;
  practitionerId: string;
  onBack?: Function;
  onClose: Function;
  onSuccess: Function;
}
export const ChildrenDialog = ({
  name,
  practitionerId,
  onBack,
  onClose,
  onSuccess,
}: ChildrenDialogProps) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  return (
    <ActionModal
      className="z-50"
      customIcon={<IconRobot className="mb-4" />}
      title={`Would you like to register any children for ${name}’s programme?`}
      detailText={`You can register children on your phone now. Or, help ${name} to register children on her phone.
          ${
            !isOnline
              ? `\n
          Note: Data has been saved in offline mode
          \nIn order for you to view the answers, it is necessary to synchronize your account.`
              : ''
          }`}
      actionButtons={[
        {
          colour: 'primary',
          text: 'Yes, register children now',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'CheckCircleIcon',
          onClick: () => {
            onBack?.();
            history.push(ROUTES.CHILD_REGISTRATION_LANDING);
            onClose();
          },
        },
        {
          colour: 'primary',
          text: 'No, skip',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'XIcon',
          onClick: () => {
            setTimeout(() => onSuccess(), 100);
            onBack?.();
            onClose();
          },
        },
      ]}
    />
  );
};
