import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { StartupAcceptAgreement1 } from './components/startup-accept-agreement1/startup-accept-agreement1';
import { StartupAcceptAgreement2 } from './components/startup-accept-agreement2/startup-accept-agreement2';
import { StartupAcceptAgreement3 } from './components/startup-accept-agreement3/startup-accept-agreement3';

interface StartupSupportAgreementProps {
  setNotificationStep: any;
}

export const StartupSupportAgreement: React.FC<
  StartupSupportAgreementProps
> = ({ setNotificationStep }) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const [agreementStep, setAgreementStep] = useState('');
  const [agreementStepCount, setAgreementStepCount] = useState('Step 1 of 4');

  const renderStep = (step: string) => {
    switch (step) {
      case 'StartupAcceptAgreement2':
        return <StartupAcceptAgreement2 setAgreementStep={setAgreementStep} />;
      case 'StartupAcceptAgreement3':
        return <StartupAcceptAgreement3 setAgreementStep={setAgreementStep} />;
      default:
        return <StartupAcceptAgreement1 setAgreementStep={setAgreementStep} />;
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
