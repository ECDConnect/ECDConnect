import { Colours, StepItem, Typography } from '@ecdlink/ui';
import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { SupportVisits } from './support-visits-step';
import { PrePqaVisits } from './pre-pqa-site-vists';
import { RatingData } from '@/store/pqa/pqa.types';
import { PQAVisits } from './pqa/step-accordion-content';
import { getPqaStepData } from './pqa/step';
import { ReAccreditationVisits } from './re-accreditation/step-accordion-content';
import { getReAccreditationStepData } from './re-accreditation/step';

export interface ScheduleProps {
  visit: Visit;
  visitEventId?: string;
  eventType: 'First PQA' | 'ReAccreditation';
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
  if (!color) return { type: 'todo' };

  switch (color.toLowerCase()) {
    case 'success':
      return { type: 'completed' };
    case 'warning':
      return { type: 'inProgress', color: 'alertMain' };
    case 'error':
      return { type: 'inProgress', color: 'errorMain' };
    default:
      return { type: 'todo' };
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

export const timelineSteps = ({
  timeline,
  onView,
  onStart,
  onScheduleOrStart,
  isLoading,
  isOnline,
  visits,
  practitionerId,
  currentPqaRating,
  currentReAccreditationRating,
}: {
  practitionerId: string;
  timeline: PractitionerTimeline;
  onView: (visit: Visit) => void;
  onStart: (visitName: string) => void;
  onScheduleOrStart: (schedule: ScheduleProps) => void;
  isLoading: boolean;
  isOnline: boolean;
  visits?: Maybe<Visit>[];
  currentPqaRating: RatingData;
  currentReAccreditationRating: RatingData;
}): StepItem[] => {
  const steps: (StepItem<{ date?: Date }> | {})[] = [];
  steps.push(
    setStep(
      timeline.consolidationMeetingStatus,
      timeline.consolidationMeetingDate,
      timeline?.consolidationMeetingColor
    )
  );
  steps.push(
    setStep(
      timeline.firstAidCourseStatus,
      timeline.firstAidDate,
      timeline?.firstAidCourseColor
    )
  );
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
          visit2?.attended ? visit2?.insertedDate : visit2?.plannedVisitDate
        ).toLocaleDateString('en-ZA', dateOptions)
      : new Date(
          visit1?.attended ? visit1.insertedDate : visit1?.plannedVisitDate
        ).toLocaleDateString('en-ZA', dateOptions);

    const isLateDate =
      new Date(date) < new Date() &&
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
          isLoading={isLoading}
          isOnline={isOnline}
          onView={onView}
          timeline={timeline}
          visits={visits}
        />
      ),
    });
  }

  if (!!timeline.supportVisits?.length) {
    const date = new Date(
      timeline.supportVisits[
        timeline.supportVisits.length - 1
      ]?.plannedVisitDate
    ).toLocaleDateString('en-ZA', dateOptions);

    steps.push({
      title: 'General support visits',
      subTitle: `By ${date}`,
      type: timeline.supportVisits?.every((item) => !!item?.attended)
        ? 'completed'
        : 'todo',
      extraData: {
        date: new Date(date),
      },
      showAccordion: true,
      accordionContent: (
        <SupportVisits
          isLoading={isLoading}
          timeline={timeline}
          onView={onView}
          isOnline={isOnline}
        />
      ),
    });
  }

  if (!!timeline.pQASiteVisits?.length) {
    const { currentVisit, ratingData, stepType, subTitleText } = getPqaStepData(
      { timeline, currentPqaRating }
    );

    steps.push({
      title: 'First PQA',
      customSubTitle: (
        <div className="flex items-center">
          <Typography
            type="body"
            color={stepType?.color}
            className="mr-4"
            text={`${subTitleText} ${new Date(
              currentVisit?.plannedVisitDate
            ).toLocaleDateString('en-ZA', dateOptions)}`}
          />

          {ratingData?.icon}
          <p className="text-textMid text-12 ml-2">{ratingData?.text}</p>
        </div>
      ),
      inProgressStepIcon: stepType?.color && 'ExclamationCircleIcon',
      type: stepType?.type,
      extraData: {
        date: new Date(currentVisit?.plannedVisitDate),
      },
      showAccordion: true,
      accordionContent: (
        <PQAVisits
          isLoading={isLoading}
          currentVisit={currentVisit!}
          practitionerId={practitionerId}
          onStart={onStart}
          onScheduleOrStart={onScheduleOrStart}
          isOnline={isOnline}
        />
      ),
    });
  }

  if (timeline.reAccreditationVisits?.length) {
    const { currentVisit, ratingData, stepType, subTitleText } =
      getReAccreditationStepData({
        timeline,
        currentRating: currentReAccreditationRating,
      });

    steps.push({
      title: 'Re-accreditation visit',
      customSubTitle: (
        <div className="flex items-center">
          <Typography
            type="body"
            color={stepType?.color}
            className="mr-4"
            text={`${subTitleText} ${new Date(
              currentVisit?.plannedVisitDate
            ).toLocaleDateString('en-ZA', dateOptions)}`}
          />

          {ratingData?.icon}
          <p className="text-textMid text-12 ml-2">{ratingData?.text}</p>
        </div>
      ),
      subTitleColor: stepType?.color,
      type: stepType?.type,
      inProgressStepIcon: stepType?.color && 'ExclamationCircleIcon',
      extraData: {
        date: new Date(currentVisit?.plannedVisitDate),
      },
      showAccordion: true,
      accordionContent: (
        <ReAccreditationVisits
          isLoading={isLoading}
          currentVisit={currentVisit!}
          practitionerId={practitionerId}
          onScheduleOrStart={onScheduleOrStart}
          isOnline={isOnline}
        />
      ),
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
