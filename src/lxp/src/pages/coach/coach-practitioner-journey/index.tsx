import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import {
  Alert,
  AlertType,
  BannerWrapper,
  Button,
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { ReactComponent as BalloonsIcon } from '@/assets/balloons.svg';
import {
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
  getCurrentPQaRatingByUserId,
  getLastCoachAttendedVisitByUserId,
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
  getFormattedDateInYearsMonthsAndDays,
  parseBool,
  usePrevious,
} from '@ecdlink/core';
import { Visit } from '@ecdlink/graphql';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ExclamationIcon } from '@heroicons/react/solid';
import {
  followUpDeadline,
  newFollowUpId,
} from './timeline/pqa-site-visits-step';
import { addDays } from 'date-fns';

export const CoachPractitionerJourney = () => {
  const [showForm, setShowForm] = useState(false);

  const selectedForm = window.sessionStorage.getItem(currentActivityKey);
  const isView = parseBool(window.sessionStorage.getItem(isViewKey) || '');

  const { isOnline } = useOnlineStatus();
  const wasOnline = usePrevious(isOnline);
  const previousShowForm = usePrevious(showForm);

  const history = useHistory();
  const appDispatch = useAppDispatch();

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
  const lastAttendedVisit = useSelector(
    getLastCoachAttendedVisitByUserId(practitionerId)
  );

  const pqaRating3 = timeline?.pQARating3;

  // INFO: The user can start the follow-up after 14 days, but if it's the last visit (third one), this number changes to 60 days
  const currentFollowUpDeadline = pqaRating3?.overallRating
    ? followUpDeadline.lastVisit
    : followUpDeadline.default;
  const isPQAFollowUpDeadline =
    addDays(
      new Date(lastAttendedVisit?.insertedDate),
      currentFollowUpDeadline
    ) <= new Date();
  const isPQAFollowUp =
    currentPqaRating.rating?.overallRating &&
    !lastAttendedVisit?.visitType?.name?.includes(visitTypes.pqa.thirdPQA.name);

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

  const uncompletedFollowUpVisit =
    isPQAFollowUpDeadline && isPQAFollowUp
      ? [
          {
            id: newFollowUpId,
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

  const uncompletedVisits = [
    ...uncompletedPrePqaVisits,
    ...uncompletedPqaVisits,
    ...uncompletedReAccreditationVisits,
    ...uncompletedFollowUpVisit,
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

  // useLayoutEffect(() => {
  //   getTimeline();
  // }, [getTimeline]);

  // useEffect(() => {
  //   if ((!wasOnline && isOnline) || (previousShowForm && !showForm)) {
  //     getTimeline();
  //   }
  // }, [getTimeline, isOnline, previousShowForm, showForm, wasOnline]);

  const renderAlert = () => {
    const isRedRating =
      currentPqaRating?.rating?.overallRatingColor === 'Error';
    const isOrangeRating =
      currentPqaRating?.rating?.overallRatingColor === 'Warning';

    if (!isOrangeRating && !isRedRating) return;

    return (
      <Alert
        className="mt-4"
        type={isRedRating ? 'error' : 'warning'}
        title={isRedRating ? 'Red PQA rating' : 'Orange PQA rating'}
        titleColor="textDark"
        message={new Date(lastAttendedVisit?.insertedDate).toLocaleDateString(
          'en-ZA',
          dateLongMonthOptions
        )}
        messageColor="textMid"
        customIcon={
          <div
            className={`${
              isRedRating ? 'bg-errorMain' : 'bg-alertMain'
            } flex h-12 w-12 items-center justify-center rounded-full`}
          >
            <ExclamationIcon className="w-5 text-white" />
          </div>
        }
      />
    );
  };

  if (
    (showForm && isView) ||
    (showForm && currentVisit?.extraData?.visitId) ||
    (showForm && selectedForm === visitTypes.supportVisit) ||
    (showForm && selectedForm === visitTypes.pqa.followUp.name)
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
                onView,
                onStart,
                isLoading,
                isOnline,
                visits: uncompletedVisits,
                currentPqaRating,
              })}
              typeColor={{ completed: 'successMain' }}
            />
          )}
        </>
      )}
    </BannerWrapper>
  );
};
