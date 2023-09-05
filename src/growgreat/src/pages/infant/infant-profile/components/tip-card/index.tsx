import { OfflineActionModal } from '@/components/offline-action-modal';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useDialog } from '@ecdlink/core';
import {
  Button,
  classNames,
  DialogPosition,
  renderIcon,
  Typography,
} from '@ecdlink/ui';

interface TipCardProps {
  title?: string;
  buttonText: string;
  buttonIcon?: string;
  hideLeftIcon?: boolean;
  className?: string;
  onClick: () => void;
}
export const TipCard = ({
  className,
  title = 'Need tips?',
  hideLeftIcon,
  buttonText,
  buttonIcon,
  onClick,
}: TipCardProps) => {
  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();

  const displayOfflineAlert = () => {
    dialog({
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => <OfflineActionModal onClose={onClose} />,
    });
  };

  const handleOnClick = () => {
    if (isOnline) {
      onClick();
    } else {
      displayOfflineAlert();
    }
  };

  return (
    <div
      className={classNames(
        className,
        'bg-infoBb rounded-10 flex items-center justify-between p-4'
      )}
    >
      <div className="flex items-center gap-2">
        {!hideLeftIcon &&
          renderIcon('InformationCircleIcon', 'w-5 h-5 text-infoMain')}
        <Typography
          type="body"
          align="left"
          weight="normal"
          text={title}
          color="infoDark"
        />
      </div>
      <Button
        className="rounded-10 h-8"
        type="filled"
        color="primary"
        textColor="white"
        text={buttonText}
        icon={buttonIcon}
        iconPosition="end"
        onClick={handleOnClick}
      />
    </div>
  );
};
