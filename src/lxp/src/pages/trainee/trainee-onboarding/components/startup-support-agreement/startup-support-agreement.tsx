import { BannerWrapper } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useEffect, useState } from 'react';
import { StartupAcceptAgreement1 } from './components/startup-accept-agreement1/startup-accept-agreement1';
import { StartupAcceptAgreement2 } from './components/startup-accept-agreement2/startup-accept-agreement2';
import { StartupAcceptAgreement3 } from './components/startup-accept-agreement3/startup-accept-agreement3';
import { SectionQuestions } from '../smart-space-checklist/components/programme-details/programme-details.types';
import { StartupAcceptAgreement4 } from './components/startup-accept-agreement4/startup-accept-agreement4';
import {
  CmsVisitSectionInput,
  InputMaybe,
  SupportVisitModelInput,
} from '@ecdlink/graphql';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';
import { practitionerSelectors } from '@/store/practitioner';
import { TraineeService } from '@/services/TraineeService';
import { authSelectors } from '@/store/auth';
import { StartupAgreementSteps } from './startup-accept-agreement.types';
import { ProofOfBanking } from './components/proof-of-banking/proof-of-banking';
interface StartupSupportAgreementProps {
  setNotificationStep: any;
}

export const StartupSupportAgreement: React.FC<
  StartupSupportAgreementProps
> = ({ setNotificationStep }) => {
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [agreementStep, setAgreementStep] = useState(0);
  const [agreementStepCount, setAgreementStepCount] = useState('Step 1 of 4');
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);

  const startupSupportAgreementSigned =
    timeline?.signStartUpSupportAgreementStatus ===
    'Start-up support agreement signed';

  const onAllStepsComplete = async () => {
    const sections = sectionQuestions?.map((item, index) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

    const visitDateInput: SupportVisitModelInput = {
      traineeId: practitioner?.userId,
      plannedVisitDate: new Date(),
      attended: true,
      supportData: {
        traineeId: practitioner?.userId,
        visitData: {
          visitName: 'Startup Support',
          sections,
        },
      },
    };

    await new TraineeService(
      userAuth?.auth_token!
    ).addStartupSupportAgreementForTrainee(visitDateInput);

    setNotificationStep('');
  };

  const renderStep = (step: number) => {
    switch (step) {
      case StartupAgreementSteps.STARTUP_ACCEPT_AGREEMENT2:
        return (
          <StartupAcceptAgreement2
            setAgreementStep={setAgreementStep}
            setSectionQuestions={setSectionQuestions}
            sectionQuestions={sectionQuestions}
          />
        );
      case StartupAgreementSteps.STARTUP_ACCEPT_AGREEMENT3:
        return (
          <StartupAcceptAgreement3
            setAgreementStep={setAgreementStep}
            setSectionQuestions={setSectionQuestions}
            sectionQuestions={sectionQuestions}
            onAllStepsComplete={onAllStepsComplete}
          />
        );
      case StartupAgreementSteps.STARTUP_ACCEPT_AGREEMENT4:
        return (
          <StartupAcceptAgreement4
            setAgreementStep={setAgreementStep}
            setSectionQuestions={setSectionQuestions}
            sectionQuestions={sectionQuestions}
            onAllStepsComplete={onAllStepsComplete}
          />
        );
      case StartupAgreementSteps.STARTUP_ACCEPT_AGREEMENT5:
        return (
          <ProofOfBanking
            setAgreementStep={setAgreementStep}
            setSectionQuestions={setSectionQuestions}
            sectionQuestions={sectionQuestions}
            onAllStepsComplete={onAllStepsComplete}
          />
        );
      default:
        return (
          <StartupAcceptAgreement1
            setAgreementStep={setAgreementStep}
            setSectionQuestions={setSectionQuestions}
            startupSupportAgreementSigned={startupSupportAgreementSigned}
          />
        );
    }
  };

  useEffect(() => {
    if (agreementStep === StartupAgreementSteps.STARTUP_ACCEPT_AGREEMENT1) {
      setAgreementStepCount('Step 1 of 4');
    }
    if (agreementStep === StartupAgreementSteps.STARTUP_ACCEPT_AGREEMENT2) {
      setAgreementStepCount('Step 2 of 4');
    }
    if (agreementStep === StartupAgreementSteps.STARTUP_ACCEPT_AGREEMENT3) {
      setAgreementStepCount('Step 3 of 4');
    }
    if (agreementStep === StartupAgreementSteps.STARTUP_ACCEPT_AGREEMENT4) {
      setAgreementStepCount('Step 4 of 4');
    }
    if (agreementStep === StartupAgreementSteps.STARTUP_ACCEPT_AGREEMENT5) {
      setAgreementStepCount('Step 4 of 4');
    }
  }, [agreementStep]);

  const handleBackButton = () => {
    if (agreementStep === 0) {
      setNotificationStep('');
      return;
    }

    if ((agreementStep: number) => 1 && agreementStep !== 4) {
      setAgreementStep(agreementStep - 1);
      return;
    }
    if (agreementStep === 4) {
      setAgreementStep(agreementStep - 2);
      return;
    }
    setNotificationStep('');
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Start-up support agreement'}
      subTitle={agreementStepCount}
      color={'primary'}
      onBack={handleBackButton}
      displayOffline={!isOnline}
      className="pb-16"
    >
      <div className="h-screen">{renderStep(agreementStep)}</div>
    </BannerWrapper>
  );
};
