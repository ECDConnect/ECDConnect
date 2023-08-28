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
import { pqaActions, pqaThunkActions } from '@/store/pqa';
import {
  getCurrentPQaRatingByUserId,
  getCurrentReAccreditationRatingByUserId,
  getLastCoachAttendedFollowUpVisitByUserId,
  getLastCoachAttendedVisitByUserId,
  getPqaFormDataByIdSelector,
  getPractitionerTimelineByIdSelector,
  getPrePqaFormDataByIdSelector,
  getReAccreditationFormDataByIdSelector,
  getVisitDataByVisitIdSelector,
} from '@/store/pqa/pqa.selectors';
import {
  ScheduleProps,
  dateOptions,
  filterVisit,
  timelineSteps,
} from './timeline/timeline-steps';
import {
  CalendarEventModel,
  getAgeInYearsMonthsAndDays as getCurrentTimeInYearsMonthsAndDays,
  getFormattedDateInYearsMonthsAndDays,
  parseBool,
  useDialog,
  usePrevious,
} from '@ecdlink/core';
import { UpdateVisitPlannedVisitDateModelInput, Visit } from '@ecdlink/graphql';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ExclamationIcon } from '@heroicons/react/solid';
import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';
import { CalendarAddEventInfo } from '@/pages/calendar/components/calendar-add-event/calendar-add-event.types';
import { isDateWithinThreeMonths } from './timeline/utils';
import { reAccreditationFollowUpQuestion } from './forms/general-support-visit/coaching-visit-or-call/constants';
import { getReAccreditationStepData } from './timeline/re-accreditation/step';

