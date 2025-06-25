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
  ScoreCard,
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
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Form, currentActivityKey, isViewKey, visitIdKey } from './forms';
import { useAppDispatch } from '@/store';
import {
  PqaActions,
  addCoachVisitInviteForPractitioner,
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
} from '@/store/pqa/pqa.selectors';
import {
  ScheduleEventType,
  ScheduleOrStartProps,
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
import {
  PointsUserSummary,
  UpdateVisitPlannedVisitDateModelInput,
  Visit,
  VisitModelInput,
} from '@ecdlink/graphql';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ExclamationIcon } from '@heroicons/react/solid';
import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';
import { CalendarAddEventInfo } from '@/pages/calendar/components/calendar-add-event/calendar-add-event.types';
import { isDateWithinThreeMonths } from './timeline/utils';
import { getReAccreditationStepData } from './timeline/re-accreditation/step';
import { getUserPointsSummaryForCoach } from '@/store/points/points.actions';
import { pointsConstants } from '@/constants/points';
import ROUTES from '@/routes/routes';
import { coachSelectors } from '@/store/coach';
import { notificationsSelectors } from '@/store/notifications';
import { disableBackendNotification } from '@/store/notifications/notifications.actions';

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
  const { isLoading: isAddingSupportVisit } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_SUPPORT_VISIT_FORM_DATA
  );
  const { isLoading: isAddingRequestedSupportVisit } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_REQUESTED_SUPPORT_VISIT_FORM_DATA
  );
  const { isLoading: isAddingVisit } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_VISIT_FORM_DATA
  );

  const isLoadingSyncData =
    isAddingSupportVisit || isAddingRequestedSupportVisit || isAddingVisit;

  const { practitionerId } = useParams<PractitionerJourneyParams>();

  const coach = useSelector(coachSelectors.getCoach);
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

  const reAccreditationVisitData =
    timeline?.reAccreditationVisits &&
    getReAccreditationStepData({
      reAccreditationVisits: timeline?.reAccreditationVisits,
      currentRating: currentReAccreditationRating,
    });

  const isUserEnableToStartPqaVisit = timeline?.prePQASiteVisits?.every(
    (item) => item?.attended
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

  const getTimeline = useCallback(async () => {
    await appDispatch(getPractitionerTimeline({ userId: practitionerId }));
  }, [practitionerId]);

  const onSchedule = ({
    eventType,
    visit,
    visitEventId,
    visitTypeName,
  }: ScheduleProps) => {
    const today = new Date();
    //const event: CalendarAddEventInfo = !!visitEventId
    const event: any = !!visitEventId
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
          //maxDate: new Date(visit.plannedVisitDate).toISOString(),
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
                visitName: visitTypeName,
              },
            },
          },
        };

    calendarAddEvent({
      event,
      onUpdated: (isNew: boolean, event: CalendarEventModel) => {
        if (!!visit) {
          const payload: UpdateVisitPlannedVisitDateModelInput = {
            visitId: visit.id,
            plannedVisitDate: event.start,
            eventId: event.id,
          };
          appDispatch(pqaActions.updateVisitPlannedVisitDate(payload));
          appDispatch(pqaThunkActions.updateVisitPlannedVisitDate(payload));
        } else {
          if (visitTypeName === visitTypes.requestedVisit.description) {
            const payload: VisitModelInput = {
              practitionerId: practitionerId,
              coachId: coach?.id,
              attended: false,
              eventId: event.id,
              actualVisitDate: event.start,
              plannedVisitDate: event.start,
            };

            appDispatch(addCoachVisitInviteForPractitioner(payload));
            getTimeline();
          }
        }
      },
      onCancel: () => {},
    });
  };

  const scheduleVisitNotifications = useSelector(
    notificationsSelectors.getAllNotifications
  ).filter(
    (item) =>
      item?.message?.cta?.includes('[[ScheduleVisit]]') &&
      item?.message?.action?.includes(practitionerId) &&
      item?.message?.title?.includes('requested a visit')
  );

  const removeNotifications = async () => {
    if (scheduleVisitNotifications && scheduleVisitNotifications?.length > 0) {
      scheduleVisitNotifications.map((notification) => {
        appDispatch(
          disableBackendNotification({
            notificationId: notification.message.reference ?? '',
          })
        );
      });
    }
  };

  const onScheduleOrStart = ({
    scheduleStartText,
    eventType,
    visit,
    visitEventId,
    visitTypeName,
  }: ScheduleOrStartProps) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          className="bg-white"
          icon={'QuestionMarkCircleIcon'}
          iconColor="white"
          iconBorderColor="infoMain"
          importantText={`Would you like to schedule or start the ${scheduleStartText}?`}
          detailText={`Tap schedule to go to the calendar or, if you are starting the ${scheduleStartText} now, tap start.`}
          actionButtons={[
            {
              text: 'Schedule in calendar',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                onSubmit();
                removeNotifications();
                onSchedule({ visit, visitEventId, eventType, visitTypeName });
                syncData();
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
                removeNotifications();
                onStart(visitTypeName);
                syncData();
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

  const incompleteCoachVisits =
    !!timeline && !!timeline.requestedCoachVisits
      ? timeline.requestedCoachVisits.filter((visit) => !visit?.attended)
      : [];

  const uncompletedVisits = [
    ...incompleteCoachVisits,
    ...uncompletedPrePqaVisits,
    ...(isUserEnableToStartPqaVisit
      ? [...uncompletedPqaVisits, ...uncompletedReAccreditationVisits]
      : []),
  ];

  const getScheduleVisitTypeInfo = (
    visit: Visit
  ):
    | { eventType: ScheduleEventType; scheduleStartText: string }
    | undefined => {
    if (visit.visitType?.name === visitTypes.pqa.firstPQA.name)
      return {
        eventType: visitTypes.pqa.firstPQA.eventType,
        scheduleStartText: visitTypes.pqa.firstPQA.scheduleStartText,
      };
    if (visit.visitType?.name === visitTypes.pqa.followUp.name)
      return {
        eventType: visitTypes.pqa.followUp.eventType,
        scheduleStartText: visitTypes.pqa.followUp.scheduleStartText,
      };
    if (visit.visitType?.name === visitTypes.reaccreditation.first.name)
      return {
        eventType: visitTypes.reaccreditation.first.eventType,
        scheduleStartText: visitTypes.reaccreditation.first.scheduleStartText,
      };
    if (visit.visitType?.name === visitTypes.reaccreditation.second.name)
      return {
        eventType: visitTypes.reaccreditation.second.eventType,
        scheduleStartText: visitTypes.reaccreditation.second.scheduleStartText,
      };
    if (visit.visitType?.name === visitTypes.reaccreditation.third.name)
      return {
        eventType: visitTypes.reaccreditation.third.eventType,
        scheduleStartText: visitTypes.reaccreditation.third.scheduleStartText,
      };
    if (visit.visitType?.name === visitTypes.reaccreditation.followUp.name)
      return {
        eventType: visitTypes.reaccreditation.followUp.eventType,
        scheduleStartText:
          visitTypes.reaccreditation.followUp.scheduleStartText,
      };
    if (visit.visitType?.name === visitTypes.prePqa.first.name)
      return {
        eventType: visitTypes.prePqa.first.eventType,
        scheduleStartText: visitTypes.prePqa.first.scheduleStartText,
      };
    if (visit.visitType?.name === visitTypes.prePqa.second.name)
      return {
        eventType: visitTypes.prePqa.second.eventType,
        scheduleStartText: visitTypes.prePqa.second.scheduleStartText,
      };
    if (visit.visitType?.name === visitTypes.supportVisit.name)
      return {
        eventType: visitTypes.supportVisit.eventType,
        scheduleStartText: visitTypes.supportVisit.scheduleStartText,
      };
  };

  const getScheduleOrStartProps = (
    visit: Visit
  ): ScheduleOrStartProps | undefined => {
    const values = getScheduleVisitTypeInfo(visit);
    if (!values) return undefined;
    return {
      visit: visit,
      visitEventId: visit.eventId,
      visitTypeName: visit.visitType?.name || '',
      ...values,
    };
  };

  const currentVisit = uncompletedVisits
    ?.filter(filterVisit)
    ?.map((visit): MenuListDataItem<{ visitId?: string }> => {
      const isLate = new Date(visit?.plannedVisitDate || '') < new Date();
      const plannedVisitDate = !!visit?.plannedVisitDate
        ? new Date(visit?.plannedVisitDate).toLocaleDateString(
            'en-ZA',
            dateLongMonthOptions
          )
        : '';
      const options = getScheduleOrStartProps(visit as Visit);

      return {
        showIcon: true,
        menuIcon: isLate ? 'ExclamationIcon' : 'ClipboardListIcon',
        iconColor: 'white',
        titleStyle: 'text-textDark',
        title:
          !!visit?.eventId && !!options
            ? `Start ${options.scheduleStartText}`
            : visit?.visitType?.description || 'Visit',
        subTitle: `${!!visit?.eventId ? 'Scheduled ' : ''}${plannedVisitDate}`,
        subTitleStyle: 'text-textDark',
        iconBackgroundColor: isLate ? 'alertMain' : 'primary',
        backgroundColor: 'uiBg',
        extraData: { visitId: visit?.id },
        onActionClick: () => {
          if (visit?.eventId || !options) {
            onStart(String(visit?.visitType?.name));
          } else {
            onScheduleOrStart(options);
          }
        },
      };
    })
    .shift();

  const onStartRequestedSupportVisit = (visitId: string) => {
    if (!!visitId) {
      window.sessionStorage.setItem(
        currentActivityKey,
        visitTypes.supportVisit.name
      );
      window.sessionStorage.setItem(visitIdKey, visitId);
      setShowForm(true);
    }
  };

  const onSupportVisit = () => {
    const options: ScheduleOrStartProps = {
      visitTypeName: visitTypes.requestedVisit.description,
      eventType: visitTypes.supportVisit.eventType,
      scheduleStartText: visitTypes.supportVisit.scheduleStartText,
    };

    onScheduleOrStart(options);
  };

  const onFormBack = async () => {
    window.sessionStorage.removeItem(currentActivityKey);
    window.sessionStorage.removeItem(visitIdKey);
    window.sessionStorage.setItem(isViewKey, 'false');
    setShowForm(false);

    await appDispatch(getPractitionerTimeline({ userId: practitionerId }));
  };

  const onView = async (visit: Visit) => {
    await appDispatch(
      getVisitDataForVisitId({ visitId: visit.id, visitType: 'pre-pqa' })
    );

    if (
      visit.visitType?.name === generalSupportVisitTypes.practitioner_visit ||
      visit.visitType?.name === generalSupportVisitTypes.practitioner_call ||
      visit.visitType?.name === generalSupportVisitTypes.visit ||
      visit.visitType?.name === generalSupportVisitTypes.call
    ) {
      window.sessionStorage.setItem(
        currentActivityKey,
        visitTypes.supportVisit.name
      );
      window.sessionStorage.setItem(visitIdKey, visit.id);
    } else {
      window.sessionStorage.setItem(currentActivityKey, visit.visitType?.name!);
    }

    window.sessionStorage.setItem(isViewKey, 'true');
    setShowForm(true);
  };

  const syncData = useCallback(async () => {
    if (!isOnline) return;

    await appDispatch(pqaThunkActions.addSupportVisitFormData());
    await appDispatch(pqaThunkActions.addRequestedSupportVisitFormData());
    await appDispatch(pqaThunkActions.addVisitFormData());

    getTimeline();
  }, [getTimeline, isOnline]);

  useLayoutEffect(() => {
    if (selectedForm) {
      setShowForm(true);
    }
  }, [selectedForm]);

  useEffect(() => {
    if ((!wasOnline && isOnline) || (previousShowForm && !showForm)) {
      syncData();
    }
  }, [getTimeline, isOnline, previousShowForm, showForm, syncData, wasOnline]);

  useEffect(() => {
    if (lastAttendedReAccreditationFollowUpVisit?.id) {
      appDispatch(
        getVisitDataForVisitId({
          visitId: lastAttendedReAccreditationFollowUpVisit.id,
          visitType: 're-accreditation-follow-up-visit',
        })
      );
    }
  }, [lastAttendedReAccreditationFollowUpVisit, practitionerId]);

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

  // POINTS
  const [userPointsSummaries, setUserPointsSummaries] = useState<
    PointsUserSummary[]
  >([]);

  useEffect(() => {
    const currentDate = new Date();
    appDispatch(
      getUserPointsSummaryForCoach({
        userId: practitionerId,
        startDate: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        ),
        endDate: currentDate,
      })
    ).then((userPoints) => {
      if (Array.isArray(userPoints.payload)) {
        setUserPointsSummaries(userPoints.payload as PointsUserSummary[]);
      } else {
        setUserPointsSummaries([]);
      }
    });
  }, [appDispatch, practitionerId]);

  const userPointsTotalForYear = useMemo(
    () =>
      userPointsSummaries?.reduce(
        (total, current) => (total += current?.pointsYTD),
        0
      ),
    [userPointsSummaries]
  );

  const pointsMax = practitioner?.isPrincipal
    ? pointsConstants.principalOrAdminYearlyMax
    : pointsConstants.practitionerYearlyMax;

  const percentageScore = (userPointsTotalForYear / pointsMax) * 100;

  if (
    (showForm && isView) ||
    (showForm && currentVisit?.extraData?.visitId) ||
    (showForm && selectedForm)
  ) {
    return (
      <Form onBack={onFormBack} visitId={currentVisit?.extraData?.visitId} />
    );
  }

  //add coming soon
  const isComingSoon = false;

  if (isComingSoon) {
    return (
      <BannerWrapper
        size="small"
        renderOverflow
        displayOffline={!isOnline}
        title="Site Visits"
        subTitle={`${practitionerFirstName} ${practitioner?.user?.surname}`}
        onBack={() => history.goBack()}
        className="p-4"
        renderBorder
        isLoading={isLoadingTimeline}
      >
        <Typography color="textDark" text={`Coming soon`} type={'h2'} />
      </BannerWrapper>
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
      renderBorder
      isLoading={isLoadingTimeline}
    >
      {isLoadingSyncData ? (
        <>
          <LoadingSpinner
            size="medium"
            spinnerColor="primary"
            backgroundColor="uiLight"
          />
          <Typography
            className="mt-4 mb-2 text-center"
            type="body"
            text="Syncing journey..."
          />
        </>
      ) : (
        <>
          {!!currentVisit && (
            <StackedList
              isFullHeight={false}
              type="MenuList"
              listItems={[currentVisit]}
            />
          )}
          <ScoreCard
            className="mt-5"
            mainText={`${userPointsTotalForYear}`}
            hint={`points earned so far in ${new Date().getFullYear()}`}
            currentPoints={userPointsTotalForYear}
            maxPoints={pointsMax}
            barBgColour="uiLight"
            barColour={
              percentageScore < 60
                ? 'errorMain'
                : percentageScore < 80
                ? 'secondary'
                : 'successMain'
            }
            bgColour="uiBg"
            textColour="black"
            onClick={() =>
              history.push(
                ROUTES.COACH.PRACTITIONER_POINTS.replace(
                  ':userId',
                  practitioner?.userId || ''
                )
              )
            }
          />
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
            onClick={() => onSupportVisit()}
          />
          {!!timeline && (
            <Steps
              items={timelineSteps({
                practitionerId,
                timeline,
                onView,
                onStart,
                onScheduleOrStart,
                onStartRequestedSupportVisit(visitId) {
                  onStartRequestedSupportVisit(visitId);
                },
                isLoading,
                isOnline,
                visits: uncompletedVisits,
                currentReAccreditationRating,
              })}
              typeColor={{ completed: 'successMain' }}
            />
          )}
        </>
      )}
    </BannerWrapper>
  );
};
