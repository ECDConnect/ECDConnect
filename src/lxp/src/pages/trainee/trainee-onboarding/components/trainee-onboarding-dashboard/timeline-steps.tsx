import { Colours, StepItem } from '@ecdlink/ui';
import { Maybe, TraineeOnBoardTimeline, Visit } from '@ecdlink/graphql';
import { store } from '@/store';

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const nextStepButtontext = (step: string) => {
  switch (step) {
    case 'Fill in the SmartSpace checklist':
      return 'See checklist';
    case 'Get community support':
      return 'Learn more';
    case 'Register 3 children':
      return 'Add child';
    case 'Sign franchisee agreement':
      return 'Sign';
    case 'Sign start-up support agreement':
      return 'Sign';
    case 'SmartSpace visit from coach':
      return 'Request visit';
    default:
      return '';
  }
};

const nextStepButtonIcon = (step: string) => {
  switch (step) {
    case 'Fill in the SmartSpace checklist':
      return 'ClipboardListIcon';
    case 'Get community support':
      return 'InformationCircleIcon';
    case 'Register 3 children':
      return 'UserAddIcon';
    case 'Sign franchisee agreement':
      return 'PencilAltIcon';
    case 'Sign start-up support agreement':
      return 'PencilAltIcon';
    default:
      return '';
  }
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

const state = store.getState();
const { trainee: traineDataState } = state;
const traineeTimelineData = traineDataState?.traineeOnboardTimeline;
export const setStep = (
  status?: Maybe<string>,
  date?: string,
  color?: Maybe<string>,
  onView?: (text: string) => void,
  nextStep?: string,
  consolidationMeetingDataStatus?: Maybe<string>
) => {
  const startLicenceStatus = traineeTimelineData?.starterLicenseStatus;
  const lincenceReceveid = 'Starter Licence received';
  const smartSpaceLincenceReceveid = 'SmartSpace Licence received';
  const consolidationMeetingAttended =
    consolidationMeetingDataStatus === 'Consolidation meeting attended';
  const starterLicenceReceived =
    startLicenceStatus === 'SmartSpace Licence received' ||
    'Starter Licence received';
  const stepCompleted =
    color?.toLowerCase() === 'success' &&
    status !== lincenceReceveid &&
    status !== smartSpaceLincenceReceveid;
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
        status === 'Consolidation meeting attended'
          ? 'inProgress'
          : getStepType(color).type,
      extraData: { date: date ? new Date(date) : null },
      showActionButton:
        (stepCompleted ||
          (nextStep === status && starterLicenceReceived) ||
          (consolidationMeetingAttended &&
            status === 'Get community support') ||
          (consolidationMeetingAttended &&
            status === 'Fill in the SmartSpace checklist') ||
          (consolidationMeetingAttended &&
            status === 'Sign start-up support agreement') ||
          (consolidationMeetingAttended && status === 'Register 3 children')) &&
        status !== 'Consolidation meeting attended'
          ? true
          : false,
      actionButtonText: stepCompleted ? 'View' : nextStepButtontext(status),
      actionButtonTextColor: stepCompleted ? 'secondary' : 'primary',
      actionButtonColor: stepCompleted ? 'secondaryAccent2' : 'primary',
      actionButtonIcon: stepCompleted ? '' : nextStepButtonIcon(status),
      actionButtonOnClick: onView,
      actionButtonType: stepCompleted ? 'filled' : 'outlined',
      actionButtonIconStartPosition: stepCompleted ? false : true,
      actionButtonClassName: stepCompleted
        ? ''
        : 'w-full whitespace-nowrap p-2 mt-2',
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
  onView: (notificationStep: string) => void,
  isLoading: boolean,
  isOnline: boolean,
  visits?: Maybe<Visit>[],
  nextStep?: string,
  consolidationMeetingDataStatus?: Maybe<string> | undefined,
  isOnStipend?: boolean
): StepItem[] => {
  const steps: (StepItem<{ date?: Date }> | {})[] = [];
  steps.push(
    setStep(
      timeline?.starterLicenseStatus || 'Starter Licence',
      timeline?.starterLicenseDate,
      timeline?.starterLicenseColor,
      () => onView('Starter Licence'),
      nextStep,
      consolidationMeetingDataStatus
    )
  );
  steps.push(
    setStep(
      timeline?.consolidationMeetingStatus || 'Consolidation meeting scheduled',
      timeline?.consolidationMeetingDate || timeline?.consolidationDeadlineDate,
      timeline?.consolidationMeetingColor,
      () => onView('Consolidation meeting scheduled'),
      nextStep,
      consolidationMeetingDataStatus
    )
  );
  steps.push(
    setStep(
      timeline?.smartSpaceChecklistStatus || 'Fill in the SmartSpace checklist',
      timeline?.smartSpaceChecklistDate ||
        timeline?.smartSpaceChecklistDeadlineDate,
      timeline?.smartSpaceChecklistColor,
      () => onView('Fill in the SmartSpace checklist'),
      nextStep,
      consolidationMeetingDataStatus
    )
  );
  steps.push(
    setStep(
      timeline?.communitySupportStatus || 'Get community support',
      timeline?.communitySupportDate || timeline?.communitySupportDeadlineDate,
      timeline?.communitySupportColor,
      () => onView('Get community support'),
      nextStep,
      consolidationMeetingDataStatus
    )
  );
  steps.push(
    setStep(
      timeline?.threeChildrenRegisteredStatus || 'Register 3 children',
      timeline?.threeChildrenRegisteredDate ||
        timeline?.threeChildrenRegisteredDeadlineDate,
      timeline?.threeChildrenRegisteredColor,
      () => onView('Register 3 children'),
      nextStep,
      consolidationMeetingDataStatus
    )
  );
  steps.push(
    setStep(
      timeline?.sSCoachVisitStatus || 'SmartSpace visit from coach',
      timeline?.sSCoachVisitDate || timeline?.sSCoachVisitDeadlineDate,
      timeline?.sSCoachVisitColor,
      () => onView('SmartSpace visit from coach'),
      nextStep,
      timeline?.sSCoachVisitStatus
    )
  );
  steps.push(
    setStep(
      timeline?.signFranchiseeAgreementStatus || 'Sign franchisee agreement',
      timeline?.signFranchiseeAgreementDate ||
        timeline?.signFranchiseeAgreementDeadlineDate,
      timeline?.signFranchiseeAgreementColor,
      () => onView('Sign franchisee agreement'),
      nextStep,
      consolidationMeetingDataStatus
    )
  );
  if (isOnStipend) {
    steps.push(
      setStep(
        timeline?.signStartUpSupportAgreementStatus ||
          'Sign start-up support agreement',
        timeline?.signStartUpSupportAgreementDate ||
          timeline?.signStartUpSupportAgreementDeadlineDate,
        timeline?.signStartUpSupportAgreementColor,
        () => onView('Sign start-up support agreement'),
        nextStep,
        consolidationMeetingDataStatus
      )
    );
  }

  return steps as StepItem<{ date: Date }>[];
};
