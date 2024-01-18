import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';
import { CalendarAddEventInfo } from '@/pages/calendar/components/calendar-add-event/calendar-add-event.types';
import ROUTES from '@/routes/routes';
import { useAppDispatch } from '@/store';
import { traineeActions, traineeThunkActions } from '@/store/trainee';
import { CalendarEventModel, PractitionerDto } from '@ecdlink/core';
import { UpdateVisitPlannedVisitDateModelInput } from '@ecdlink/graphql';
import { ActionModal, Dialog, DialogPosition } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';
import { addDays, addMinutes } from 'date-fns';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

interface SmartSpaceVisitProps {
  practitioner: PractitionerDto | undefined;
  onDone: () => void;
  options: any;
}

export const SmartSpaceVisit: React.FC<SmartSpaceVisitProps> = ({
  practitioner,
  onDone,
  options,
}) => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const [visible, setVisible] = useState<boolean>(true);
  const calendarAddEvent = useCalendarAddEvent();
  const practitionerUserId = practitioner?.userId || '';
  const visitId: string = options?.visitId || '';
  const visitEventId: string = options?.visitEventId || '';
  const plannedVisitDate: string = options?.plannedVisitDate || '';

  useEffect(() => {
    appDispatch(traineeActions?.resetCoachSmartSpaceVisitData());
  }, [appDispatch]);

  const onSchedule = () => {
    setVisible(false);

    const today = addDays(new Date(), 1);
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      today.getHours(),
      0,
      0,
      0
    );
    const event: CalendarAddEventInfo = !!visitEventId
      ? {
          id: visitEventId,
        }
      : {
          id: '',
          eventType: 'SmartSpace',
          allDay: false,
          start: start.toISOString(),
          end: addMinutes(start, 30).toISOString(),
          minDate: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          ).toISOString(),
          maxDate: new Date(plannedVisitDate).toISOString(),
          name: '',
          description: '',
          participantUserIds: [practitionerUserId],
          action: {
            buttonName: 'Start visit',
            buttonIcon: 'ArrowCircleRightIcon',
            url: ROUTES.COACH_SMARTSPACE_CHECK,
            state: {
              practitionerUserId: practitioner?.userId || '',
            },
          },
        };

    calendarAddEvent({
      event,
      onUpdated: (isNew: boolean, event: CalendarEventModel) => {
        const payload: UpdateVisitPlannedVisitDateModelInput = {
          visitId: visitId,
          plannedVisitDate: event.start,
          eventId: event.id,
        };
        appDispatch(
          traineeActions.updateTraineeOnboardTimelineSSVisitEvent(payload)
        );
        appDispatch(
          traineeThunkActions.updateTraineeOnboardTimelineSSVisitEvent(payload)
        );
      },
      onCancel: () => {},
    });

    onDone();
  };

  const actionButtons: ActionModalButton[] = [];

  if (!visitEventId) {
    actionButtons.push({
      text: 'Schedule in calendar',
      textColour: 'white',
      colour: 'primary',
      type: 'filled',
      onClick: onSchedule,
      leadingIcon: 'CalendarIcon',
      disabled: !visitId,
    });
  }

  actionButtons.push({
    text: 'Start visit now',
    textColour: 'primary',
    colour: 'primary',
    type: 'outlined',
    onClick: () =>
      history.push(ROUTES.COACH_SMARTSPACE_CHECK, {
        practitioner: practitioner,
      }),
    leadingIcon: 'ArrowCircleRightIcon',
  });

  if (!!visitEventId) {
    history.push(ROUTES.COACH_SMARTSPACE_CHECK, {
      practitioner: practitioner,
    });
  }

  return (
    // <div className="bg-primaryAccent1 flex h-screen items-center justify-center">
    <Dialog stretch={true} visible={visible} position={DialogPosition.Middle}>
      <ActionModal
        icon={'QuestionMarkCircleIcon'}
        iconColor="white"
        iconBorderColor="infoMain"
        title={'Would you like to schedule or start the SmartSpace visit?'}
        paragraphs={[
          'Tap schedule to go to the calendar or, if you are starting the SmartSpace visit now, tap start.',
        ]}
        actionButtons={actionButtons}
        className="rounded-xl bg-white"
      />
    </Dialog>
    //</div>
  );
};
