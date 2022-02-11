import { ActionModal } from '@ecdlink/ui';
import { ComponentBaseProps } from '@ecdlink/ui';
import { UsePreviousReportPromptProps } from './use-previous-report-prompt.types';

export const UsePreviousReportPrompt: React.FC<UsePreviousReportPromptProps> = ({
  onClose,
  onProceed,
  className,
}) => {
  return (
    <ActionModal
      icon={'QuestionMarkCircleIcon'}
      className={className}
      iconColor="infoMain"
      iconBorderColor="infoBb"
      importantText={`Would you like to continue from the previous report?`}
      detailText={
        'Your observations from the previous reporting period will be shown and you will be able to view and edit your answers.'
      }
      actionButtons={[
        {
          text: 'Yes, use previous report',
          textColour: 'white',
          colour: 'primary',
          type: 'filled',
          onClick: () => onProceed && onProceed(),
          leadingIcon: 'CheckCircleIcon',
        },
        {
          text: 'No, start new report',
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
