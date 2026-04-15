import { EcdRegistrationDto } from '@ecdlink/core';
import { StepItem } from '@ecdlink/ui';

export interface RegistrationTimelineStepsProps {
  isLoading?: boolean;
  onView: (section: string) => void;
  ecdRegistration: EcdRegistrationDto | undefined;
}

export const registrationTimelineSteps = ({
  isLoading = false,
  onView,
  ecdRegistration,
}: RegistrationTimelineStepsProps): StepItem[] => {
  const steps: StepItem[] = [];

  if (
    !ecdRegistration?.hasBronzeCertificate &&
    !ecdRegistration?.hasSilverCertificate &&
    !ecdRegistration?.hasGoldCertificate
  ) {
    steps.push(
      {
        title: `Apply`,
        subTitle: 'Get a Bronze certificate',
        subTitleColor: 'textMid',
        completedStepIcon: 'CheckIcon',
        type: 'todo',
        showActionButton: true,
        actionButtonText: 'Info',
        actionButtonColor: 'secondaryAccent2',
        actionButtonTextColor: 'secondary',
        actionButtonOnClick: () => onView?.('Apply'),
      },
      {
        title: `Comply`,
        subTitle: 'Meet the standards',
        subTitleColor: 'textMid',
        completedStepIcon: 'CheckIcon',
        type: 'todo',
        showActionButton: true,
        actionButtonText: 'Info',
        actionButtonColor: 'secondaryAccent2',
        actionButtonTextColor: 'secondary',
        actionButtonOnClick: () => onView?.('Comply'),
      }
    );
  }

  if (
    ecdRegistration?.hasBronzeCertificate &&
    !ecdRegistration?.hasSilverCertificate &&
    !ecdRegistration?.hasGoldCertificate
  ) {
    steps.push(
      {
        title: `Apply`,
        subTitle: 'Bronze certificate',
        subTitleColor: 'textMid',
        completedStepIcon: 'CheckIcon',
        type: 'completed',
        showActionButton: true,
        actionButtonText: 'View',
        actionButtonColor: 'secondaryAccent2',
        actionButtonTextColor: 'secondary',
        actionButtonOnClick: () => onView?.('Apply'),
      },
      {
        title: `Comply`,
        subTitle: 'Meet the standards',
        subTitleColor: 'textMid',
        completedStepIcon: 'CheckIcon',
        type: 'todo',
        showActionButton: true,
        actionButtonText: 'Info',
        actionButtonColor: 'secondaryAccent2',
        actionButtonTextColor: 'secondary',
        actionButtonOnClick: () => onView?.('Comply'),
      }
    );
  }

  if (
    ecdRegistration?.hasSilverCertificate ||
    ecdRegistration?.hasGoldCertificate
  ) {
    steps.push(
      {
        title: `Apply`,
        subTitle: 'Bronze certificate',
        subTitleColor: 'textMid',
        completedStepIcon: 'CheckIcon',
        type: 'completed',
        showActionButton: true,
        actionButtonText: 'View',
        actionButtonColor: 'secondaryAccent2',
        actionButtonTextColor: 'secondary',
        actionButtonOnClick: () => onView?.('Apply'),
      },
      {
        title: `Comply`,
        subTitle: 'Silver certificate',
        subTitleColor: 'textMid',
        completedStepIcon: 'CheckIcon',
        type: 'completed',
        showActionButton: true,
        actionButtonText: 'View',
        actionButtonColor: 'secondaryAccent2',
        actionButtonTextColor: 'secondary',
        actionButtonOnClick: () => onView?.('Comply'),
      }
    );
  }

  return steps;
};