export const CoachPractitionerJourney = () => {
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
  const currentPqaRating = useSelector(
    getCurrentPQaRatingByUserId(practitionerId)
  );
  const currentReAccreditationRating = useSelector(
    getCurrentReAccreditationRatingByUserId(practitionerId)
  );
  const lastAttendedPqaVisitWithoutFollowUp = useSelector(
    getLastCoachAttendedVisitByUserId({
      userId: practitionerId,
      visitType: 'pQASiteVisits',
      followUpType: 'pqa_visit_follow_up',
    })
  );
  const lastAttendedReAccreditationVisitWithoutFollowUp = useSelector(
    getLastCoachAttendedVisitByUserId({
      userId: practitionerId,
      visitType: 'reAccreditationVisits',
      followUpType: 're_accreditation_follow_up',
    })
  );
  const lastAttendedReAccreditationFollowUpVisit = useSelector(
    getLastCoachAttendedFollowUpVisitByUserId(
      practitionerId,
      'reAccreditationVisits',
      're_accreditation_follow_up'
    )
  );

  const reAccreditationFollowUpAnswers = useSelector(
    getVisitDataByVisitIdSelector(
      lastAttendedReAccreditationFollowUpVisit?.id || '',
      'reAccreditationFollowUpVisitPreviousFormData'
    )
  );
  const reAccreditationVisitData =
    timeline?.reAccreditationVisits &&
    getReAccreditationStepData({
      reAccreditationVisits: timeline?.reAccreditationVisits,
      currentRating: currentReAccreditationRating,
    });

  const isUserEnableToStartPqaVisit = timeline?.prePQASiteVisits?.every(
    (item) => item?.attended
  );

  const previousReAccreditationFollowUpAnswer =
    reAccreditationFollowUpAnswers?.find(
      (item) => item.question === reAccreditationFollowUpQuestion
    )?.questionAnswer;

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

  // TODO: check this rule
  const isReadyToReAccreditationVisit =
    previousReAccreditationFollowUpAnswer === 'true';

  const onSchedule = ({ eventType, visit, visitEventId }: ScheduleProps) => {
    const today = new Date();
    const event: CalendarAddEventInfo = !!visitEventId
      ? {
          id: visitEventId,
        }
      : {
          id: '',
          eventType,
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
        const payload: UpdateVisitPlannedVisitDateModelInput = {
          visitId: visit.id,
          plannedVisitDate: event.start,
          eventId: event.id,
        };
        appDispatch(pqaActions.updateVisitPlannedVisitDate(payload));
        appDispatch(pqaThunkActions.updateVisitPlannedVisitDate(payload));
      },
      onCancel: () => {},
    });
  };

  const onScheduleOrStart = ({
    eventType,
    visit,
    visitEventId,
  }: ScheduleProps) => {
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
                onSchedule({ visit, visitEventId, eventType });
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

  const filteredPqaVisits = timeline?.pQASiteVisits?.filter(
    (visit) => !pqaFormData?.some((item) => item.visitId === visit?.id)
  );
  const uncompletedPqaVisits = filteredPqaVisits?.length
    ? filteredPqaVisits
    : [];

  const filteredReAccreditationVisits = timeline?.reAccreditationVisits?.filter(
    (visit) =>
      !reAccreditationFormData?.some((item) => item.visitId === visit?.id)
  );
  const uncompletedReAccreditationVisits =
    filteredReAccreditationVisits?.length &&
    isDateWithinThreeMonths(
      reAccreditationVisitData?.currentVisit?.plannedVisitDate || ''
    )
      ? filteredReAccreditationVisits
      : [];

  const uncompletedVisits = [
    ...uncompletedPrePqaVisits,
    ...(isUserEnableToStartPqaVisit
      ? [...uncompletedPqaVisits, ...uncompletedReAccreditationVisits]
      : []),
  ];

  const currentVisit = uncompletedVisits
    ?.filter(filterVisit)
    ?.map((visit): MenuListDataItem<{ visitId?: string }> => {
      const isLate = new Date(visit?.plannedVisitDate || '') < new Date();

      return {
        showIcon: true,
        menuIcon: isLate ? 'ExclamationIcon' : 'ClipboardListIcon',
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
        iconBackgroundColor: isLate ? 'alertMain' : 'primary',
        backgroundColor: 'uiBg',
        extraData: { visitId: visit?.id },
        onActionClick: () => onStart(String(visit?.visitType?.name)),
      };
    })
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
      getVisitDataForVisitId({ visitId: visit.id, visitType: 'pre-pqa' })
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
    if (lastAttendedReAccreditationFollowUpVisit?.id) {
      appDispatch(
        getVisitDataForVisitId({
          visitId: lastAttendedReAccreditationFollowUpVisit.id,
          visitType: 're-accreditation-follow-up-visit',
        })
      );
    }
  }, [appDispatch, lastAttendedReAccreditationFollowUpVisit, practitionerId]);

  const renderAlert = () => {
    const isPqaRedRating =
      currentPqaRating?.rating?.overallRatingColor === 'Error';
    const isPqaOrangeRating =
      currentPqaRating?.rating?.overallRatingColor === 'Warning';

    const isReAccreditationRedRating =
      currentReAccreditationRating?.rating?.overallRatingColor === 'Error';
    const isReAccreditationOrangeRating =
      currentReAccreditationRating?.rating?.overallRatingColor === 'Warning';

    const isPqaGreenRating =
      !isPqaOrangeRating &&
      !isPqaRedRating &&
      !!lastAttendedPqaVisitWithoutFollowUp?.actualVisitDate &&
      !lastAttendedReAccreditationVisitWithoutFollowUp?.actualVisitDate;
    const isReAccreditationGreenRating =
      !isReAccreditationOrangeRating &&
      !isReAccreditationRedRating &&
      !!lastAttendedReAccreditationVisitWithoutFollowUp?.actualVisitDate;

    const { years } = getCurrentTimeInYearsMonthsAndDays(
      lastAttendedPqaVisitWithoutFollowUp?.actualVisitDate
    );

    if (
      (isPqaOrangeRating || isPqaRedRating) &&
      !!lastAttendedPqaVisitWithoutFollowUp?.actualVisitDate
    ) {
      return (
        <Alert
          className="mt-4"
          type={isPqaRedRating ? 'error' : 'warning'}
          title={isPqaRedRating ? 'Red PQA rating' : 'Orange PQA rating'}
          titleColor="textDark"
          message={new Date(
            lastAttendedPqaVisitWithoutFollowUp?.actualVisitDate
          ).toLocaleDateString('en-ZA', dateLongMonthOptions)}
          messageColor="textMid"
          customIcon={
            <div
              className={`${
                isPqaRedRating ? 'bg-errorMain' : 'bg-alertMain'
              } flex h-12 w-12 items-center justify-center rounded-full`}
            >
              <ExclamationIcon className="w-5 text-white" />
            </div>
          }
        />
      );
    }

    if (
      (isReAccreditationRedRating || isReAccreditationOrangeRating) &&
      !!lastAttendedReAccreditationVisitWithoutFollowUp?.actualVisitDate
    ) {
      return (
        <Alert
          className="mt-4"
          type={isReAccreditationRedRating ? 'error' : 'warning'}
          title={
            isReAccreditationRedRating
              ? 'Red reaccreditation rating'
              : 'Orange reaccreditation rating'
          }
          titleColor="textDark"
          message={new Date(
            lastAttendedReAccreditationVisitWithoutFollowUp?.actualVisitDate
          ).toLocaleDateString('en-ZA', dateLongMonthOptions)}
          messageColor="textMid"
          customIcon={
            <div
              className={`${
                isReAccreditationRedRating ? 'bg-errorMain' : 'bg-alertMain'
              } flex h-12 w-12 items-center justify-center rounded-full`}
            >
              <ExclamationIcon className="w-5 text-white" />
            </div>
          }
        />
      );
    }

    if (isPqaGreenRating || isReAccreditationGreenRating) {
      return (
        <Alert
          className="mt-4"
          type="success"
          variant="flat"
          title={
            isPqaGreenRating
              ? 'First PQA received'
              : 'PQA re-accreditation awarded'
          }
          customMessage={
            <div>
              {isReAccreditationGreenRating && (
                <Typography
                  type="body"
                  color="textDark"
                  text={years > 1 ? `${years} years` : `${years || 1} year`}
                />
              )}
              <div className="flex justify-between">
                <Typography
                  className={isPqaGreenRating ? 'pt-2' : ''}
                  type="help"
                  color="textMid"
                  text={new Date(
                    isPqaGreenRating
                      ? lastAttendedPqaVisitWithoutFollowUp.actualVisitDate
                      : lastAttendedReAccreditationVisitWithoutFollowUp?.actualVisitDate
                  ).toLocaleDateString('en-ZA', dateLongMonthOptions)}
                />
                <div className="ml-16 flex">
                  <span className="text-successMain text-xl">●</span>
                  <p
                    className="text-textMid text-12 ml-2"
                    style={{ marginTop: 6 }}
                  >
                    Green rating
                  </p>
                </div>
              </div>
            </div>
          }
          messageColor="textMid"
          customIcon={<BalloonsIcon />}
        />
      );
    }

    return (
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
    );
  };

  useEffect(() => {
    if (routeState?.action === 'onStart') {
      if (routeState?.actionParams?.visitName !== undefined)
        onStart(routeState?.actionParams?.visitName);
    }
  }, [routeState]);

  if (
    (showForm && isView) ||
    (showForm && currentVisit?.extraData?.visitId) ||
    (showForm && selectedForm)
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
          {renderAlert()}
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
                practitionerId,
                timeline,
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
