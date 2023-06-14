import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { StartupAcceptAgreement1 } from './components/startup-accept-agreement1/startup-accept-agreement1';
import { StartupAcceptAgreement2 } from './components/startup-accept-agreement2/startup-accept-agreement2';
import { StartupAcceptAgreement3 } from './components/startup-accept-agreement3/startup-accept-agreement3';
import { SectionQuestions } from '../smart-space-checklist/components/programme-details/programme-details.types';
import { StartupAcceptAgreement4 } from './components/startup-accept-agreement4/startup-accept-agreement4';
import {
  CmsQuestionInput,
  CmsVisitDataInputModelInput,
  CmsVisitSectionInput,
  InputMaybe,
  SsChecklistVisitModelInput,
} from '@ecdlink/graphql';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';
import { practitionerSelectors } from '@/store/practitioner';
import { TraineeService } from '@/services/TraineeService';
import { authSelectors } from '@/store/auth';
import ROUTES from '@/routes/routes';
interface StartupSupportAgreementProps {
  setNotificationStep: any;
}

export const StartupSupportAgreement: React.FC<
  StartupSupportAgreementProps
> = ({ setNotificationStep }) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [agreementStep, setAgreementStep] = useState('');
  const [agreementStepCount, setAgreementStepCount] = useState('Step 1 of 4');
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const traineeTimeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline
  );
  const traineeVisitData = useSelector(traineeSelectors.getTraineeVisitData);
  const traineeVisits = traineeTimeline?.traineeVisits;
  const traineeCurrentVisit = traineeVisits?.[0];

  const onAllStepsComplete = async () => {
    const sections = sectionQuestions?.map((item) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

    const visitDateInput: CmsVisitDataInputModelInput = {
      visitId: traineeCurrentVisit?.id,
      traineeId: practitioner?.userId,
      visitData: {
        visitName: 'SmartSpace Checklist',
        sections,
      },
    };

    await new TraineeService(
      userAuth?.auth_token!
    ).addStartupSupportAgreementForTrainee(visitDateInput);

    history.push(ROUTES.TRAINEE.TRAINEE_ONBOARDING);
  };

  const renderStep = (step: string) => {
    switch (step) {
      case 'StartupAcceptAgreement2':
        return (
          <StartupAcceptAgreement2
            setAgreementStep={setAgreementStep}
            setSectionQuestions={setSectionQuestions}
            sectionQuestions={sectionQuestions}
          />
        );
      case 'StartupAcceptAgreement3':
        return (
          <StartupAcceptAgreement3
            setAgreementStep={setAgreementStep}
            setSectionQuestions={setSectionQuestions}
            sectionQuestions={sectionQuestions}
          />
        );
      case 'StartupAcceptAgreement4':
        return (
          <StartupAcceptAgreement4
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
          />
        );
    }
  };

  useEffect(() => {
    if (agreementStep === 'StartupAcceptAgreement2') {
      setAgreementStepCount('Step 2 of 4');
    }
    if (agreementStep === 'StartupAcceptAgreement3') {
      setAgreementStepCount('Step 3 of 4');
    }
    if (agreementStep === 'StartupAcceptAgreement4') {
      setAgreementStepCount('Step 4 of 4');
    }
  }, [agreementStep]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Start-up support agreement'}
      subTitle={agreementStepCount}
      color={'primary'}
      onBack={() => setNotificationStep('')}
      displayOffline={!isOnline}
      renderOverflow={true}
    >
      <div className="h-screen">{renderStep(agreementStep)}</div>
    </BannerWrapper>
  );
};
