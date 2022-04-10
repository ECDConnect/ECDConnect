import { ActionModal } from '@ecdlink/ui';
import { ProgressTrackingInformationPromptProps } from './progress-tracking-information-prompt.types';

export const ProgressTrackingInformationPrompt: React.FC<
  ProgressTrackingInformationPromptProps
> = ({ childUser, onClose, className }) => {
  return (
    <ActionModal
      icon={'InformationCircleIcon'}
      className={className}
      iconColor="infoMain"
      iconBorderColor="infoBb"
      importantText={`Only choose the things that ${childUser?.firstName} can do easily`}
      detailText={
        'Each child progresses differently. It is unlikely that every child will be able to do skills at level 2 and 3. Observe each child to see what they can do!'
      }
      actionButtons={[
        {
          text: 'Close',
          textColour: 'white',
          colour: 'primary',
          type: 'filled',
          onClick: () => onClose && onClose(),
          leadingIcon: 'XIcon',
        },
      ]}
    />
  );
};
