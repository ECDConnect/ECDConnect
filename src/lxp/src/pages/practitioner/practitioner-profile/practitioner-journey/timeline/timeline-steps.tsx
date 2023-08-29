import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { StepItem, Typography } from '@ecdlink/ui';
import { dateOptions, getStepType, setStep } from './utils';
import { SupportVisits } from './steps/support-visits';
import { PQAFormType, RatingData } from '@/store/pqa/pqa.types';
import { PrePqaVisits } from './steps/pre-pqa';
// import { getPqaStepData } from './steps/pqa/step';
import { PQAVisits } from './steps/pqa/step-accordion-content';
import { ReAccreditationVisits } from './steps/re-accreditation/step-accordion-content';
//import { getReAccreditationStepData } from './steps/re-accreditation/step';
import { visitTypes } from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';
import {
  divideArrayByFollowUp,
  sortVisits,
} from '@/pages/coach/coach-practitioner-journey/timeline/utils';
import { getReAccreditationStepData } from '@/pages/coach/coach-practitioner-journey/timeline/re-accreditation/step';
import { getPqaStepData } from '@/pages/coach/coach-practitioner-journey/timeline/pqa/step';

export interface ViewEvent {
  visit: Visit | Maybe<Visit>;
  visitType: PQAFormType;
}

interface TimelineStepsProps {
  practitionerId: string;
  timeline: PractitionerTimeline;
  isLoading: boolean;
  onView: (event: ViewEvent) => void;
}

export const timelineSteps = ({
  timeline,
  isLoading,
  practitionerId,
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
      attendedSupportVisits[attendedSupportVisits.length - 1]?.actualVisitDate
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
    const visit1 = timeline.prePQASiteVisits?.find((item) =>
      item?.visitType?.name?.includes('pre_pqa_visit_2')
    );
    const visit2 = timeline.prePQASiteVisits?.find((item) =>
      item?.visitType?.name?.includes('pre_pqa_visit_1')
    );
    const date = timeline.prePQASiteVisits?.some(
      (item) =>
        item?.visitType?.name?.includes('pre_pqa_visit_1') && item?.attended
    )
      ? new Date(
          visit2?.attended ? visit2.actualVisitDate : visit2?.plannedVisitDate
        ).toLocaleDateString('en-ZA', dateOptions)
      : new Date(
          visit1?.attended ? visit1.actualVisitDate : visit1?.plannedVisitDate
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

      const { currentVisit, ratingData, stepType } = getPqaStepData({
        pQASiteVisits,
        currentPqaRating: currentRating,
      });

      return steps.push({
        title: 'First PQA',
        customSubTitle: (
          <div className="flex items-center">
            <Typography
              type="body"
              color={
                currentVisit?.attended &&
                (stepType?.color || ratingData?.color !== 'successMain')
                  ? ratingData?.color
                  : 'textMid'
              }
              className="mr-4"
              text={`${currentVisit?.attended ? '' : 'By '}${new Date(
                currentVisit?.attended
                  ? currentVisit?.actualVisitDate
                  : currentVisit?.plannedVisitDate
              ).toLocaleDateString('en-ZA', dateOptions)}`}
            />
            {pQASiteVisits.some((item) => item?.attended) && (
              <>
                {ratingData?.icon}
                <p className="text-textMid text-12 ml-2">{ratingData?.text}</p>
              </>
            )}
          </div>
        ),
        inProgressStepIcon:
          (stepType?.color && currentVisit?.attended && 'CheckIcon') ||
          (ratingData?.color && 'ExclamationCircleIcon'),
        type: stepType?.type,
        color: currentVisit?.attended && ratingData?.color,
        extraData: {
          date: currentVisit?.attended
            ? new Date(currentVisit?.actualVisitDate)
            : new Date(currentVisit?.plannedVisitDate),
        },
        showActionButton:
          pQASiteVisits.length === 1 && currentVisit?.hasAnswerData,
        actionButtonText: 'View',
        actionButtonTextColor: 'secondary',
        actionButtonIsLoading: isLoading,
        actionButtonOnClick: () => {
          const item = pQASiteVisits[0];

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
        showAccordion: pQASiteVisits.length > 1,
        accordionContent: (
          <PQAVisits
            isLoading={isLoading}
            pQASiteVisits={pQASiteVisits}
            practitionerId={practitionerId}
            onView={onView}
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

      const currentRating: RatingData = {
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

      const { currentVisit, ratingData, stepType } = getReAccreditationStepData(
        {
          reAccreditationVisits,
          currentRating,
        }
      );

      return steps.push({
        title: 'Annual re-accreditation',
        customSubTitle: (
          <div className="flex items-center">
            <Typography
              type="body"
              color={
                currentVisit?.attended &&
                (stepType?.color || ratingData?.color !== 'successMain')
                  ? ratingData?.color
                  : stepType?.color || 'textMid'
              }
              className="mr-4"
              text={`${currentVisit?.attended ? '' : 'By '}${new Date(
                currentVisit?.attended
                  ? currentVisit?.actualVisitDate
                  : currentVisit?.plannedVisitDate
              ).toLocaleDateString('en-ZA', dateOptions)}`}
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
        color: currentVisit?.attended && ratingData?.color,
        inProgressStepIcon:
          (stepType?.color && currentVisit?.attended && 'CheckIcon') ||
          (stepType?.color && 'ExclamationCircleIcon'),
        extraData: {
          date: currentVisit?.attended
            ? new Date(currentVisit?.actualVisitDate)
            : new Date(currentVisit?.plannedVisitDate),
        },
        showActionButton:
          reAccreditationVisits.length === 1 && currentVisit?.hasAnswerData,
        actionButtonText: 'View',
        actionButtonTextColor: 'secondary',
        actionButtonIsLoading: isLoading,
        actionButtonOnClick: () => {
          const item = reAccreditationVisits[0];
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
        showAccordion: reAccreditationVisits.length > 1,
        accordionContent: (
          <ReAccreditationVisits
            isLoading={isLoading}
            practitionerId={practitionerId}
            reAccreditationVisits={reAccreditationVisits}
            onView={onView}
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
