import { ActionModal } from '@ecdlink/ui';
import robot from '../../../../../../assets/ECD_Connect_robot1.svg';
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
      customIcon={<img src={robot} alt="profile" className="mb-2" />}
      iconColor="alertMain"
      iconBorderColor="alertBg"
      importantText={`Want to learn how to track attendance ${
        tenant?.applicationName ? `on ${tenant.applicationName}` : ''
      } ?`}
      actionButtons={[
        {
          text: 'Yes, help me!',
          textColour: 'white',
          colour: 'primary',
          type: 'filled',
          onClick: onStart,
          leadingIcon: 'ChevronRightIcon',
        },
        {
          text: 'No, skip',
          textColour: 'white',
          colour: 'primary',
          type: 'filled',
          onClick: onClose,
          leadingIcon: 'ClockIcon',
        },
      ]}
    />
  );
};
