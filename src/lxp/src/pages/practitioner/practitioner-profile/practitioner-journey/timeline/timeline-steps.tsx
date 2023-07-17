import { PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { StepItem } from '@ecdlink/ui';
import { dateOptions, getStepType, setStep } from './utils';
import { SupportVisits } from './steps/support-visits';
import { PQAFormType } from '@/store/pqa/pqa.types';
import { PrePqaVisits } from './steps/pre-pqa';

export interface ViewEvent {
  visit: Visit;
  visitType: PQAFormType;
}

interface TimelineStepsProps {
  timeline: PractitionerTimeline;
  isLoading: boolean;
  onView: (event: ViewEvent) => void;
}

export const timelineSteps = ({
  timeline,
  isLoading,
  onView,
}: TimelineStepsProps) => {
  const attendedSupportVisits = timeline.supportVisits?.filter(
    (item) => !!item?.attended
  );

  const steps: (StepItem<{ date?: Date }> | {})[] = [];

  steps.push(
    setStep(
      timeline.starterLicenseStatus,
      timeline.starterLicenseDate,
      timeline?.starterLicenseColor
    )
  );

  steps.push(
    setStep(
      timeline.consolidationMeetingStatus,
      timeline.consolidationMeetingDate,
      timeline?.consolidationMeetingColor
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
      timeline.firstAidCourseStatus,
      timeline.firstAidDate,
      timeline?.firstAidCourseColor
    )
  );

  if (!!attendedSupportVisits?.length) {
    const date = new Date(
      attendedSupportVisits[attendedSupportVisits.length - 1]?.insertedDate
    ).toLocaleDateString('en-ZA', dateOptions);

    steps.push({
      title: 'General support visits',
      subTitle: date,
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
          isOnline={true}
        />
      ),
    });
  }

  if (!!timeline.prePQASiteVisits?.length) {
    const date = timeline.prePQASiteVisits?.some(
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
      title: 'Site visits completed',
      subTitle: date,
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
          isOnline={true}
          onView={onView}
          timeline={timeline}
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
