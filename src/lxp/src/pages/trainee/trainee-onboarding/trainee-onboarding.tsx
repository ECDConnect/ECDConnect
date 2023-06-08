import { useState } from 'react';
import { TraineeAddSignature } from './components/trainee-add-signature/trainee-add-signature';
import { OnboardingTraineeDashboard } from './components/trainee-onboarding-dashboard/trainee-onboarding-dashboard';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { TraineeFranchisorAgreement } from './components/trainee-franchisor-agreement/trainee-franchisor-agreement';
import { StartupSupportAgreement } from './components/startup-support-agreement/startup-support-agreement';
import { GetCommunitySupport } from './components/get-community-support/get-community-support';

export const TraineeOnboarding = () => {
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const [notificationStep, setNotificationStep] = useState('');

  const renderStep = (step: string) => {
    switch (step) {
      case 'signupFranchisor':
        if (practitioner?.signingSignature) {
          return <TraineeAddSignature />;
        }
        return (
          <TraineeFranchisorAgreement
            setNotificationStep={setNotificationStep}
          />
        );
      case 'startupSupportAgreement':
        return (
          <StartupSupportAgreement setNotificationStep={setNotificationStep} />
        );
      case 'GetCommunitySupport':
        return (
          <GetCommunitySupport setNotificationStep={setNotificationStep} />
        );
      default:
        return (
          <OnboardingTraineeDashboard
            setNotificationStep={setNotificationStep}
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
