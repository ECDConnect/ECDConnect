import { useState } from 'react';
import { TraineeAddSignature } from './components/trainee-add-signature/trainee-add-signature';
import { OnboardingTraineeDashboard } from './components/trainee-onboarding-dashboard/trainee-onboarding-dashboard';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { TraineeFranchisorAgreement } from './components/trainee-franchisor-agreement/trainee-franchisor-agreement';
import { StartupSupportAgreement } from './components/startup-support-agreement/startup-support-agreement';
import { GetCommunitySupport } from './components/get-community-support/get-community-support';
import { SmartSpaceChecklist } from './components/smart-space-checklist/smart-space-checklist';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';

export const TraineeOnboarding = () => {
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const [notificationStep, setNotificationStep] = useState('');
  const history = useHistory();

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
      case 'SmartSpaceChecklist':
        return (
          <SmartSpaceChecklist setNotificationStep={setNotificationStep} />
        );
      case 'GetCommunitySupport':
        return (
          <GetCommunitySupport setNotificationStep={setNotificationStep} />
        );
      case 'Register3Children':
        return history.push(ROUTES.CLASSROOM, { activeTabIndex: 1 });
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
