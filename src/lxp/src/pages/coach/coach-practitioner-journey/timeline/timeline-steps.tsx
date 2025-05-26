import { Colours, StepItem, Typography } from '@ecdlink/ui';
import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { SupportVisits } from './support-visits-step';
import { PrePqaVisits } from './pre-pqa-site-vists';
import { RatingData } from '@/store/pqa/pqa.types';
import { PQAVisits } from './pqa/step-accordion-content';
import { getPqaStepData } from './pqa/step';
import { ReAccreditationVisits } from './re-accreditation/step-accordion-content';
import { getReAccreditationStepData } from './re-accreditation/step';
import {
  divideArrayByFollowUp,
  getScheduleOrStartButtonIcon,
  getScheduleOrStartButtonText,
  isDateWithinThreeMonths,
  sortVisits,
} from './utils';
import { visitTypes } from '../coach-practitioner-journey.types';
import { visitIdKey } from '../forms';

export type ScheduleEventType =
  | 'First PQA'
  | 'PQA follow-up'
  | 'Re-accreditation'
  | 'Re-accreditation follow-up'
  | 'First site visit'
  | 'Second site visit'
  | 'General support visit';

export interface ScheduleProps {
  visitTypeName: string;
  visit?: Visit;
  visitEventId?: string;
  eventType: ScheduleEventType;
}

export interface ScheduleOrStartProps extends ScheduleProps {
  scheduleStartText: string;
}

export interface StepType {
  type: StepItem['type'];
  color?: Colours;
}

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const filterVisit = (visit: Maybe<Visit>) =>
  !visit?.attended && typeof visit?.visitType?.order !== 'undefined';

export const sortVisit = (visitA?: Maybe<Visit>, visitB?: Maybe<Visit>) => {
  const orderA = Number(visitA?.visitType?.order) || 0;
  const orderB = Number(visitB?.visitType?.order) || 0;
  return orderA - orderB;
};

export const getStepType = (color?: Maybe<string>): StepType => {
  if (!color) return { type: 'todo', color: 'textMid' };

  switch (color.toLowerCase()) {
    case 'success':
      return { type: 'completed', color: 'textMid' };
    case 'warning':
      return { type: 'inProgress', color: 'alertMain' };
    case 'error':
      return { type: 'inProgress', color: 'errorMain' };
    default:
      return { type: 'todo', color: 'textMid' };
  }
};

export const getStepDate = (date?: string) =>
  !!date ? `By ${new Date(date).toLocaleDateString('en-ZA', dateOptions)}` : '';

export const setStep = (
  status?: Maybe<string>,
  date?: string,
  color?: Maybe<string>
) => {
  if (!!status) {
    return {
      title: status,
      subTitle: getStepDate(date),
      inProgressStepIcon:
        (color === 'Warning' || color === 'Error') && 'ExclamationCircleIcon',
      subTitleColor: getStepType(color)?.color || '',
      type: getStepType(color).type,
      extraData: { date: date ? new Date(date) : null },
    } as StepItem;
  }

  return {};
};

const getIconBgColor = (attendanceColor: string) => {
  switch (attendanceColor) {
    case 'Success':
      return 'successMain';
    case 'Warning':
      return 'alertMain';
    case 'Error':
      return 'errorMain';
    default:
      return '';
  }
};

