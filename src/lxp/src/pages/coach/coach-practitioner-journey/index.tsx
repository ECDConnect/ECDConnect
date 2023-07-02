import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import {
  ActionModal,
  Alert,
  AlertType,
  BannerWrapper,
  Button,
  DialogPosition,
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import { ReactComponent as BalloonsIcon } from '@/assets/balloons.svg';
import {
  CoachPractitionerJourneyPageState,
  PractitionerJourneyParams,
  generalSupportVisitTypes,
  visitTypes,
} from './coach-practitioner-journey.types';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Form, currentActivityKey, isViewKey, visitIdKey } from './forms';
import { useAppDispatch } from '@/store';
import {
  PqaActions,
  getPractitionerTimeline,
  getVisitDataForVisitId,
} from '@/store/pqa/pqa.actions';
import {
  getPqaFormDataByIdSelector,
  getPractitionerTimelineByIdSelector,
  getPrePqaFormDataByIdSelector,
  getReAccreditationFormDataByIdSelector,
} from '@/store/pqa/pqa.selectors';
import {
  dateOptions,
  filterVisit,
  sortVisit,
  timelineSteps,
} from './timeline/timeline-steps';
import {
  CalendarEventModel,
  getFormattedDateInYearsMonthsAndDays,
  parseBool,
  useDialog,
  usePrevious,
} from '@ecdlink/core';
import { Visit } from '@ecdlink/graphql';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';
import { CalendarAddEventInfo } from '@/pages/calendar/components/calendar-add-event/calendar-add-event.types';
import { calendarSelectors } from '@/store/calendar';

