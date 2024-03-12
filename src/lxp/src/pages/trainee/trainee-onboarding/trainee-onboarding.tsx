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
import { CoachVisitInfo } from './components/trainee-onboarding-dashboard/components/coach-visit-info';
import { SmartSpaceDetails } from './components/trainee-onboarding-dashboard/components/smartspace-details';
import { CoachSmartSpaceChecklist } from '@/pages/coach/practitioner-profile-info/components/trainee-timeline/components/smart-space-visit/coach-smart-space-checklist/coach-smart-space-checklist';

export const TraineeOnboarding = () => {
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const [notificationStep, setNotificationStep] = useState('');
  const [showCoachVisit, setShowCoachVisit] = useState(false);
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
      case 'SmartSpace visit from coach':
        return (
          <CoachVisitInfo
            setShowCoachVisit={setShowCoachVisit}
            setNotificationStep={setNotificationStep}
          />
        );
      case 'SmartSpace Licence received':
        return (
          <SmartSpaceDetails
            setShowCoachVisit={setShowCoachVisit}
            setNotificationStep={setNotificationStep}
            practitionerUserId={practitioner?.userId || ''}
          />
        );
      case 'SmartSpace Licence not received':
        return (
          <SmartSpaceDetails
            setShowCoachVisit={setShowCoachVisit}
            setNotificationStep={setNotificationStep}
            practitionerUserId={practitioner?.userId || ''}
          />
        );
      case 'Coach SmartSpace checklist':
        return (
          <CoachSmartSpaceChecklist
            setNotificationStep={setNotificationStep}
            practitioner={practitioner}
          />
        );
      case 'Get community support':
        return (
          <GetCommunitySupport setNotificationStep={setNotificationStep} />
        );
      case 'Register 3 children':
        return history.push(ROUTES.CLASSROOM.ROOT, { activeTabIndex: 0 });
      default:
        return (
          <OnboardingTraineeDashboard
            setNotificationStep={setNotificationStep}
            setIsSmartChecklist={setIsSmartChecklist}
            practitioner={practitioner}
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
