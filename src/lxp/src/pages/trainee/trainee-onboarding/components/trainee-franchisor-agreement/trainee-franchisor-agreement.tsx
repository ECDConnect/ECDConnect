import { BannerWrapper, Typography } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { ReadAndAcceptAgreement } from './components/read-and-accept-agreement';
import { ProgrammeTypeAgreement } from './components/programme-type-agreement/programme-type-agreement';

interface TraineeFranchisorAgreementProps {
  setNotificationStep: any;
}

export const TraineeFranchisorAgreement: React.FC<
  TraineeFranchisorAgreementProps
> = ({ setNotificationStep }) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const [agreementStep, setAgreementStep] = useState('');
  const [agreementStepCount, setAgreementStepCount] = useState('Step 1 of 2');

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
        return <ReadAndAcceptAgreement setAgreementStep={setAgreementStep} />;
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
      title={'Business'}
      subTitle={agreementStepCount}
      color={'primary'}
      onBack={history.goBack}
      displayOffline={!isOnline}
      renderOverflow={true}
    >
      <div className="h-screen">{renderStep(agreementStep)}</div>
    </BannerWrapper>
  );
};
