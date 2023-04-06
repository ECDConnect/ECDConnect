import { ChildDto, UserDto } from '@ecdlink/core';
import { ActionModal, ComponentBaseProps } from '@ecdlink/ui';

interface RemoveChildPromptProps extends ComponentBaseProps {
  child?: ChildDto;
  childUser?: UserDto;
  onProceed?: () => void;
  onClose?: () => void;
}

export const RemoveChildPrompt: React.FC<RemoveChildPromptProps> = ({
  child,
  childUser,
  onClose,
  onProceed,
  className,
}) => {
  return (
    <ActionModal
      icon={'XCircleIcon'}
      className={className}
      iconColor="errorMain"
      iconBorderColor="errorBg"
      importantText={`${childUser?.firstName} will be removed from the programme immediately`}
      detailText={`If you remove ${childUser?.firstName} now, you will no longer be able to edit or view this profile`}
      actionButtons={[
        {
          text: 'Proceed',
          textColour: 'white',
          colour: 'primary',
          type: 'filled',
          onClick: () => onProceed && onProceed(),
          leadingIcon: 'ArrowCircleRightIcon',
        },
        {
          text: 'Close',
          textColour: 'primary',
          colour: 'primary',
          type: 'outlined',
          onClick: () => onClose && onClose(),
          leadingIcon: 'XIcon',
        },
      ]}
    />
  );
};
