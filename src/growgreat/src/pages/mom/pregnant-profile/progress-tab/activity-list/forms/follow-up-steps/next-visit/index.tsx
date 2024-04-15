import { useLayoutEffect, useMemo } from 'react';
import { Alert, Button } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';

import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps, MotherProfileParams } from '../../dynamic-form';
import { useSelector } from 'react-redux';
import { motherSelectors } from '@/store/mother';
import { RootState } from '@/store/types';
import { useParams } from 'react-router';
import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';
import { CalendarAddEventOptions } from '@/pages/calendar/components/calendar-add-event/calendar-add-event.types';

export const NextVisitStep = ({
  mother,
  onSubmit,
  setEnableButton,
  setButtonProperties,
  setExtraButtons,
}: DynamicFormProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);

  const { visitId } = useParams<MotherProfileParams>();
  const currentVisit = useSelector((state: RootState) =>
    motherSelectors.getMotherCurrentVisitSelector(state, visitId)
  );
  const motherVisits = useSelector(motherSelectors.getMotherVisits);
  const calendarAddEvent = useCalendarAddEvent();

  const todayEndOfTheDay = new Date();
  todayEndOfTheDay.setHours(23, 59, 59, 999);
  const nextVisit = motherVisits.find(
    (item) =>
      item.visitType?.order === Number(currentVisit?.visitType?.order) + 1
  );

  const dueDate = nextVisit?.dueDate
    ? new Date(nextVisit.dueDate)
    : todayEndOfTheDay;
  const date = dueDate
    ? dueDate.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const onBookVisit = () => {
    const options: CalendarAddEventOptions = {
      event: {
        participantUserIds: [mother?.id!],
        eventType: 'Home visit',
      },
      onUpdated: (isNew, event) => {
        onSubmit?.();
      },
    };
    calendarAddEvent(options);
  };

  useLayoutEffect(() => {
    setEnableButton?.(true);
    setButtonProperties?.({
      type: 'outlined',
      color: 'primary',
      text: 'Save & Exit',
      textColor: 'primary',
    });
    setExtraButtons?.([
      <Button
        type="filled"
        color="primary"
        textColor="white"
        icon={'CalendarIcon'}
        className="mb-4 w-full"
        text={'Save & book your next visit'}
        onClick={() => onBookVisit()}
        // disabled={!isEnableButton || isLoading || isLoadingCreateDocument}
        // isLoading={isLoading || isLoadingCreateDocument}
      />,
    ]);
  }, [onBookVisit, setEnableButton, setButtonProperties, setExtraButtons]);

  return (
    <>
      <Header
        icon="CalendarIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title="Next visit"
      />
      <div className="p-4">
        <Alert
          type="warning"
          title={`${name} needs an extra support visit`}
          titleColor="textDark"
          message={`Book a visit before ${date}.`}
          messageColor="textMid"
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
      </div>
    </>
  );
};