export const CoachPractitionerJourney: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { state: routeState } =
    useLocation<CoachPractitionerJourneyPageState>();

  const selectedForm = window.sessionStorage.getItem(currentActivityKey);
  const isView = parseBool(window.sessionStorage.getItem(isViewKey) || '');

  const { isOnline } = useOnlineStatus();
  const wasOnline = usePrevious(isOnline);
  const previousShowForm = usePrevious(showForm);

  const history = useHistory();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const calendarAddEvent = useCalendarAddEvent();

  const { isLoading } = useThunkFetchCall(
    'pqa',
    PqaActions.GET_VISIT_DATA_FOR_VISIT_ID
  );
  const { isLoading: isLoadingTimeline } = useThunkFetchCall(
    'pqa',
    PqaActions.GET_PRACTITIONER_TIMELINE
  );

  const { practitionerId } = useParams<PractitionerJourneyParams>();

  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );
  const prePqaFormData = useSelector(
    getPrePqaFormDataByIdSelector(practitionerId)
  );
  const pqaFormData = useSelector(getPqaFormDataByIdSelector(practitionerId));

  const reAccreditationFormData = useSelector(
    getReAccreditationFormDataByIdSelector(practitionerId)
  );

  const practitionerEvents = useSelector(
    calendarSelectors.findCalendarEvents({
      participantUserId: practitionerId,
    })
  );

  const practitionerFirstName = practitioner?.user?.firstName;

  const dateLongMonthOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const onStart = (visitName?: string) => {
    window.sessionStorage.setItem(currentActivityKey, visitName || 'Visit');
    setShowForm(true);
  };

  const onSchedule = (visit: Visit, visitEventId?: string) => {
    const today = new Date();
    const event: CalendarAddEventInfo = !!visitEventId
      ? {
          id: visitEventId,
        }
      : {
          id: '',
          eventType: 'First PQA',
          allDay: false,
          start: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            today.getHours() + 1,
            0,
            0,
            0
          ).toISOString(),
          end: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            today.getHours() + 1,
            30,
            0,
            0
          ).toISOString(),
          minDate: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          ).toISOString(),
          maxDate: new Date(visit.plannedVisitDate).toISOString(),
          name: '',
          description: '',
          participantUserIds: [practitionerId],
          action: {
            buttonName: 'Start visit',
            buttonIcon: 'ArrowCircleRightIcon',
            url: history.location.pathname,
            state: {
              action: 'onStart',
              actionParams: {
                visitName: visit.visitType?.name || '',
              },
            },
          },
        };

    calendarAddEvent({
      event,
      onUpdated: (isNew: boolean, event: CalendarEventModel) => {
        //TODO Update visit.plannedVisitDate to event.start
      },
      onCancel: () => {},
    });
  };

  const onScheduleOrStart = (visit: Visit, visitEventId?: string) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          className="bg-white"
          icon={'QuestionMarkCircleIcon'}
          iconColor="white"
          iconBorderColor="infoMain"
          importantText={`Would you like to schedule or start the first PQA visit?`}
          detailText={
            'Tap schedule to go to the calendar or, if you are starting the first PQA visit now, tap start.'
          }
          actionButtons={[
            {
              text: 'Schedule in calendar',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                onSubmit();
                onSchedule(visit, visitEventId);
              },
              leadingIcon: 'CalendarIcon',
            },
            {
              text: 'Start visit now',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                onSubmit();
                onStart(visit.visitType?.name || '');
              },
              leadingIcon: 'ArrowCircleRightIcon',
            },
          ]}
        />
      ),
    });
  };

  const uncompletedPrePqaVisits =
    timeline?.prePQASiteVisits?.filter(
      (visit) => !prePqaFormData?.some((item) => item.visitId === visit?.id)
    ) ?? [];

  const uncompletedPqaVisits =
    timeline?.pQASiteVisits?.filter(
      (visit) => !pqaFormData?.some((item) => item.visitId === visit?.id)
    ) ?? [];

  const uncompletedReAccreditationVisits =
    timeline?.reAccreditationVisits?.filter(
      (visit) =>
        !reAccreditationFormData?.some((item) => item.visitId === visit?.id)
    ) ?? [];

  const uncompletedVisits = [
    ...uncompletedPrePqaVisits,
    ...uncompletedPqaVisits,
    ...uncompletedReAccreditationVisits,
  ];

  const currentVisit = uncompletedVisits
    ?.filter(filterVisit)
    .sort(sortVisit)
    ?.map(
      (visit): MenuListDataItem<{ visitId?: string }> => ({
        showIcon: true,
        menuIcon: 'ClipboardListIcon',
        iconColor: 'white',
        titleStyle: 'text-textDark',
        title: visit?.visitType?.description || 'Visit',
        subTitle: !!visit?.plannedVisitDate
          ? new Date(visit?.plannedVisitDate).toLocaleDateString(
              'en-ZA',
              dateLongMonthOptions
            )
          : '',
        subTitleStyle: 'text-textDark',
        iconBackgroundColor: 'primary',
        backgroundColor: 'uiBg',
        extraData: { visitId: visit?.id },
        onActionClick: () => onStart(String(visit?.visitType?.name)),
      })
    )
    .shift();

  const onSupportVisit = () => {
    window.sessionStorage.setItem(currentActivityKey, visitTypes.supportVisit);
    setShowForm(true);
  };

  const onFormBack = () => {
    window.sessionStorage.removeItem(currentActivityKey);
    window.sessionStorage.removeItem(visitIdKey);
    window.sessionStorage.setItem(isViewKey, 'false');
    setShowForm(false);
  };

  const onView = async (visit: Visit) => {
    await appDispatch(
      getVisitDataForVisitId({ visitId: visit.id, userId: practitionerId })
    );

    if (
      visit.visitType?.name === generalSupportVisitTypes.visit ||
      visit.visitType?.name === generalSupportVisitTypes.call
    ) {
      window.sessionStorage.setItem(
        currentActivityKey,
        visitTypes.supportVisit
      );
      window.sessionStorage.setItem(visitIdKey, visit.id);
    } else {
      window.sessionStorage.setItem(currentActivityKey, visit.visitType?.name!);
    }

    window.sessionStorage.setItem(isViewKey, 'true');
    setShowForm(true);
  };

  const getTimeline = useCallback(() => {
    appDispatch(getPractitionerTimeline({ userId: practitionerId }));
  }, [appDispatch, practitionerId]);

  useLayoutEffect(() => {
    if (selectedForm) {
      setShowForm(true);
    }
  }, [selectedForm]);

  useLayoutEffect(() => {
    getTimeline();
  }, [getTimeline]);

  useEffect(() => {
    if ((!wasOnline && isOnline) || (previousShowForm && !showForm)) {
      getTimeline();
    }
  }, [getTimeline, isOnline, previousShowForm, showForm, wasOnline]);

  useEffect(() => {
    if (routeState.action === 'onStart') {
      if (routeState?.actionParams?.visitName !== undefined)
        onStart(routeState?.actionParams?.visitName);
    }
  }, []);

  if (
    (showForm && isView) ||
    (showForm && currentVisit?.extraData?.visitId) ||
    (showForm && selectedForm === visitTypes.supportVisit)
  ) {
    return (
      <Form onBack={onFormBack} visitId={currentVisit?.extraData?.visitId} />
    );
  }

  return (
    <BannerWrapper
      size="small"
      renderOverflow
      displayOffline={!isOnline}
      title="SmartStarter journey"
      subTitle={`${practitionerFirstName} ${practitioner?.user?.surname}`}
      onBack={() => history.goBack()}
      className="p-4"
    >
      {isLoadingTimeline ? (
        <LoadingSpinner
          size="medium"
          spinnerColor="primary"
          backgroundColor="uiLight"
          className="tex pt-4"
        />
      ) : (
        <>
          {!!currentVisit && (
            <StackedList
              isFullHeight={false}
              type="MenuList"
              listItems={[currentVisit]}
            />
          )}
          <Alert
            className="mt-4"
            type={
              timeline?.smartSpaceLicenseColor?.toLocaleLowerCase() as AlertType
            }
            variant="flat"
            title={timeline?.smartSpaceLicenseStatus || ''}
            message={
              timeline?.smartSpaceLicenseDate
                ? new Date(timeline.smartSpaceLicenseDate).toLocaleDateString(
                    'en-ZA',
                    dateLongMonthOptions
                  )
                : ''
            }
            messageColor="textMid"
            customIcon={
              timeline?.smartSpaceLicenseColor === 'Success' ? (
                <BalloonsIcon />
              ) : (
                <></>
              )
            }
          />
          <Typography
            className="mt-4 mb-2"
            type="h4"
            text={`${practitionerFirstName} has been a SmartStarter for`}
          />
          <div className="mb-4 flex gap-2">
            <p className="bg-primary text-14 w-fit w-auto rounded-2xl py-1 px-2 font-semibold text-white">
              {getFormattedDateInYearsMonthsAndDays(
                timeline?.starterLicenseDate || new Date()
              )}
            </p>
            {!!timeline?.starterLicenseDate && (
              <Typography
                type="body"
                color="textMid"
                text={`Since ${new Date(
                  timeline.starterLicenseDate
                ).toLocaleDateString('en-ZA', dateOptions)}`}
              />
            )}
          </div>
          <Button
            className="mb-4 w-full"
            color="primary"
            type="outlined"
            textColor="primary"
            icon="LocationMarkerIcon"
            text="Start support visit"
            onClick={onSupportVisit}
          />
          {!!timeline && (
            <Steps
              items={timelineSteps({
                timeline,
                practitionerEvents,
                onView,
                onStart,
                onScheduleOrStart,
                isLoading,
                isOnline,
                visits: uncompletedVisits,
              })}
              typeColor={{ completed: 'successMain' }}
            />
          )}
        </>
      )}
    </BannerWrapper>
  );
};
