import { ActionModal, DialogPosition } from '@ecdlink/ui';
import { ReactComponent as RobotImage } from '@/assets/iconRobot.svg';
import { useTenant } from '@/hooks/useTenant';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useDialog } from '@ecdlink/core';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';

interface JoinOrAddPreschoolModalProps {
  onSubmit: () => void;
}
export const JoinOrAddPreschoolModal: React.FC<
  JoinOrAddPreschoolModalProps
> = ({ onSubmit }) => {
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const history = useHistory();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;

  const handleOnlineCallback = (callback: () => void) => {
    if (isOnline) {
      callback();
    } else {
      showOnlineOnly();
    }
  };

  const showOnlineOnly = () => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  return (
    <ActionModal
      className="z-50"
      customIcon={<RobotImage />}
      icon="XCircleIcon"
      iconBorderColor="errorBg"
      iconColor="errorMain"
      title="Join or add a preschool!"
      paragraphs={[
        `To use ${appName}, please set up your preschool or connect with your principal.`,
      ]}
      actionButtons={[
        {
          colour: 'quatenary',
          text: 'Get started',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'ArrowCircleRightIcon',
          onClick: async () => {
            onSubmit();
            handleOnlineCallback(() =>
              history.push(ROUTES.PRACTITIONER.PROFILE.EDIT)
            );
          },
        },
        {
          colour: 'quatenary',
          text: 'Close',
          textColour: 'quatenary',
          type: 'outlined',
          leadingIcon: 'XIcon',
          onClick: () => {
            onSubmit();
          },
        },
      ]}
    />
  );
};
