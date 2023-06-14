import { Button, Colours, StepItem, Typography } from '@ecdlink/ui';
import { Maybe, TraineeOnBoardTimeline, Visit } from '@ecdlink/graphql';
import {
  CalendarIcon,
  PhoneIcon,
  ClipboardCheckIcon,
} from '@heroicons/react/solid';
// import { generalSupportVisitTypes } from './coach-practitioner-journey.types';

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
    case 'consolidation meeting scheduled':
      return { type: 'inProgress' };
    case 'warning':
      return { type: 'inProgress', color: 'alertDark' };
    case 'error':
      return { type: 'inProgress', color: 'alertDark' };
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
        (status === 'Consolidation meeting scheduled' && 'CalendarIcon') ||
        ((color === 'Warning' || color === 'Error') && 'ExclamationCircleIcon'),
      subTitleColor: getStepType(color)?.color || '',
      completedStepIcon: status === 'Community support gained' && 'ThumbUpIcon',
      type:
        status === 'Consolidation meeting scheduled'
          ? 'inProgress'
          : getStepType(color).type,
      extraData: { date: date ? new Date(date) : null },
      showActionButton: status === 'Community support gained' ? true : false,
    } as StepItem;
  }

  return {
    title: status,
    subTitle: getStepDate(date),
    inProgressStepIcon:
      (color === 'Warning' || color === 'Error') && 'ExclamationCircleIcon',
    subTitleColor: getStepType(color)?.color || '',
    completedStepIcon: status === 'Community support gained' && 'ThumbUpIcon',
    type: getStepType(color).type,
    extraData: { date: date ? new Date(date) : null },
  } as StepItem;
};

export const timelineSteps = (
  timeline: TraineeOnBoardTimeline,
  onView: (visit: Visit) => void,
  isLoading: boolean,
  isOnline: boolean,
  visits?: Maybe<Visit>[]
): StepItem[] => {
  const steps: (StepItem<{ date?: Date }> | {})[] = [];

  steps.push(
    setStep(
      timeline?.starterLicenseStatus || 'Starter Licence',
      timeline?.starterLicenseDate,
      timeline?.starterLicenseColor
    )
  );
  steps.push(
    setStep(
      timeline?.smartSpaceLicenseStatus || 'SmartSpace Licence',
      timeline?.smartSpaceLicenseDate,
      timeline?.smartSpaceLicenseColor
    )
  );
  steps.push(
    setStep(
      timeline?.consolidationMeetingStatus || 'Consolidation meeting scheduled',
      timeline?.consolidationMeetingDate || timeline?.consolidationDeadlineDate,
      timeline?.consolidationMeetingColor
    )
  );
  steps.push(
    setStep(
      timeline?.smartSpaceChecklistStatus || 'Fill in the SmartSpace checklist',
      timeline?.smartSpaceChecklistDate ||
        timeline?.smartSpaceChecklistDeadlineDate,
      timeline?.smartSpaceChecklistColor
    )
  );
  steps.push(
    setStep(
      timeline?.communitySupportStatus || 'Get community support',
      timeline?.communitySupportDate || timeline?.communitySupportDeadlineDate,
      timeline?.communitySupportColor
    )
  );
  steps.push(
    setStep(
      timeline?.threeChildrenRegisteredStatus || 'Register 3 children',
      timeline?.threeChildrenRegisteredDate ||
        timeline?.threeChildrenRegisteredDeadlineDate,
      timeline?.threeChildrenRegisteredColor
    )
  );
  steps.push(
    setStep(
      timeline?.sSCoachVisitStatus || 'SmartSpace visit from coach',
      timeline?.sSCoachVisitDate || timeline?.sSCoachVisitDeadlineDate,
      timeline?.sSCoachVisitColor
    )
  );
  steps.push(
    setStep(
      timeline?.signFranchiseeAgreementStatus || 'Sign franchisee agreement',
      timeline?.signFranchiseeAgreementDate ||
        timeline?.signFranchiseeAgreementDeadlineDate,
      timeline?.signFranchiseeAgreementColor
    )
  );
  steps.push(
    setStep(
      timeline?.signStartUpSupportAgreementStatus ||
        'Sign start-up support agreement',
      timeline?.signStartUpSupportAgreementDate ||
        timeline?.signStartUpSupportAgreementDeadlineDate,
      timeline?.signStartUpSupportAgreementColor
    )
  );

  return steps as StepItem<{ date: Date }>[];
};
