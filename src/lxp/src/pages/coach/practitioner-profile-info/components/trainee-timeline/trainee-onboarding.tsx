import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { useHistory, useLocation } from 'react-router';
import { useAppDispatch } from '@/store';
import { traineeThunkActions } from '@/store/trainee';
import { userSelectors } from '@/store/user';
import { OnboardingTraineeDashboard } from './trainee-onboarding-dashboard';
import { StartupSupportDetails } from './components/startup-support';
import { PractitionerDto } from '@ecdlink/core';
import { SmartSpaceChecklist } from './components/smart-space-checklist/smart-space-checklist';
import { SmartSpaceVisit } from './components/smart-space-visit/smart-space-visit';
import { SmartSpaceSummary } from './components/smart-space-summary/smart-space-summary';

interface TraineeOnboardingProps {
  practitioner: PractitionerDto | undefined;
}

export interface TraineeOnboardingRouteState {
  practitionerState: PractitionerDto;
}

export const CoachTraineeOnboarding: React.FC<TraineeOnboardingProps> = ({
  practitioner,
}) => {
  const [notificationStep, setNotificationStep] = useState('');
  const [stepOptions, setStepOptions] = useState<any>(null);
  const [isSmartChecklist, setIsSmartChecklist] = useState(false);
  const { state } = useLocation<TraineeOnboardingRouteState>();
  const practitionerState = state?.practitionerState;

  const onDone = () => {
    setNotificationStep('');
  };

  const renderStep = (step: string) => {
    switch (step) {
      case 'Sign franchisee agreement':
        if (
          practitioner?.signingSignature ||
          practitionerState?.signingSignature
        ) {
          return null;
        }
        return null;
      case 'Sign start-up support agreement':
        return (
          <StartupSupportDetails
            practitioner={practitioner || practitionerState}
            setNotificationStep={setNotificationStep}
          />
        );
      case 'Fill in the SmartSpace checklist':
        return (
          <SmartSpaceChecklist setNotificationStep={setNotificationStep} />
        );
      case 'Get community support':
        return null;
      case 'Register 3 children':
        return null;
      case 'SmartSpace visit from coach':
        return (
          // <SmartSpaceVisit
          //   onDone={onDone}
          //   practitioner={practitioner || practitionerState}
          //   options={stepOptions}
          // />
          <SmartSpaceSummary
            practitioner={practitioner || practitionerState}
            setNotificationStep={setNotificationStep}
          />
        );
      default:
        return (
          <OnboardingTraineeDashboard
            setNotificationStep={(step: string, options?: any) => {
              setNotificationStep(step);
              setStepOptions(options);
            }}
            setIsSmartChecklist={setIsSmartChecklist}
            practitioner={practitioner || practitionerState}
          />
        );
    }
  };

  return (
    <>
      <div className="h-screen">{renderStep(notificationStep)}</div>
    </>
  );
};
