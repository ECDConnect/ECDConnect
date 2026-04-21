import { EcdRegistrationDto } from '@ecdlink/core';
import { NonSubsidyRegistrationType, SubsidyStatus } from '@ecdlink/graphql';
import { StepItem } from '@ecdlink/ui';

type RegistrationSection = 'Apply' | 'Comply';

export interface RegistrationTimelineStepsProps {
  isLoading?: boolean;
  onView: (section: RegistrationSection) => void;
  ecdRegistration: EcdRegistrationDto | undefined;
}

export const registrationTimelineSteps = ({
  onView,
  ecdRegistration,
}: RegistrationTimelineStepsProps): StepItem[] => {
  const hasBronze = ecdRegistration?.hasBronzeCertificate ?? false;
  const hasSilverOrGold =
    (ecdRegistration?.hasSilverCertificate ?? false) ||
    (ecdRegistration?.hasGoldCertificate ?? false);
  const registrationStatus =
    ecdRegistration?.registrationType ===
      NonSubsidyRegistrationType.FullyRegistered ||
    ecdRegistration?.registrationType ===
      NonSubsidyRegistrationType.PartiallyRegistered;
  const hasSubsidy = ecdRegistration?.subsidy === SubsidyStatus.Yes;

  const applyCompleted =
    hasSubsidy || registrationStatus || hasBronze || hasSilverOrGold;
  const complyCompleted = hasSubsidy || registrationStatus || hasSilverOrGold;

  return [
    {
      title: 'Apply',
      subTitle: applyCompleted
        ? 'Bronze certificate'
        : 'Get a Bronze certificate',
      subTitleColor: 'textMid',
      completedStepIcon: 'CheckIcon',
      type: applyCompleted ? 'completed' : 'todo',
      showActionButton: true,
      actionButtonText: applyCompleted ? 'View' : 'Info',
      actionButtonColor: 'secondaryAccent2',
      actionButtonTextColor: 'secondary',
      actionButtonOnClick: () => onView('Apply'),
    },
    {
      title: 'Comply',
      subTitle: complyCompleted ? 'Silver certificate' : 'Meet the standards',
      subTitleColor: 'textMid',
      completedStepIcon: 'CheckIcon',
      type: complyCompleted ? 'completed' : 'todo',
      showActionButton: true,
      actionButtonText: complyCompleted ? 'View' : 'Info',
      actionButtonColor: 'secondaryAccent2',
      actionButtonTextColor: 'secondary',
      actionButtonOnClick: () => onView('Comply'),
    },
  ];
};
