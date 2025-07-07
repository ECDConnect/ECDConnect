import { formatDateLong } from '@/utils/common/date.utils';
import { PractitionerDto } from '@ecdlink/core';
import { PractitionerRemovalHistory } from '@ecdlink/graphql';
import { ActionModal, ComponentBaseProps } from '@ecdlink/ui';

interface EditRemovePractitionerFromProgrammePromptProps
  extends ComponentBaseProps {
  practitioner?: PractitionerDto;
  removalDetails: PractitionerRemovalHistory;
  classroomName: string;
  onEdit?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const RemovePractitionerFromProgrammePrompt: React.FC<
  EditRemovePractitionerFromProgrammePromptProps
> = ({
  practitioner,
  onCancel,
  onEdit,
  onClose,
  removalDetails,
  classroomName,
  className,
}) => {
  return (
    <ActionModal
      icon={'QuestionMarkCircleIcon'}
      className={className}
      iconColor="infoDark"
      iconBorderColor="infoBb"
      importantText={`Change details or cancel removal?`}
      detailText={`${
        practitioner?.user?.firstName
      } is scheduled to be removed from ${classroomName} on ${
        removalDetails?.dateOfRemoval
          ? formatDateLong(new Date(removalDetails?.dateOfRemoval))
          : ''
      }. You can update the details or cancel the removal`}
      actionButtons={[
        {
          text: 'Edit details',
          textColour: 'white',
          colour: 'quatenary',
          type: 'filled',
          onClick: () => onEdit && onEdit(),
          leadingIcon: 'ArrowCircleRightIcon',
        },
        {
          text: 'Cancel removal',
          textColour: 'white',
          colour: 'quatenary',
          type: 'filled',
          onClick: () => onCancel && onCancel(),
          leadingIcon: 'XIcon',
        },
        {
          text: 'Close',
          textColour: 'quatenary',
          colour: 'quatenary',
          type: 'outlined',
          onClick: () => onClose && onClose(),
          leadingIcon: 'XIcon',
        },
      ]}
    />
  );
};

export default RemovePractitionerFromProgrammePrompt;
