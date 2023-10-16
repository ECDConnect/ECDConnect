import { useState } from 'react';
import { useLocation } from 'react-router';
import { OnboardingTraineeDashboard } from './trainee-onboarding-dashboard';
import { StartupSupportDetails } from './components/startup-support';
import { PractitionerDto } from '@ecdlink/core';
import { SmartSpaceChecklist } from './components/smart-space-checklist/smart-space-checklist';
import { SmartSpaceVisit } from './components/smart-space-visit/smart-space-visit';
import { SmartSpaceSummary } from './components/smart-space-summary/smart-space-summary';
import { TraineeAddSignature } from '../../../../trainee/trainee-onboarding/components/trainee-add-signature/trainee-add-signature';
import { CoachTraineeFranchisorAgreement } from './components/smart-space-visit/trainee-franchisor-agreement/trainee-franchisor-agreement';

interface TraineeOnboardingProps {
  practitioner: PractitionerDto | undefined;
  setShowTraineeDashboard: any;
}

export interface TraineeOnboardingRouteState {
  practitionerState: PractitionerDto;
}

export const CoachTraineeOnboarding: React.FC<TraineeOnboardingProps> = ({
  practitioner,
  setShowTraineeDashboard,
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
          return <TraineeAddSignature />;
        }
        return (
          <CoachTraineeFranchisorAgreement
            practitioner={practitioner || practitionerState}
            setNotificationStep={setNotificationStep}
          />
        );
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
          <SmartSpaceVisit
            onDone={onDone}
            practitioner={practitioner || practitionerState}
            options={stepOptions}
          />
        );
      case 'SmartSpace Licence not awarded':
        return (
          <SmartSpaceSummary
            practitioner={practitioner || practitionerState}
            setNotificationStep={setNotificationStep}
          />
        );
      case 'SmartSpace Licence received':
        return (
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
            setShowTraineeDashboard={setShowTraineeDashboard}
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
