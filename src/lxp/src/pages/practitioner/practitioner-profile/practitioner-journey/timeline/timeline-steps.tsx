import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { StepItem, Typography } from '@ecdlink/ui';
import { dateOptions, getStepType, setStep } from './utils';
import { SupportVisits } from './steps/support-visits';
import { PQAFormType, RatingData } from '@/store/pqa/pqa.types';
import { PrePqaVisits } from './steps/pre-pqa';
import { getPqaStepData } from './steps/pqa/step';
import { PQAVisits } from './steps/pqa/step-accordion-content';
import { ReAccreditationVisits } from './steps/re-accreditation/step-accordion-content';
import { getReAccreditationStepData } from './steps/re-accreditation/step';
import { visitTypes } from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';

export interface ViewEvent {
  visit: Visit | Maybe<Visit>;
  visitType: PQAFormType;
}

interface TimelineStepsProps {
  practitionerId: string;
  timeline: PractitionerTimeline;
  isLoading: boolean;
  currentPqaRating: RatingData;
  currentReAccreditationRating: RatingData;
  onView: (event: ViewEvent) => void;
}

export const timelineSteps = ({
  timeline,
  isLoading,
  currentPqaRating,
  currentReAccreditationRating,
  practitionerId,
  onView,
}: TimelineStepsProps) => {
  const attendedSupportVisits = timeline.supportVisits?.filter(
    (item) => !!item?.attended
  );
  const attendedPqaVisits = timeline.pQASiteVisits?.filter(
    (item) => !!item?.attended
  );
  const attendedReAccreditationVisits = timeline.reAccreditationVisits?.filter(
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

  if (timeline.firstAidDate) {
    steps.push(
      setStep(
        timeline.firstAidCourseStatus,
        timeline.firstAidDate,
        timeline?.firstAidCourseColor
      )
    );
  }

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

  if (!!attendedPqaVisits?.length) {
    const { currentVisit, ratingData, stepType } = getPqaStepData({
      timeline,
      currentPqaRating,
    });

    steps.push({
      title: 'First PQA',
      customSubTitle: (
        <div className="flex items-center">
          <Typography
            type="body"
            color={
              stepType?.color || ratingData?.color !== 'successMain'
                ? ratingData?.color
                : 'textMid'
            }
            className="mr-4"
            text={new Date(currentVisit?.plannedVisitDate).toLocaleDateString(
              'en-ZA',
              dateOptions
            )}
          />

          {ratingData?.icon}
          <p className="text-textMid text-12 ml-2">{ratingData?.text}</p>
        </div>
      ),
      inProgressStepIcon: stepType?.color && 'CheckIcon',
      type: stepType?.type,
      color: ratingData?.color,
      extraData: {
        date: new Date(currentVisit?.plannedVisitDate),
      },
      showActionButton: attendedPqaVisits.length === 1,
      actionButtonText: 'View',
      actionButtonTextColor: 'secondary',
      actionButtonIsLoading: isLoading,
      actionButtonOnClick: () => {
        const item = attendedPqaVisits[0];

        onView({
          visit: item,
          visitType: item?.visitType?.name?.includes(
            visitTypes.pqa.followUp.name
          )
            ? 'follow-up-visit'
            : 'pqa',
        });
      },
      actionButtonColor: 'secondaryAccent2',
      showAccordion: attendedPqaVisits.length > 1,
      accordionContent: (
        <PQAVisits
          isLoading={isLoading}
          currentVisit={currentVisit!}
          practitionerId={practitionerId}
          onView={onView}
        />
      ),
    });
  }

  if (attendedReAccreditationVisits?.length) {
    const { currentVisit, ratingData, stepType } = getReAccreditationStepData({
      timeline,
      currentRating: currentReAccreditationRating,
    });

    steps.push({
      title: 'Annual re-accreditation',
      customSubTitle: (
        <div className="flex items-center">
          <Typography
            type="body"
            color={
              stepType?.color || ratingData?.color !== 'successMain'
                ? ratingData?.color
                : 'textMid'
            }
            className="mr-4"
            text={new Date(currentVisit?.plannedVisitDate).toLocaleDateString(
              'en-ZA',
              dateOptions
            )}
          />

          {ratingData?.icon}
          <p className="text-textMid text-12 ml-2">{ratingData?.text}</p>
        </div>
      ),
      subTitleColor: stepType?.color,
      type: stepType?.type,
      color: ratingData?.color,
      inProgressStepIcon: stepType?.color && 'CheckIcon',
      extraData: {
        date: new Date(currentVisit?.plannedVisitDate),
      },
      showActionButton: attendedReAccreditationVisits.length === 1,
      actionButtonText: 'View',
      actionButtonTextColor: 'secondary',
      actionButtonIsLoading: isLoading,
      actionButtonOnClick: () => {
        const item = attendedReAccreditationVisits[0];
        onView({
          visit: item,
          visitType: item?.visitType?.name?.includes(
            visitTypes.reaccreditation.followUp.name
          )
            ? 're-accreditation-follow-up-visit'
            : 're-accreditation',
        });
      },
      actionButtonColor: 'secondaryAccent2',
      showAccordion: attendedReAccreditationVisits.length > 1,
      accordionContent: (
        <ReAccreditationVisits
          isLoading={isLoading}
          practitionerId={practitionerId}
          onView={onView}
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
