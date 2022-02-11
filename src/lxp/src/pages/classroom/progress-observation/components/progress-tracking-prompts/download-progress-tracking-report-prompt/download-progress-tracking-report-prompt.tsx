import { ActionModal } from '@ecdlink/ui';
import { DownloadProgressTrackingReportPromptProps } from './download-progress-tracking-report-prompt.types';

export const DownloadProgressTrackingReportPrompt: React.FC<DownloadProgressTrackingReportPromptProps> =
  ({ onClose, onProceed, className }) => {
    return (
      <ActionModal
        icon={'ExclamationCircleIcon'}
        className={className}
        iconColor="alertMain"
        iconBorderColor="alertBg"
        importantText={`Are you sure you want to create the report?`}
        detailText={'Once you create the report, you will not be able to edit it.'}
        actionButtons={[
          {
            text: 'Yes create report',
            textColour: 'white',
            colour: 'primary',
            type: 'filled',
            onClick: () => onProceed && onProceed(),
            leadingIcon: 'DownloadIcon',
          },
          {
            text: 'No, edit report',
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
