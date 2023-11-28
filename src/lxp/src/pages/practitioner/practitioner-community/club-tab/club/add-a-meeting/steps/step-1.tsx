import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  DatePicker,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import { AddMeetingProps } from '../index.types';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import {
  ClubActions,
  getActivityMeetRegularDetails,
} from '@/store/club/club.actions';
import { useAppDispatch } from '@/store';
import { useSnackbar } from '@ecdlink/core';

export const Step1 = ({ setIsEnabledButton, setStep1 }: AddMeetingProps) => {
  const [hasMeetingHappened, setHasMeetingHappened] = useState<
    boolean | undefined
  >();
  const [date, setDate] = useState<Date | null>();

  const { isOnline } = useOnlineStatus();

  const appDispatch = useAppDispatch();

  const { showMessage } = useSnackbar();

  const club = useSelector(clubSelectors.getClubForPractitionerSelector);
  const details = useSelector(
    clubSelectors.getActivityMeetRegularDetailsSelector(club?.id ?? '')
  );

  const allMeetings = useMemo(
    () => [
      ...(details?.pastMeetings ?? []),
      ...(details?.upcomingMeetings ?? []),
    ],
    [details?.pastMeetings, details?.upcomingMeetings]
  );

  const currentDate = new Date();
  const minDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const hasMeetingInCurrentMonth = allMeetings.some(
    (meeting) =>
      new Date(meeting?.meetingDate).getMonth() === currentMonth &&
      new Date(meeting?.meetingDate).getFullYear() === currentYear
  );

  const { isLoading, isFulfilled, wasLoading, isRejected, error } =
    useThunkFetchCall('clubs', ClubActions.GET_ACTIVITY_MEET_REGULAR_DETAILS);

  const yesNoOptions = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  useEffect(() => {
    setIsEnabledButton(!!date);
  }, [setIsEnabledButton, date]);

  useEffect(() => {
    if (hasMeetingHappened !== undefined) {
      setStep1?.({
        hasMeetingHappened,
        date: date?.toISOString().split('T')[0] ?? '',
      });
    }
  }, [date, hasMeetingHappened, setStep1]);

  useEffect(() => {
    if (!isFulfilled && !allMeetings?.length && isOnline) {
      appDispatch(
        getActivityMeetRegularDetails({
          clubId: club?.id ?? '',
          month: currentMonth + 1,
          year: currentYear,
        })
      );
    }
  }, [
    allMeetings,
    appDispatch,
    club,
    currentMonth,
    currentYear,
    isOnline,
    isFulfilled,
  ]);

  useEffect(() => {
    if (wasLoading && !isLoading && isRejected) {
      showMessage(error);
    }
  }, [error, isRejected, showMessage, isLoading, wasLoading]);

  if (isLoading) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
      />
    );
  }

  return (
    <>
      <Typography className="mb-5" type="h2" text="Add a meeting" />
      <Typography
        type="h4"
        color="textDark"
        className="mb-2"
        text="Has the meeting already happened?"
      />
      <ButtonGroup<boolean>
        options={yesNoOptions}
        onOptionSelected={(value) => setHasMeetingHappened(value as boolean)}
        color="secondary"
        type={ButtonGroupTypes.Button}
        className="mb-4"
      />
      {hasMeetingHappened !== undefined &&
      (!isOnline || error) &&
      !allMeetings?.length ? (
        <Alert
          className="mb-4"
          type="warning"
          title={`It was not possible to validate if you already have a meeting this month.`}
          list={[`Please try again${isOnline ? '.' : ' when you are online.'}`]}
        />
      ) : (
        <>
          {hasMeetingHappened && !hasMeetingInCurrentMonth && (
            <Alert
              className="mb-4"
              type="warning"
              title={`You can only add meetings that happend in ${monthName}.`}
              list={[
                'The deadline for adding meeting attendance registers & notes is the last day of every month.',
              ]}
            />
          )}
          {hasMeetingHappened !== undefined && !hasMeetingInCurrentMonth && (
            <DatePicker
              label={
                hasMeetingHappened
                  ? 'What day did the meeting happen?'
                  : 'What day will the meeting happen?'
              }
              placeholderText="Tap to choose a date"
              selected={date}
              onChange={setDate}
              minDate={hasMeetingHappened ? minDate : currentDate}
              maxDate={hasMeetingHappened ? currentDate : undefined}
            />
          )}
          {hasMeetingHappened !== undefined && hasMeetingInCurrentMonth && (
            <Alert
              className="mb-4"
              type="warning"
              title={`You cannot submit another meeting this month - you have already submitted a meeting for ${monthName}!`}
              list={['You can only submit 1 meeting per month.']}
            />
          )}
        </>
      )}
    </>
  );
};
