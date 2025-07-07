import { useAppDispatch } from '@/store';
import {
  PqaActions,
  getPractitionerTimeline,
  getVisitDataForVisitId,
} from '@/store/pqa/pqa.actions';
import {
  getCurrentPQaRatingByUserId,
  getCurrentReAccreditationRatingByUserId,
  getLastCoachAttendedVisitByUserId,
  getPractitionerTimelineByIdSelector,
} from '@/store/pqa/pqa.selectors';
import { getUser } from '@/store/user/user.selectors';
import {
  Alert,
  AlertType,
  Button,
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ViewEvent, timelineSteps } from './timeline/timeline-steps';
import {
  getAgeInYearsMonthsAndDays as getCurrentTimeInYearsMonthsAndDays,
  getFormattedDateInYearsMonthsAndDays,
  parseBool,
  useSessionStorage,
} from '@ecdlink/core';
import {
  dateLongMonthOptions,
  dateOptions,
  filterVisit,
  sortVisit,
} from './timeline/utils';
import { visitTypes } from './index.types';
import {
  Form,
  currentActivityKey,
  isViewKey,
  practitionerVisitIdKey,
} from './forms';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import {
  generalSupportVisitTypes,
  visitTypes as coachVisitTypes,
} from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';
import { ReactComponent as BalloonsIcon } from '@/assets/balloons.svg';
import { ExclamationIcon } from '@heroicons/react/solid';
import { isDateWithinThreeMonths } from '@/pages/coach/coach-practitioner-journey/timeline/utils';

interface PractitionerJourneyProps {
  onIsDisplayFormChange: (value: boolean) => void;
}

