import { useEffect, useState } from 'react';
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
import { useAppDispatch } from '@/store';
import { traineeThunkActions } from '@/store/trainee';
import { userSelectors } from '@/store/user';

export const TraineeOnboarding = () => {
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const [notificationStep, setNotificationStep] = useState('');
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const user = useSelector(userSelectors.getUser);
  const [isSmartChecklist, setIsSmartChecklist] = useState(false);

  const updateTimeline = async () => {
    await appDispatch(
      traineeThunkActions.getTraineeTimeline({
        userId: user?.id ? user?.id : '',
      })
    );
  };

  useEffect(() => {
    if (notificationStep === '') {
      updateTimeline();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationStep]);

  const renderStep = (step: string) => {
    switch (step) {
      case 'Sign franchisee agreement':
        if (practitioner?.signingSignature) {
          return <TraineeAddSignature />;
        }
        return (
          <TraineeFranchisorAgreement
            setNotificationStep={setNotificationStep}
          />
        );
      case 'Sign start-up support agreement':
        return (
          <StartupSupportAgreement setNotificationStep={setNotificationStep} />
        );
      case 'Fill in the SmartSpace checklist':
        return (
          <SmartSpaceChecklist
            setNotificationStep={setNotificationStep}
            isSmartChecklist={isSmartChecklist}
          />
        );
      case 'Get community support':
        return (
          <GetCommunitySupport setNotificationStep={setNotificationStep} />
        );
      case 'Register 3 children':
        return history.push(ROUTES.CLASSROOM, { activeTabIndex: 0 });
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
