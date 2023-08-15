import { Colours, StepItem } from '@ecdlink/ui';
import { Maybe, TraineeOnBoardTimeline, Visit } from '@ecdlink/graphql';

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

export const setStep = (
  status?: Maybe<string>,
  date?: string,
  color?: Maybe<string>,
  onView?: (text: string) => void,
  nextStep?: string
) => {
  const lincenceReceveid = 'Starter Licence received';
  const smartSpaceLincenceReceveid = 'SmartSpace Licence received';
  const register3Children = 'Register 3 children';
  const register3Children2 = '3 or more children registered';
  const communitySupport = 'Get community support';
  const coomunitySupport2 = 'Community support gained';
  const franchisorAgreement = 'Sign franchisee agreement';
  const franchisorAgreement2 = 'Franchisee agreement signed';
  const smartSpaceVisitFromCoach = 'SmartSpace visit from coach';

  const stepCompleted =
    color?.toLowerCase() === 'success' &&
    status !== lincenceReceveid &&
    status !== smartSpaceLincenceReceveid;
  const notShowButtonRules =
    status === smartSpaceVisitFromCoach ||
    (stepCompleted &&
      status !== register3Children &&
      status !== register3Children2 &&
      status !== communitySupport &&
      status !== coomunitySupport2 &&
      status !== franchisorAgreement &&
      status !== franchisorAgreement2);
  if (!!status) {
    return {
      title: status,
      subTitle: getStepDate(date),
      inProgressStepIcon:
        (status === 'Consolidation meeting scheduled' && 'CalendarIcon') ||
        ((color === 'Warning' || color === 'Error') && 'ExclamationCircleIcon'),
      subTitleColor:
        new Date(date!) < new Date() && color?.toLowerCase() !== 'success'
          ? 'alertMain'
          : getStepType(color)?.color || '',
      completedStepIcon: status === 'Community support gained' && 'ThumbUpIcon',
      type:
        status === 'Consolidation meeting attended'
          ? 'inProgress'
          : getStepType(color).type,
      extraData: { date: date ? new Date(date) : null },
      showActionButton:
        (notShowButtonRules || nextStep === status) &&
        status !== register3Children
          ? true
          : false,
      actionButtonText: stepCompleted ? 'View' : 'Schedule',
      actionButtonTextColor: stepCompleted ? 'secondary' : 'primary',
      actionButtonColor: stepCompleted ? 'secondaryAccent2' : 'primary',
      actionButtonIcon: stepCompleted ? '' : 'CalendarIcon',
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
  isOnStipend?: boolean
): StepItem[] => {
  const steps: (StepItem<{ date?: Date }> | {})[] = [];

  steps.push(
    setStep(
      timeline?.starterLicenseStatus || 'Starter Licence',
      timeline?.starterLicenseDate,
      timeline?.starterLicenseColor,
      () => onView('Starter Licence'),
      nextStep
    )
  );
  steps.push(
    setStep(
      timeline?.consolidationMeetingStatus || 'Consolidation meeting scheduled',
      timeline?.consolidationMeetingDate || timeline?.consolidationDeadlineDate,
      timeline?.consolidationMeetingColor,
      () => onView('Consolidation meeting scheduled'),
      nextStep
    )
  );
  steps.push(
    setStep(
      timeline?.smartSpaceChecklistStatus || 'Fill in the SmartSpace checklist',
      timeline?.smartSpaceChecklistDate ||
        timeline?.smartSpaceChecklistDeadlineDate,
      timeline?.smartSpaceChecklistColor,
      () => onView('Fill in the SmartSpace checklist'),
      nextStep
    )
  );
  steps.push(
    setStep(
      timeline?.communitySupportStatus || 'Get community support',
      timeline?.communitySupportDate || timeline?.communitySupportDeadlineDate,
      timeline?.communitySupportColor,
      () => onView('Get community support'),
      nextStep
    )
  );
  steps.push(
    setStep(
      timeline?.threeChildrenRegisteredStatus || 'Register 3 children',
      timeline?.threeChildrenRegisteredDate ||
        timeline?.threeChildrenRegisteredDeadlineDate,
      timeline?.threeChildrenRegisteredColor,
      () => onView('Register 3 children'),
      nextStep
    )
  );
  steps.push(
    setStep(
      timeline?.sSCoachVisitStatus || 'SmartSpace visit from coach',
      timeline?.sSCoachVisitDate || timeline?.sSCoachVisitDeadlineDate,
      timeline?.sSCoachVisitColor,
      () => onView('SmartSpace visit from coach'),
      nextStep
    )
  );
  steps.push(
    setStep(
      timeline?.signFranchiseeAgreementStatus || 'Sign franchisee agreement',
      timeline?.signFranchiseeAgreementDate ||
        timeline?.signFranchiseeAgreementDeadlineDate,
      timeline?.signFranchiseeAgreementColor,
      () => onView('Sign franchisee agreement'),
      nextStep
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
        nextStep
      )
    );
  }

  return steps as StepItem<{ date: Date }>[];
};
