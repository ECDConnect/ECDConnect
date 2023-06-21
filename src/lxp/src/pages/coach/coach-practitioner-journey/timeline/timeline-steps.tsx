import { Colours, StepItem, Typography } from '@ecdlink/ui';
import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { SupportVisits } from './support-visits-step';
import { PrePqaVisits } from './pre-pqa-site-vists';
import { PQAVisits, getRatingData } from './pqa-site-visits-step';
import { PqaRatingData } from '@/store/pqa/pqa.types';

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

export const getStepType = (
  color?: Maybe<string>
): { type: StepItem['type']; color?: Colours } => {
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
  isLoading,
  isOnline,
  visits,
  practitionerId,
  currentPqaRating,
}: {
  practitionerId: string;
  timeline: PractitionerTimeline;
  onView: (visit: Visit) => void;
  onStart: (visitName: string) => void;
  isLoading: boolean;
  isOnline: boolean;
  visits?: Maybe<Visit>[];
  currentPqaRating: PqaRatingData;
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
    const date = visits?.some(
      (item) =>
        item?.visitType?.name?.includes('pre_pqa_visit_1') && item?.attended
    )
      ? new Date(
          timeline.prePQASiteVisits?.find((item) =>
            item?.visitType?.name?.includes('pre_pqa_visit_2')
          )?.plannedVisitDate
        ).toLocaleDateString('en-ZA', dateOptions)
      : new Date(
          timeline.prePQASiteVisits?.find((item) =>
            item?.visitType?.name?.includes('pre_pqa_visit_1')
          )?.plannedVisitDate
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
      subTitle: `By ${date}`,
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
    const visits = timeline.pQASiteVisits
      ?.filter(
        (visit: Maybe<Visit>) => typeof visit?.visitType?.order !== 'undefined'
      )
      ?.sort(sortVisit);

    const visitToAttend = visits.find((item) => !item?.attended);
    const currentVisit = !!visitToAttend
      ? visitToAttend
      : visits[visits.length - 1];

    const isLateDate =
      new Date(currentVisit?.plannedVisitDate) < new Date() &&
      timeline.pQASiteVisits.some((item) => !item?.attended);
    const isAllCompleted = timeline.pQASiteVisits?.every(
      (item) => !!item?.attended
    );

    const stepType = getStepType(
      currentPqaRating?.rating?.overallRatingColor?.toLocaleLowerCase() ||
        '' ||
        (isLateDate ? 'error' : '') ||
        (isAllCompleted ? 'success' : '') ||
        undefined
    );

    const ratingData = getRatingData(
      currentPqaRating?.rating?.overallRatingColor
    );

    steps.push({
      title: 'First PQA',
      customSubTitle: (
        <div className="flex items-center">
          <Typography
            type="body"
            color={stepType.color}
            className="mr-4"
            text={`${visitToAttend ? 'By ' : ''} ${new Date(
              currentVisit?.plannedVisitDate
            ).toLocaleDateString('en-ZA', dateOptions)}`}
          />

          {ratingData.icon}
          <p className="text-textMid text-12 ml-2">{ratingData.text}</p>
        </div>
      ),
      inProgressStepIcon: stepType.color && 'ExclamationCircleIcon',
      type: stepType.type,
      extraData: {
        date: new Date(currentVisit?.plannedVisitDate),
      },
      showAccordion: true,
      accordionContent: (
        <PQAVisits
          isLoading={isLoading}
          currentVisit={currentVisit}
          practitionerId={practitionerId}
          onStart={onStart}
        />
      ),
    });
  }

  if (timeline.reAccreditationVisits?.length) {
    const visits = timeline.reAccreditationVisits
      ?.filter(
        (visit: Maybe<Visit>) => typeof visit?.visitType?.order !== 'undefined'
      )
      ?.sort(sortVisit);

    const visitToAttend = visits.find((item) => !item?.attended);
    const currentVisit = !!visitToAttend
      ? visitToAttend
      : visits[visits.length - 1];

    const isLateDate =
      new Date(currentVisit?.plannedVisitDate) < new Date() &&
      timeline.reAccreditationVisits.some((item) => !item?.attended);
    const isAllCompleted = timeline.reAccreditationVisits?.every(
      (item) => !!item?.attended
    );

    const stepType = getStepType(
      (isLateDate ? 'error' : '') ||
        (isAllCompleted ? 'success' : '') ||
        undefined
    );

    steps.push({
      title: 'Re-accreditation visit',
      subTitle: `By ${new Date(
        currentVisit?.plannedVisitDate
      ).toLocaleDateString('en-ZA', dateOptions)}`,
      subTitleColor: stepType.color,
      type: stepType.type,
      inProgressStepIcon: isLateDate && 'ExclamationCircleIcon',
      extraData: {
        date: new Date(currentVisit?.plannedVisitDate),
      },
      showActionButton: true,
      // TODO: add schedule feature
      actionButtonText: 'Start',
      actionButtonIcon: 'ArrowCircleRightIcon',
      actionButtonOnClick: () => {
        onStart(String(currentVisit?.visitType?.name));
      },
    });
  }

  const formattedSteps = steps
    .filter((object) => Object.keys(object).length !== 0)
    .sort(
      (
        stepA,
        stepB // TODO: fix type
      ) =>
        // @ts-ignore
        (stepA.extraData?.date?.getTime() || 0) -
        // @ts-ignore
        (stepB.extraData?.date?.getTime() || 0)
    ) as StepItem<{ date: Date }>[];

  return formattedSteps;
};
