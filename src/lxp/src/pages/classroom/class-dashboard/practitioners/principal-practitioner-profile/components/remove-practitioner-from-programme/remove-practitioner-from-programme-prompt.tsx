import { PractitionerDto } from '@ecdlink/core';
import { ActionModal, ComponentBaseProps } from '@ecdlink/ui';

interface RemovePractitionerFromProgrammePromptProps
  extends ComponentBaseProps {
  practitioner?: PractitionerDto;
  onProceed?: () => void;
  onClose?: () => void;
}

export const RemovePractitionerFromProgrammePrompt: React.FC<
  RemovePractitionerFromProgrammePromptProps
> = ({ practitioner, onClose, onProceed, className }) => {
  return (
    <ActionModal
      icon={'XCircleIcon'}
      className={className}
      iconColor="errorMain"
      iconBorderColor="errorBg"
      importantText={`Are you sure you want to remove ${practitioner?.user?.firstName}?`}
      detailText={
        'This profile will be deactivated immediately and you will no longer be able to view it.'
      }
      actionButtons={[
        {
          text: 'Yes, remove',
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

export default RemovePractitionerFromProgrammePrompt;
