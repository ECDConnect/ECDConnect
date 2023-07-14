import { ActionModal } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';

export const SmartSpaceVisit = () => {
  const actionButtons: ActionModalButton[] = [
    {
      text: 'Schedule in calendar',
      textColour: 'white',
      colour: 'primary',
      type: 'filled',
      onClick: () => {},
      leadingIcon: 'CalendarIcon',
    },
  ];

  actionButtons.push({
    text: 'Start visit now',
    textColour: 'primary',
    colour: 'primary',
    type: 'outlined',
    onClick: () => {},
    leadingIcon: 'ArrowCircleRightIcon',
  });

  return (
    <div className="bg-primaryAccent1 flex h-screen items-center justify-center">
      <ActionModal
        icon={'QuestionMarkCircleIcon'}
        iconColor="white"
        iconBorderColor="infoMain"
        title={'Would you like to schedule or start the SmartSpace visit?'}
        paragraphs={[
          'Tap schedule to go to the calendar or, if you are starting the SmartSpace visit now, tap start.',
        ]}
        actionButtons={actionButtons}
        className="w-11/12 rounded-xl bg-white"
      />
    </div>
  );
};
