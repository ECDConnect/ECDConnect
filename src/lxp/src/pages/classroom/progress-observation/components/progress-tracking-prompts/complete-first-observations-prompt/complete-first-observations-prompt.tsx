import { ActionModal } from '@ecdlink/ui';
import { CompleteFirstObservationsPromptProps } from './complete-first-observations-prompt.types';

export const CompleteFirstObservationsPrompt: React.FC<
  CompleteFirstObservationsPromptProps
> = ({ onCancel, onSaveAndComplete, firstName, className }) => {
  return (
    <ActionModal
      icon={'ExclamationCircleIcon'}
      className={className}
      iconColor="alertMain"
      iconBorderColor="alertBg"
      importantText={`Are you sure you want to complete first observations for ${firstName}?`}
      detailText={
        'Once you save & complete, you will not be able to edit your answers.'
      }
      actionButtons={[
        {
          text: 'Yes, save & complete',
          textColour: 'white',
          colour: 'primary',
          type: 'filled',
          onClick: () => onSaveAndComplete(),
          leadingIcon: 'CheckIcon',
        },
        {
          text: 'No, cancel',
          textColour: 'primary',
          colour: 'primary',
          type: 'outlined',
          onClick: () => onCancel(),
          leadingIcon: 'XIcon',
        },
      ]}
    />
  );
};