export const PractitionerJourney = ({
  onIsDisplayFormChange,
}: PractitionerJourneyProps) => {
  const [showForm, setShowForm] = useState(false);
  const [, setVisitId] = useSessionStorage(practitionerVisitIdKey);

  //add coming soon
  const appDispatch = useAppDispatch();

  const user = useSelector(getUser);
  const userId = user?.id || '';
  const isComingSoon = true;

  const timeline = useSelector(getPractitionerTimelineByIdSelector(userId));
  const currentPqaRating = useSelector(getCurrentPQaRatingByUserId(userId));
  const currentReAccreditationRating = useSelector(
    getCurrentReAccreditationRatingByUserId(userId)
  );
  const lastAttendedPqaVisitWithoutFollowUp = useSelector(
    getLastCoachAttendedVisitByUserId({
      userId,
      visitType: 'pQASiteVisits',
      followUpType: 'pqa_visit_follow_up',
    })
  );
  const lastAttendedReAccreditationVisitWithoutFollowUp = useSelector(
    getLastCoachAttendedVisitByUserId({
      userId,
      visitType: 'reAccreditationVisits',
      followUpType: 're_accreditation_follow_up',
    })
  );

  const { isLoading: isLoadingTimeline } = useThunkFetchCall(
    'pqa',
    PqaActions.GET_PRACTITIONER_TIMELINE
  );
  const { isLoading: isLoadingGetVisitData } = useThunkFetchCall(
    'pqa',
    PqaActions.GET_VISIT_DATA_FOR_VISIT_ID
  );

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';
  const isView = parseBool(window.sessionStorage.getItem(isViewKey) || '');

  const uncompletedSelfAssessment = timeline?.selfAssessmentVisits ?? [];

  const uncompletedVisits = [...uncompletedSelfAssessment];

  const onStart = (visitName?: string, visitId?: string) => {
    window.sessionStorage.setItem(currentActivityKey, visitName || 'Visit');
    setVisitId(visitId);
    setShowForm(true);
    onIsDisplayFormChange(true);
  };

  const onView = async ({ visit, visitType }: ViewEvent) => {
    if (visitType === 'pre-pqa') {
      // INFO: this is getting all visits to show all notes
      timeline?.prePQASiteVisits?.map(async (item) => {
        if (item?.id) {
          await appDispatch(
            getVisitDataForVisitId({ visitId: item.id, visitType })
          );
        }

        return item;
      });
      // INFO: To fill in some steps for PQA and re-accreditation, it's necessary to get data from the self-assessment
    } else {
      const attendedSelfAssessment = timeline?.selfAssessmentVisits?.filter(
        (item) => item?.attended
      );
      // INFO: this is getting the last self-assessment visit
      const selfAssessmentVisit =
        attendedSelfAssessment?.[attendedSelfAssessment.length - 1];

      await appDispatch(
        getVisitDataForVisitId({ visitId: visit?.id, visitType })
      );
      await appDispatch(
        getVisitDataForVisitId({
          visitId: selfAssessmentVisit?.id,
          visitType: 'self-assessment',
        })
      );
    }

    if (
      visit?.visitType?.name === generalSupportVisitTypes.practitioner_visit ||
      visit?.visitType?.name === generalSupportVisitTypes.practitioner_call ||
      visit?.visitType?.name === generalSupportVisitTypes.visit ||
      visit?.visitType?.name === generalSupportVisitTypes.call
    ) {
      window.sessionStorage.setItem(
        currentActivityKey,
        coachVisitTypes.supportVisit.description
      );
    } else {
      window.sessionStorage.setItem(
        currentActivityKey,
        visit?.visitType?.name!
      );
    }

    window.sessionStorage.setItem(practitionerVisitIdKey, visit?.id);
    window.sessionStorage.setItem(isViewKey, 'true');
    setShowForm(true);
  };

  const currentVisit = uncompletedVisits
    ?.filter(filterVisit)
    .sort(sortVisit)
    ?.map(
      (
        visit
      ): MenuListDataItem<{ visitId?: string; plannedVisitDate?: string }> => {
        const isLate = new Date(visit?.plannedVisitDate || '') < new Date();

        return {
          showIcon: true,
          menuIcon: isLate ? 'ExclamationIcon' : 'ClipboardListIcon',
          iconColor: 'white',
          titleStyle: 'text-textDark',
          title: visit?.visitType?.description || 'Visit',
          subTitle: !!visit?.plannedVisitDate
            ? `By ${new Date(visit?.plannedVisitDate).toLocaleDateString(
                'en-ZA',
                dateLongMonthOptions
              )}`
            : '',
          subTitleStyle: 'text-textDark',
          iconBackgroundColor: isLate ? 'alertMain' : 'primary',
          backgroundColor: 'uiBg',
          extraData: {
            visitId: visit?.id,
            plannedVisitDate: visit?.plannedVisitDate,
          },
          onActionClick: () =>
            onStart(String(visit?.visitType?.name), visit?.id),
        };
      }
    )
    .shift();

  const isRenderForm =
    (activityName && currentVisit?.extraData?.visitId) ||
    showForm ||
    activityName ||
    isView;

  const onFormBack = () => {
    window.sessionStorage.removeItem(currentActivityKey);
    window.sessionStorage.setItem(isViewKey, 'false');
    setVisitId('');
    setShowForm(false);
    onIsDisplayFormChange(false);
  };

  const getTimeline = useCallback(() => {
    if (userId && !isRenderForm) {
      appDispatch(getPractitionerTimeline({ userId: userId }));
    }
  }, [appDispatch, isRenderForm, userId]);

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

  useLayoutEffect(() => {
    if (activityName) {
      onIsDisplayFormChange(true);
    }
  }, [activityName, onIsDisplayFormChange]);

  useLayoutEffect(() => {
    if (!isComingSoon) {
      getTimeline();
    }
  }, [getTimeline, isComingSoon]);

  if (isRenderForm) {
    return <Form onBack={onFormBack} />;
  }

  if (isComingSoon) {
    return <Typography color="textDark" text={`Coming soon`} type={'h2'} />;
  }

  if (isLoadingTimeline) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
        className="tex pt-4"
      />
    );
  }

  if (isComingSoon) {
    return (
      <div className="mt-2 flex flex-col p-4">
        <Typography color="textDark" text={`Coming soon`} type={'h2'} />
      </div>
    );
  }

  return (
    <div className="p-4">
      {!!currentVisit &&
        isDateWithinThreeMonths(
          currentVisit?.extraData?.plannedVisitDate || ''
        ) && (
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
        text={`You have been a SmartStarter for`}
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
        text="Request a coaching visit or call"
        onClick={() => onStart(visitTypes.requestCoachingVisitOrCall.name)}
      />
      {!!timeline && (
        <Steps
          items={timelineSteps({
            timeline,
            onView,
            isLoading: isLoadingGetVisitData,
            practitionerId: userId,
            currentReAccreditationRating,
          })}
          typeColor={{ completed: 'successMain' }}
        />
      )}
    </div>
  );
};