export const timelineSteps = ({
  timeline,
  onView,
  onStart,
  onScheduleOrStart,
  onStartRequestedSupportVisit,
  isLoading,
  isOnline,
  visits,
  practitionerId,
  currentReAccreditationRating,
}: {
  practitionerId: string;
  timeline: PractitionerTimeline;
  onView: (visit: Visit) => void;
  onStart: (visitName: string) => void;
  onScheduleOrStart: (schedule: ScheduleOrStartProps) => void;
  onStartRequestedSupportVisit: (visitId: string) => void;
  isLoading: boolean;
  isOnline: boolean;
  visits?: Maybe<Visit>[];
  currentReAccreditationRating?: RatingData;
}): StepItem[] => {
  const onActionButtonClick = (options: ScheduleOrStartProps) => {
    if (!options.visit?.eventId) {
      window.sessionStorage.setItem(visitIdKey, options.visit?.id);
      onScheduleOrStart(options);
    } else {
      window.sessionStorage.setItem(visitIdKey, options.visit?.id);
      onStart(options.visit.visitType?.name as string);
    }
  };

  const isUserEnableToStartPqaVisit = timeline?.prePQASiteVisits?.every(
    (item) => item?.attended
  );

  const steps: (StepItem<{ date?: Date }> | {})[] = [];
  steps.push(
    setStep(
      timeline.consolidationMeetingStatus,
      timeline.consolidationMeetingDate,
      timeline?.consolidationMeetingColor
    )
  );
  if (timeline.firstAidDate) {
    steps.push(
      setStep(
        timeline.firstAidCourseStatus,
        timeline.firstAidDate,
        timeline?.firstAidCourseColor
      )
    );
  }
  steps.push(
    setStep(
      timeline.smartSpaceLicenseStatus,
      timeline.smartSpaceLicenseDate,
      timeline?.smartSpaceLicenseColor
    )
  );
  steps.push(
    setStep(
      timeline.starterLicenseStatus,
      timeline.starterLicenseDate,
      timeline?.starterLicenseColor
    )
  );

  if (!!timeline.prePQASiteVisits?.length) {
    const visit1 = timeline.prePQASiteVisits?.find((item) =>
      item?.visitType?.name?.includes('pre_pqa_visit_1')
    );
    const visit2 = timeline.prePQASiteVisits?.find((item) =>
      item?.visitType?.name?.includes('pre_pqa_visit_2')
    );

    const date = visits?.some(
      (item) =>
        item?.visitType?.name?.includes('pre_pqa_visit_1') && item?.attended
    )
      ? new Date(
          visit2?.attended ? visit2?.actualVisitDate : visit2?.plannedVisitDate
        ).toLocaleDateString('en-ZA', dateOptions)
      : new Date(
          visit1?.attended ? visit1.actualVisitDate : visit1?.plannedVisitDate
        ).toLocaleDateString('en-ZA', dateOptions);

    const currentVisit = visits?.some(
      (item) =>
        item?.visitType?.name?.includes('pre_pqa_visit_1') && item?.attended
    )
      ? visit2
      : visit1;

    const isLateDate =
      new Date(date).getTime() < new Date().getTime() &&
      timeline.prePQASiteVisits.some((item) => !item?.attended);
    const isAllCompleted = timeline.prePQASiteVisits?.every(
      (item) => !!item?.attended
    );

    const stepType = getStepType(
      (isLateDate ? 'error' : '') ||
        (isAllCompleted ? 'success' : '') ||
        undefined
    );

    steps.push({
      title: 'Pre-PQA site visits',
      subTitle: `${isAllCompleted ? '' : 'By '}${date}`,
      subTitleColor: stepType.color,
      type: stepType.type,
      inProgressStepIcon: isLateDate && 'ExclamationCircleIcon',
      showAccordion: true,
      extraData: {
        date: new Date(date),
      },
      accordionContent: (
        <PrePqaVisits
          currentVisit={currentVisit!}
          isLoading={isLoading}
          isOnline={isOnline}
          onView={onView}
          timeline={timeline}
          visits={visits}
          onStart={onStart}
          onScheduleOrStart={onScheduleOrStart}
        />
      ),
    });
  }

  if (
    !!timeline.supportVisits?.length ||
    !!timeline?.requestedCoachVisits?.length
  ) {
    const mergedVisits = [
      ...(timeline?.supportVisits ?? []),
      ...(timeline?.requestedCoachVisits ?? []),
    ];

    const date = new Date(
      mergedVisits[mergedVisits.length - 1]?.plannedVisitDate
    ).toLocaleDateString('en-ZA', dateOptions);

    const type = mergedVisits?.every((item) => !!item?.attended)
      ? 'completed'
      : 'todo';

    steps.push({
      title: 'General support visits',
      subTitle: `${type === 'todo' ? 'By ' : ''}${date}`,
      type,
      extraData: {
        date: new Date(date),
      },
      showAccordion: true,
      accordionContent: (
        <SupportVisits
          practitionerId={practitionerId}
          isLoading={isLoading}
          timeline={timeline}
          onView={onView}
          isOnline={isOnline}
          onStartRequestedSupportVisit={onStartRequestedSupportVisit}
        />
      ),
    });
  }

  if (!!timeline.pQASiteVisits?.length) {
    const sortedVisits = sortVisits(timeline.pQASiteVisits);
    const dividedVisits = divideArrayByFollowUp(sortedVisits);

    dividedVisits.map((pQASiteVisits, pqaIndex) => {
      const previousVisits = pqaIndex > 0 ? dividedVisits[pqaIndex - 1] : [];
      const isAllCompleted = previousVisits.length
        ? previousVisits?.every((item) => !!item?.attended)
        : true;

      if (!isAllCompleted) return {};

      const currentRating: RatingData = {
        rating: timeline.pQARatings
          ?.filter(
            (item) =>
              !item?.visitTypeName?.includes(visitTypes.pqa.followUp.name)
          )
          ?.find((visit) =>
            pQASiteVisits.some((item) => item?.id === visit?.visitId)
          ),
        visitNumber: pqaIndex + 1,
      };

      const { currentVisit, ratingData, stepType, subTitleText } =
        getPqaStepData({ pQASiteVisits, currentPqaRating: currentRating });
      let date = currentVisit?.plannedVisitDate;

      if (currentVisit?.actualVisitDate && currentVisit?.attended) {
        date = currentVisit?.actualVisitDate;
      }

      return steps.push({
        title: 'First PQA',
        customSubTitle: (
          <div className="flex items-center">
            <Typography
              type="body"
              color={stepType?.color}
              className="mr-4"
              text={`${subTitleText} ${new Date(date).toLocaleDateString(
                'en-ZA',
                dateOptions
              )}`}
            />
            {pQASiteVisits.some((item) => item?.attended) && (
              <>
                {ratingData?.icon}
                <p className="text-textMid text-12 ml-2">{ratingData?.text}</p>
              </>
            )}
          </div>
        ),
        inProgressStepIcon: stepType?.color && 'ExclamationCircleIcon',
        type: stepType?.type,
        extraData: {
          date: new Date(
            currentVisit?.attended
              ? currentVisit?.actualVisitDate
              : currentVisit?.plannedVisitDate
          ),
        },
        color:
          stepType?.type !== 'todo' &&
          currentRating?.rating &&
          ratingData?.color,
        showActionButton:
          pQASiteVisits.length === 1 &&
          !currentVisit?.attended &&
          isUserEnableToStartPqaVisit,
        actionButtonText: getScheduleOrStartButtonText(currentVisit),
        actionButtonType: 'outlined',
        actionButtonTextColor: 'primary',
        actionButtonIcon: getScheduleOrStartButtonIcon(currentVisit),
        actionButtonIconStartPosition: 'start',
        actionButtonOnClick: () =>
          onActionButtonClick({
            visit: currentVisit!,
            visitTypeName: currentVisit?.visitType?.name || '',
            visitEventId: currentVisit?.eventId,
            eventType: visitTypes.pqa.firstPQA.eventType,
            scheduleStartText: visitTypes.pqa.firstPQA.scheduleStartText,
          }),
        showAccordion: pQASiteVisits.length > 1,
        accordionContent: (
          <PQAVisits
            isLoading={isLoading}
            currentVisit={currentVisit!}
            pQASiteVisits={pQASiteVisits}
            practitionerId={practitionerId}
            onStart={onStart}
            onScheduleOrStart={onScheduleOrStart}
            isOnline={isOnline}
          />
        ),
      });
    });
  }

  if (timeline.reAccreditationVisits?.length) {
    const sortedVisits = sortVisits(timeline.reAccreditationVisits);
    const dividedVisits = divideArrayByFollowUp(sortedVisits);

    dividedVisits.map((reAccreditationVisits, reAccreditationIndex) => {
      const previousVisits =
        reAccreditationIndex > 0 ? dividedVisits[reAccreditationIndex - 1] : [];
      const isAllCompleted = previousVisits.length
        ? previousVisits?.every((item) => !!item?.attended)
        : true;

      if (!isAllCompleted) return {};

      const isNextYear =
        currentReAccreditationRating?.rating?.overallRatingColor ===
          'Success' &&
        previousVisits?.some(
          (item) => item?.id === currentReAccreditationRating?.rating?.visitId
        );

      const ratingForThisVisit: RatingData = {
        rating: timeline.reAccreditationRatings
          ?.filter(
            (item) =>
              !item?.visitTypeName?.includes(
                visitTypes.reaccreditation.followUp.name
              )
          )
          ?.find((visit) =>
            reAccreditationVisits.some((item) => item?.id === visit?.visitId)
          ),
        visitNumber: reAccreditationIndex + 1,
      };

      const { currentVisit, ratingData, stepType, subTitleText } =
        getReAccreditationStepData({
          reAccreditationVisits,
          currentRating: ratingForThisVisit,
        });

      let date = currentVisit?.plannedVisitDate;

      if (isNextYear && !isDateWithinThreeMonths(date)) return {};

      if (currentVisit?.actualVisitDate && currentVisit?.attended) {
        date = currentVisit?.actualVisitDate;
      }

      return steps.push({
        title: 'Re-accreditation visit',
        customSubTitle: (
          <div className="flex items-center">
            <Typography
              type="body"
              color={stepType?.color}
              className="mr-4"
              text={`${subTitleText} ${new Date(date).toLocaleDateString(
                'en-ZA',
                dateOptions
              )}`}
            />
            {reAccreditationVisits.some((item) => item?.attended) && (
              <>
                {ratingData?.icon}
                <p className="text-textMid text-12 ml-2">{ratingData?.text}</p>
              </>
            )}
          </div>
        ),
        subTitleColor: stepType?.color,
        type: stepType?.type,
        inProgressStepIcon: stepType?.color && 'ExclamationCircleIcon',
        extraData: {
          date: new Date(
            currentVisit?.attended
              ? currentVisit.actualVisitDate
              : currentVisit?.plannedVisitDate
          ),
        },
        color:
          stepType?.type !== 'todo' &&
          ratingForThisVisit.rating &&
          ratingData?.color,
        showActionButton:
          reAccreditationVisits.length === 1 &&
          !currentVisit?.attended &&
          isUserEnableToStartPqaVisit &&
          isDateWithinThreeMonths(currentVisit?.plannedVisitDate),
        actionButtonText: getScheduleOrStartButtonText(currentVisit),
        actionButtonType: 'outlined',
        actionButtonTextColor: 'primary',
        actionButtonIcon: getScheduleOrStartButtonIcon(currentVisit),
        actionButtonIconStartPosition: 'start',
        actionButtonOnClick: () =>
          onActionButtonClick({
            visit: currentVisit!,
            visitTypeName: currentVisit?.visitType?.name || '',
            visitEventId: currentVisit?.eventId,
            eventType: visitTypes.reaccreditation.first.eventType,
            scheduleStartText:
              visitTypes.reaccreditation.first.scheduleStartText,
          }),
        showAccordion: reAccreditationVisits.length > 1,
        accordionContent: (
          <ReAccreditationVisits
            isLoading={isLoading}
            currentVisit={currentVisit!}
            reAccreditationVisits={reAccreditationVisits}
            practitionerId={practitionerId}
            onStart={onStart}
            onScheduleOrStart={onScheduleOrStart}
            isOnline={isOnline}
          />
        ),
      });
    });
  }

  const formattedSteps = steps
    .filter((object) => Object.keys(object).length !== 0)
    .sort(
      (stepA, stepB) =>
        ((stepA as StepItem<{ date: Date }>).extraData?.date?.getTime() || 0) -
        ((stepB as StepItem<{ date: Date }>).extraData?.date?.getTime() || 0)
    ) as StepItem<{ date: Date }>[];

  return formattedSteps;
};
