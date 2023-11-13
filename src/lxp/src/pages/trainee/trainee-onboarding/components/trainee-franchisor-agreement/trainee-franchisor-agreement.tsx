import { BannerWrapper } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useEffect, useState } from 'react';
import { ReadAndAcceptAgreement } from './components/read-and-accept-agreement';
import { ProgrammeTypeAgreement } from './components/programme-type-agreement/programme-type-agreement';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';

interface TraineeFranchisorAgreementProps {
  setNotificationStep: any;
}

export const TraineeFranchisorAgreement: React.FC<
  TraineeFranchisorAgreementProps
> = ({ setNotificationStep }) => {
  const { isOnline } = useOnlineStatus();
  const [agreementStep, setAgreementStep] = useState('');
  const [agreementStepCount, setAgreementStepCount] = useState('Step 1 of 2');
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);

  const franchisorAgreementSigned =
    timeline?.signFranchiseeAgreementStatus === 'Franchisee agreement signed';

  const renderStep = (step: string) => {
    switch (step) {
      case 'programmeTypeAgreement':
        return (
          <ProgrammeTypeAgreement
            setNotificationStep={setNotificationStep}
            setAgreementStep={setAgreementStep}
          />
        );
      default:
        return (
          <ReadAndAcceptAgreement
            setAgreementStep={setAgreementStep}
            franchisorAgreementSigned={franchisorAgreementSigned}
          />
        );
    }
  };

  useEffect(() => {
    if (agreementStep === 'programmeTypeAgreement') {
      setAgreementStepCount('Step 2 of 2');
    }
  }, [agreementStep]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Franchisee agreement'}
      subTitle={agreementStepCount}
      color={'primary'}
      onBack={() => setNotificationStep('')}
      displayOffline={!isOnline}
      className="pb-16"
    >
      <div className="h-screen">{renderStep(agreementStep)}</div>
    </BannerWrapper>
  );
};
