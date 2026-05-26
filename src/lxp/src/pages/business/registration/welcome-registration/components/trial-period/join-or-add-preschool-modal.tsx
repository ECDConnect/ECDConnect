import { ActionModal, DialogPosition } from '@ecdlink/ui';
import { ReactComponent as RobotImage } from '@/assets/iconRobot.svg';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useDialog } from '@ecdlink/core';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { BusinessTabItems } from '@/pages/business/business.types';

interface JoinOrAddPreschoolModalProps {
  onSubmit: () => void;
}
export const JoinOrAddPreschoolModal: React.FC<
  JoinOrAddPreschoolModalProps
> = ({ onSubmit }) => {
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const history = useHistory();

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
      title={'Set up your preschool!'}
      detailText={`To use this section, please share some details about yourself and your preschool.`}
      actionButtons={[
        {
          colour: 'quatenary',
          text: 'Set up your preschool',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'ArrowCircleRightIcon',
          onClick: async () => {
            onSubmit();
            handleOnlineCallback(() =>
              history.push(ROUTES?.PRINCIPAL.SETUP_PROFILE)
            );
          },
        },
        {
          colour: 'quatenary',
          text: 'Do this later',
          textColour: 'quatenary',
          type: 'outlined',
          leadingIcon: 'XIcon',
          onClick: async () => {
            onSubmit();
            handleOnlineCallback(() =>
              history.push(ROUTES.BUSINESS, {
                activeTabIndex: BusinessTabItems.MONEY,
              })
            );
          },
        },
      ]}
    />
  );
};
