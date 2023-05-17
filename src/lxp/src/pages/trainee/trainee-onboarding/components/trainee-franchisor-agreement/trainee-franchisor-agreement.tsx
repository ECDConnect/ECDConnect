import { BannerWrapper, Typography } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { ReadAndAcceptAgreement } from './components/read-and-accept-agreement';

interface TraineeFranchisorAgreementProps {
  setNotificationStep: any;
}

export const TraineeFranchisorAgreement: React.FC<
  TraineeFranchisorAgreementProps
> = ({ setNotificationStep }) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const [agreementStep, setAgreementStep] = useState('');

  const renderStep = (step: string) => {
    switch (step) {
      case 'programmeTypeAgreement':
        return null;
      default:
        return <ReadAndAcceptAgreement setAgreementStep={setAgreementStep} />;
    }
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Business'}
      subTitle={'Step 1 of 1'}
      color={'primary'}
      onBack={history.goBack}
      displayOffline={!isOnline}
      renderOverflow={true}
    >
      <div className="h-screen">{renderStep(agreementStep)}</div>
    </BannerWrapper>
  );
};
