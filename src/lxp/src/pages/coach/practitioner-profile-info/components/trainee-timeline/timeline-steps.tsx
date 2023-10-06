import { Colours, StepItem } from '@ecdlink/ui';
import { Maybe, TraineeOnBoardTimeline, Visit } from '@ecdlink/graphql';

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

export const getStepDate = (date?: string, visitEventId?: string) =>
  !!date
    ? `${!!visitEventId ? 'Scheduled' : 'By'} ${new Date(
        date
      ).toLocaleDateString('en-ZA', dateOptions)}`
    : '';

export const setStep = (
  status?: Maybe<string>,
  date?: string,
  color?: Maybe<string>,
  onView?: (text: string) => void,
  nextStep?: string,
  visitEventId?: string
): StepItem<{
  date?: Date | null;
}> => {
  const lincenceReceveid = 'Starter Licence received';
  const smartSpaceLincenceReceveid = 'SmartSpace Licence received';
  const register3Children = 'Register 3 children';
  const register3Children2 = '3 or more children registered';
  const communitySupport = 'Get community support';
  const communitySupport2 = 'Community support gained';
  const franchisorAgreement = 'Sign franchisee agreement';
  const franchisorAgreement2 = 'Franchisee agreement signed';
  const smartSpaceVisitFromCoach = 'SmartSpace visit from coach';
  const consolidationMeetingScheduled = 'Consolidation meeting scheduled';
  const consolidationMeetingAttended = 'Consolidation meeting attended';
  const licenceNotAwarded = 'SmartSpace Licence not awarded';
  const licenceAwarded = 'SmartSpace Licence received';
  const stepCompleted =
    color?.toLowerCase() === 'success' &&
    status !== lincenceReceveid &&
    status !== smartSpaceLincenceReceveid;
  const notShowButtonRules =
    status === smartSpaceVisitFromCoach ||
    status === licenceNotAwarded ||
    status === licenceAwarded ||
    (stepCompleted &&
      status !== register3Children &&
      status !== register3Children2 &&
      status !== communitySupport &&
      status !== communitySupport2 &&
      status !== franchisorAgreement &&
      status !== franchisorAgreement2 &&
      status === 'Consolidation meeting attended');
  if (!!status) {
    return {
      title: status,
      color: status === licenceNotAwarded && 'errorDark',
      subTitle: getStepDate(date, visitEventId),
      inProgressStepIcon:
        (status === licenceNotAwarded && 'XIcon') ||
        (status === consolidationMeetingScheduled && 'CalendarIcon') ||
        (status === smartSpaceVisitFromCoach &&
          !!visitEventId &&
          'CalendarIcon') ||
        ((color === 'Warning' || color === 'Error') && 'ExclamationCircleIcon'),
      subTitleColor:
        (status === licenceNotAwarded && 'errorMain') ||
        (new Date(date!) < new Date() && color?.toLowerCase() !== 'success'
          ? 'alertMain'
          : getStepType(color)?.color || ''),
      completedStepIcon: status === communitySupport2 && 'ThumbUpIcon',
      type:
        status === consolidationMeetingAttended
          ? 'inProgress'
          : getStepType(color).type,
      extraData: { date: date ? new Date(date) : null },
      showActionButton:
        (notShowButtonRules || nextStep === status) &&
        status !== register3Children
          ? true
          : false,
      actionButtonText:
        stepCompleted ||
        status === licenceNotAwarded ||
        status === licenceAwarded
          ? 'View'
          : !!visitEventId
          ? 'Start'
          : 'Schedule',
      actionButtonTextColor:
        stepCompleted ||
        status === licenceNotAwarded ||
        status === licenceAwarded
          ? 'secondary'
          : !!visitEventId
          ? 'white'
          : 'primary',
      actionButtonColor:
        stepCompleted ||
        status === licenceNotAwarded ||
        status === licenceAwarded
          ? 'secondaryAccent2'
          : 'primary',
      actionButtonIcon:
        stepCompleted ||
        status === licenceNotAwarded ||
        status === licenceAwarded
          ? ''
          : !!visitEventId
          ? 'ArrowCircleRightIcon'
          : 'CalendarIcon',
      actionButtonOnClick: onView,
      actionButtonType:
        stepCompleted ||
        status === licenceNotAwarded ||
        status === licenceAwarded ||
        !!visitEventId
          ? 'filled'
          : 'outlined',
      actionButtonIconStartPosition:
        stepCompleted || !!visitEventId ? false : true,
      actionButtonClassName: stepCompleted
        ? ''
        : 'w-full whitespace-nowrap p-2 mt-2',
    } as StepItem<{ date?: Date | null }>;
  }

  return {
    title: status,
    subTitle: getStepDate(date),
    inProgressStepIcon:
      (color === 'Warning' || color === 'Error') && 'ExclamationCircleIcon',
    subTitleColor: getStepType(color)?.color || '',
    completedStepIcon: status === communitySupport2 && 'ThumbUpIcon',
    type: getStepType(color).type,
    extraData: { date: date ? new Date(date) : null },
  } as StepItem<{ date?: Date | null }>;
};

export const timelineSteps = (
  timeline: TraineeOnBoardTimeline,
  onView: (notificationStep: string, options?: any) => void,
  isLoading: boolean,
  isOnline: boolean,
  visits?: Maybe<Visit>[],
  nextStep?: string,
  isOnStipend?: boolean
): StepItem<{
  date?: Date;
}>[] => {
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

  if (timeline?.smartSpaceLicenseNotAwardedDate) {
    steps.push(
      setStep(
        'SmartSpace Licence not awarded',
        timeline?.smartSpaceLicenseNotAwardedDate,
        'error',
        () => onView('SmartSpace Licence not awarded'),
        nextStep
      )
    );
  }

  if (timeline?.smartSpaceLicenseStatus === 'SmartSpace Licence received') {
    steps.push(
      setStep(
        'SmartSpace Licence received',
        timeline?.smartSpaceLicenseDate,
        'success',
        () => onView('SmartSpace Licence received'),
        nextStep
      )
    );
  }

  steps.push(
    setStep(
      timeline?.sSCoachVisitStatus || 'SmartSpace visit from coach',
      timeline?.sSCoachVisitDate || timeline?.sSCoachVisitDeadlineDate,
      timeline?.sSCoachVisitColor,
      () =>
        onView('SmartSpace visit from coach', {
          visitEventId: (timeline.sSCoachVisitEventId as string) || '',
          plannedVisitDate: (timeline.sSCoachVisitDate as string) || '',
          visitId: (timeline.sSCoachVisitId as string) || '',
        }),
      nextStep,
      timeline?.sSCoachVisitEventId
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
