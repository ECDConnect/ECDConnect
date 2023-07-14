import { PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { StepItem } from '@ecdlink/ui';
import { dateOptions, setStep } from './utils';
import { SupportVisits } from './steps/support-visits';
import { PQAFormType } from '@/store/pqa/pqa.types';

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

  const formattedSteps = steps
    .filter((object) => Object.keys(object).length !== 0)
    .sort(
      (stepA, stepB) =>
        ((stepA as StepItem<{ date: Date }>).extraData?.date?.getTime() || 0) -
        ((stepB as StepItem<{ date: Date }>).extraData?.date?.getTime() || 0)
    ) as StepItem<{ date: Date }>[];

  return formattedSteps;
};
