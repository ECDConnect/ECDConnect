import { ActionModal } from '@ecdlink/ui';
import { ProgressTrackingAlertLevelOnePromptProps } from './progress-tracking-alert-level-one-prompt.types';

export const ProgressTrackingAlertLevelOnePrompt: React.FC<ProgressTrackingAlertLevelOnePromptProps> =
  ({ childUser, onClose, onProceed, className }) => {
    return (
      <ActionModal
        icon={'ExclamationCircleIcon'}
        className={className}
        iconColor="alertMain"
        iconBorderColor="alertBg"
        importantText={`Check what ${childUser?.firstName} can do easily at Level 1`}
        paragraphs={[
          `Usually, children learn to do a few skills at Level 1 and then begin to master more skills at Level 2.`,
          `Please make sure you have observed ${childUser?.firstName} and chosen all the things ${childUser?.firstName} can do easily at Level 1.`,
        ]}
        actionButtons={[
          {
            text: 'Change your answers',
            textColour: 'white',
            colour: 'primary',
            type: 'filled',
            onClick: () => onProceed && onProceed(),
            leadingIcon: 'PencilIcon',
          },
          {
            text: 'Ignore and continue',
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
