import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { useHistory } from 'react-router';
import { useAppDispatch } from '@/store';
import { traineeThunkActions } from '@/store/trainee';
import { userSelectors } from '@/store/user';
import { OnboardingTraineeDashboard } from './trainee-onboarding-dashboard';
import { StartupSupportDetails } from './components/startup-support';
import { PractitionerDto } from '@ecdlink/core';
import { SmartSpaceChecklist } from './components/smart-space-checklist/smart-space-checklist';
import { SmartSpaceVisit } from './components/smart-space-visit/smart-space-visit';

interface TraineeOnboardingProps {
  practitioner: PractitionerDto | undefined;
}

export const TraineeOnboarding: React.FC<TraineeOnboardingProps> = ({
  practitioner,
}) => {
  const [notificationStep, setNotificationStep] = useState('');
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const user = useSelector(userSelectors.getUser);
  const [isSmartChecklist, setIsSmartChecklist] = useState(false);

  const renderStep = (step: string) => {
    switch (step) {
      case 'Sign franchisee agreement':
        if (practitioner?.signingSignature) {
          return null;
        }
        return null;
      case 'Sign start-up support agreement':
        return (
          <StartupSupportDetails
            practitioner={practitioner}
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
        return <SmartSpaceVisit practitioner={practitioner} />;
      default:
        return (
          <OnboardingTraineeDashboard
            setNotificationStep={setNotificationStep}
            setIsSmartChecklist={setIsSmartChecklist}
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
