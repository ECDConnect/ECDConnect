import {
  ActionModal,
  Alert,
  ButtonGroup,
  ButtonGroupOption,
  ButtonGroupTypes,
  DatePicker,
  DialogPosition,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import { AddMeetingProps, AddMeetingRouteParams } from '../index.types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import {
  ClubActions,
  getActivityMeetRegularDetails,
} from '@/store/club/club.actions';
import { useAppDispatch } from '@/store';
import { useDialog, usePrevious, useSnackbar } from '@ecdlink/core';
import { useHistory, useParams } from 'react-router';

export const Step1 = ({
  setIsEnabledButton,
  setStep1,
  clubId,
}: AddMeetingProps) => {
  const [hasMeetingHappened, setHasMeetingHappened] = useState<
    boolean | undefined
  >();
  const [date, setDate] = useState<Date | null>();

  const { isOnline } = useOnlineStatus();

  const appDispatch = useAppDispatch();

  const { showMessage } = useSnackbar();

  const dialog = useDialog();

  const history = useHistory();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const details = useSelector(
    clubSelectors.getActivityMeetRegularDetailsSelector(club?.id ?? '')
  );

  const { eventId } = useParams<AddMeetingRouteParams>();

  const upcomingMeeting = details?.upcomingMeetings?.find(
    (item) => item?.eventId === eventId
  );
  const upcomingMeetingDate = new Date(upcomingMeeting?.meetingDate);
  const upcomingMeetingMonth = upcomingMeetingDate.getMonth();
  const upcomingMeetingYear = upcomingMeetingDate.getFullYear();

  const isUpcomingMeetingAttended = details?.pastMeetings?.some(
    (item) => item?.eventId === eventId
  );
  const wasUpcomingMeetingAttended = usePrevious(isUpcomingMeetingAttended);

  const allMeetings = useMemo(
    () => [
      ...(details?.pastMeetings ?? []),
      ...(details?.upcomingMeetings ?? []),
    ],
    [details?.pastMeetings, details?.upcomingMeetings]
  );

  const currentDate = useMemo(() => new Date(), []);
  const minDate = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    [currentDate]
  );

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const isUpcomingMeetingInCurrentMonth =
    upcomingMeetingMonth === currentMonth &&
    upcomingMeetingYear === currentYear;
  const wasUpcomingMeetingInCurrentMonth = usePrevious(
    isUpcomingMeetingInCurrentMonth
  );

  const hasMeetingInCurrentMonth = allMeetings.some(
    (meeting) =>
      new Date(meeting?.meetingDate).getMonth() === currentMonth &&
      new Date(meeting?.meetingDate).getFullYear() === currentYear
  );

  const { isLoading, isFulfilled, wasLoading, isRejected, error } =
    useThunkFetchCall('clubs', ClubActions.GET_ACTIVITY_MEET_REGULAR_DETAILS);

  const yesNoOptions: ButtonGroupOption<boolean>[] = [
    {
      text: 'Yes',
      value: true,
      disabled: !!upcomingMeeting || isUpcomingMeetingAttended,
    },
    {
      text: 'No',
      value: false,
      disabled: !!upcomingMeeting || isUpcomingMeetingAttended,
    },
  ];

  const showAlertDialog = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            iconColor="alertMain"
            iconBorderColor="errorBg"
            title="You cannot record this meeting"
            detailText="You can only record meetings for the current month, and you can only record one meeting per month."
            icon="ExclamationCircleIcon"
            actionButtons={[
              {
                colour: 'primary',
                text: 'Close',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'XIcon',
                onClick: () => {
                  onClose();
                  history.goBack();
                },
              },
            ]}
          />
        );
      },
    });
  }, [dialog, history]);

  useEffect(() => {
    if (
      (isUpcomingMeetingAttended && !wasUpcomingMeetingAttended) ||
      (!!upcomingMeeting &&
        !isUpcomingMeetingInCurrentMonth &&
        wasUpcomingMeetingInCurrentMonth === undefined)
    ) {
      showAlertDialog();
    }
  }, [
    isUpcomingMeetingAttended,
    isUpcomingMeetingInCurrentMonth,
    showAlertDialog,
    upcomingMeeting,
    wasUpcomingMeetingAttended,
    wasUpcomingMeetingInCurrentMonth,
  ]);

  useEffect(() => {
    if (!upcomingMeeting) return;

    setHasMeetingHappened(!!upcomingMeeting);
    setDate(new Date(`${new Date().toISOString()?.split('T')?.[0]}T00:00:00`));
  }, [upcomingMeeting]);

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

  const renderContent = useMemo(() => {
    if (isUpcomingMeetingAttended) {
      return (
        <Alert
          className="mb-4"
          type="warning"
          title={`You have already submitted your attendance for this meeting.`}
          list={[`You can only submit attendance once.`]}
        />
      );
    }

    if (
      hasMeetingHappened !== undefined &&
      (!isOnline || error) &&
      !allMeetings?.length
    ) {
      return (
        <Alert
          className="mb-4"
          type="warning"
          title={`It was not possible to validate if you already have a meeting this month.`}
          list={[`Please try again${isOnline ? '.' : ' when you are online.'}`]}
        />
      );
    }

    return (
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
            disabled={!!upcomingMeeting}
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
    );
  }, [
    allMeetings?.length,
    currentDate,
    date,
    error,
    hasMeetingHappened,
    hasMeetingInCurrentMonth,
    isOnline,
    isUpcomingMeetingAttended,
    minDate,
    monthName,
    upcomingMeeting,
  ]);

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
        selectedOptions={hasMeetingHappened}
      />
      {renderContent}
    </>
  );
};
