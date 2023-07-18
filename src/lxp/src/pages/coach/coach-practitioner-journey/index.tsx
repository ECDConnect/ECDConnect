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
import {
  Form,
  Rating,
  currentActivityKey,
  isViewKey,
  visitIdKey,
} from './forms';
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
  getVisitDataForVisitIdSelectorByUserId,
} from '@/store/pqa/pqa.selectors';
import {
  ScheduleProps,
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
import { UpdateVisitPlannedVisitDateModelInput, Visit } from '@ecdlink/graphql';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ExclamationIcon } from '@heroicons/react/solid';
import { addDays } from 'date-fns';
import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';
import { CalendarAddEventInfo } from '@/pages/calendar/components/calendar-add-event/calendar-add-event.types';
import { calendarSelectors } from '@/store/calendar';
import { followUpDeadline } from './timeline/utils';
import {
  newReAccreditationFollowUpId,
  newReAccreditationVisitId,
} from './timeline/re-accreditation/step-accordion-content';
import {
  newPqaFollowUpId,
  newPqaVisitId,
} from './timeline/pqa/step-accordion-content';
import { reAccreditationFollowUpQuestion } from './forms/general-support-visit';

export const CoachPractitionerJourney = () => {
  const [showForm, setShowForm] = useState(false);
  const { state: routeState } =
    useLocation<CoachPractitionerJourneyPageState>();
  const [pqaRating, setPqaRating] = useState<Rating | undefined>();
  const [reAccreditationRating, setReAccreditationRating] = useState<
    Rating | undefined
  >();
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
  const lastAttendedPqaVisit = useSelector(
    getLastCoachAttendedVisitByUserId(
      practitionerId,
      'pQASiteVisits',
      'pqa_visit_follow_up'
    )
  );
  const lastAttendedPqaFollowUpVisit = useSelector(
    getLastCoachAttendedFollowUpVisitByUserId(
      practitionerId,
      'pQASiteVisits',
      'pqa_visit_follow_up'
    )
  );
  const lastAttendedReAccreditationVisit = useSelector(
    getLastCoachAttendedVisitByUserId(
      practitionerId,
      'reAccreditationVisits',
      're_accreditation_follow_up'
    )
  );
  const lastAttendedReAccreditationFollowUpVisit = useSelector(
    getLastCoachAttendedFollowUpVisitByUserId(
      practitionerId,
      'reAccreditationVisits',
      're_accreditation_follow_up'
    )
  );

  const reAccreditationFollowUpAnswers = useSelector(
    getVisitDataForVisitIdSelectorByUserId(
      practitionerId,
      lastAttendedReAccreditationFollowUpVisit?.id || '',
      'reAccreditationFollowUpVisitPreviousFormData'
    )
  );
  const previousReAccreditationFollowUpAnswer =
    reAccreditationFollowUpAnswers?.find(
      (item) => item.question === reAccreditationFollowUpQuestion
    )?.questionAnswer;

  const pqaRating1 = timeline?.pQARating1;
  const pqaRating2 = timeline?.pQARating2;
  const pqaRating3 = timeline?.pQARating3;
  const reAccreditationRating1 = timeline?.reAccreditationRating1;
  const reAccreditationRating2 = timeline?.reAccreditationRating2;
  const reAccreditationRating3 = timeline?.reAccreditationRating3;

  const pqaRatingColorList = [
    pqaRating1?.overallRatingColor,
    pqaRating2?.overallRatingColor,
    pqaRating3?.overallRatingColor,
    pqaRating?.color,
  ];

  const reAccreditationRatingColorList = [
    reAccreditationRating1?.overallRatingColor,
    reAccreditationRating2?.overallRatingColor,
    reAccreditationRating3?.overallRatingColor,
    reAccreditationRating?.color,
  ];

  const reAccreditationRatingOrangeColorCount =
    reAccreditationRatingColorList.filter((item) => item === 'Warning').length;

  // INFO: The user can start the follow-up after 14 days, but if it's the last visit (third one), this number changes to 60 days
  const currentPqaFollowUpDeadline = pqaRating3?.overallRating
    ? followUpDeadline.lastVisit
    : followUpDeadline.default;
  const isPQAFollowUpDeadline =
    addDays(
      new Date(lastAttendedPqaVisit?.insertedDate),
      currentPqaFollowUpDeadline
    ) <= new Date();
  const isPQAFollowUp =
    currentPqaRating.rating?.overallRating &&
    !lastAttendedPqaVisit?.visitType?.name?.includes(
      visitTypes.pqa.thirdPQA.name
    );

  const currentReAccreditationFollowUpDeadline = followUpDeadline.default;
  const isReAccreditationFollowUpDeadline =
    addDays(
      new Date(lastAttendedReAccreditationVisit?.insertedDate),
      currentReAccreditationFollowUpDeadline
    ) <= new Date();
  const isReAccreditationFollowUp =
    currentReAccreditationRating.rating?.overallRating &&
    !lastAttendedReAccreditationVisit?.visitType?.name?.includes(
      visitTypes.reaccreditation.third.name
    );

  const isNewPqaVisitFromBadRating =
    !pqaRatingColorList.some((item) => item === 'Success') &&
    !pqaRating3?.overallRating &&
    timeline?.pQASiteVisits?.every(
      (item) =>
        item?.attended && item?.visitType?.name !== visitTypes.pqa.followUp.name
    ) &&
    new Date(lastAttendedPqaFollowUpVisit?.insertedDate) >
      new Date(lastAttendedPqaVisit?.insertedDate);

  const isAllCompletedVisits = timeline?.pQASiteVisits
    ?.filter(
      (item) => !item?.visitType?.name?.includes(visitTypes.pqa.followUp.name)
    )
    ?.some((item) => !item?.attended);
  const isNewPqaVisitFromBadReAccreditationRating =
    isAllCompletedVisits && reAccreditationRatingOrangeColorCount === 2;

  const isNewPqaVisit =
    isNewPqaVisitFromBadRating || isNewPqaVisitFromBadReAccreditationRating;

  const isReAccreditationNewVisit = true;
  // !reAccreditationRating3?.overallRating &&
  // timeline?.reAccreditationVisits?.every(
  //   (item) =>
  //     item?.attended &&
  //     item?.visitType?.name !== visitTypes.reaccreditation.followUp.name
  // ) &&
  // new Date(lastAttendedReAccreditationFollowUpVisit?.insertedDate) >
  //   new Date(lastAttendedReAccreditationVisit?.insertedDate);

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
  const uncompletedPqaVisits =
    (filteredPqaVisits?.length && filteredPqaVisits) ||
    // TODO: check if add this visit manually makes sense
    (isNewPqaVisit
      ? [
          {
            id: newPqaVisitId,
            attended: false,
            visitType: {
              description: 'First PQA',
              name: visitTypes.pqa.firstPQA.name,
              order: 1,
            },
            // TODO add schedule
            plannedVisitDate: new Date(),
          } as Visit,
        ]
      : []);

  const filteredReAccreditionVisits = timeline?.reAccreditationVisits?.filter(
    (visit) =>
      !reAccreditationFormData?.some((item) => item.visitId === visit?.id) &&
      !visit?.attended
  );
  const uncompletedReAccreditationVisits =
    (filteredReAccreditionVisits?.length && filteredReAccreditionVisits) ||
    // TODO: check if add this visit manually makes sense
    (isReadyToReAccreditationVisit || isReAccreditationNewVisit
      ? [
          {
            id: newReAccreditationVisitId,
            attended: false,
            visitType: {
              description: 'Annual re-accreditation PQA',
              name: visitTypes.reaccreditation.first.name,
              order: 1,
            },
            // TODO add schedule
            plannedVisitDate: new Date(),
          } as Visit,
        ]
      : []);

  const uncompletedPqaFollowUpVisit =
    isPQAFollowUpDeadline && isPQAFollowUp && !isNewPqaVisit
      ? [
          {
            id: newPqaFollowUpId,
            attended: false,
            visitType: {
              description: 'Start follow-up PQA visit',
              name: visitTypes.pqa.followUp.name,
              order: 1,
            },
            // TODO add schedule
            plannedVisitDate: new Date(),
          } as Visit,
        ]
      : [];

  const uncompletedReAccreditationFollowUpVisit =
    isReAccreditationFollowUpDeadline && isReAccreditationFollowUp
      ? [
          {
            id: newReAccreditationFollowUpId,
            attended: false,
            visitType: {
              description: 'Start re-accreditation follow up visit',
              name: visitTypes.reaccreditation.followUp.name,
              order: 1,
            },
            // TODO add schedule
            plannedVisitDate: new Date(),
          } as Visit,
        ]
      : [];

  const uncompletedVisits = [
    ...uncompletedPrePqaVisits,
    ...uncompletedPqaVisits,
    ...uncompletedReAccreditationVisits,
    ...uncompletedPqaFollowUpVisit,
    ...uncompletedReAccreditationFollowUpVisit,
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

    if (
      (isPqaOrangeRating || isPqaRedRating) &&
      !!lastAttendedPqaVisit?.insertedDate
    ) {
      return (
        <Alert
          className="mt-4"
          type={isPqaRedRating ? 'error' : 'warning'}
          title={isPqaRedRating ? 'Red PQA rating' : 'Orange PQA rating'}
          titleColor="textDark"
          message={new Date(
            lastAttendedPqaVisit?.insertedDate
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
      !!lastAttendedReAccreditationVisit?.insertedDate
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
            lastAttendedReAccreditationVisit?.insertedDate
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

    return <></>;
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
    (showForm && selectedForm === visitTypes.supportVisit) ||
    (showForm && selectedForm === visitTypes.pqa.followUp.name)
  ) {
    return (
      <Form
        onBack={onFormBack}
        visitId={currentVisit?.extraData?.visitId}
        setPqaRating={setPqaRating}
        setReAccreditationRating={setReAccreditationRating}
      />
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
                practitionerId,
                timeline,
                practitionerEvents,
                onView,
                onStart,
                onScheduleOrStart,
                isLoading,
                isOnline,
                visits: uncompletedVisits,
                currentPqaRating,
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
