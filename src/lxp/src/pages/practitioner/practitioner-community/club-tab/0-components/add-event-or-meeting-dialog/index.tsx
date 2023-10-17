import { ActionModal } from '@ecdlink/ui';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';

// todo: add a dialog with actions buttons
export const AddEventOrMeetingDialog = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  return (
    <ActionModal
      title="What do you want to add?"
      customIcon={
        <QuestionMarkCircleIcon className="text-infoMain h-10 w-10" />
      }
      actionButtons={[
        {
          colour: 'primary',
          text: 'Monthly meeting',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'CalendarIcon',
          onClick: () => {
            onClose();
          },
        },
        {
          colour: 'primary',
          text: 'Family day',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'CalendarIcon',
          onClick: () => {
            onClose();
          },
        },
      ]}
    />
  );
};
