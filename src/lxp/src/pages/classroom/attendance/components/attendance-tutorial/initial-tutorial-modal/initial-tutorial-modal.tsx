import { ActionModal } from '@ecdlink/ui';
import EcdConnectRobot from '@/assets/svg-components/ecdConnectRobot';
import { useTenant } from '@/hooks/useTenant';

interface InitialAttendanceTutorialModalProps {
  onStart: () => void;
  onClose: () => void;
}

export const InitialAttendanceTutorialModal = ({
  onStart,
  onClose,
}: InitialAttendanceTutorialModalProps) => {
  const { tenant } = useTenant();

  return (
    <ActionModal
      customIcon={<EcdConnectRobot className="mb-2" />}
      iconColor="alertMain"
      iconBorderColor="alertBg"
      importantText={`Want to learn how to track attendance ${
        tenant?.applicationName ? `on ${tenant.applicationName}` : ''
      } ?`}
      actionButtons={[
        {
          text: 'Yes, help me!',
          textColour: 'white',
          colour: 'quatenary',
          type: 'filled',
          onClick: onStart,
          leadingIcon: 'CheckCircleIcon',
        },
        {
          text: 'No, skip',
          textColour: 'quatenary',
          colour: 'quatenary',
          type: 'outlined',
          onClick: onClose,
          leadingIcon: 'ClockIcon',
        },
      ]}
    />
  );
};
