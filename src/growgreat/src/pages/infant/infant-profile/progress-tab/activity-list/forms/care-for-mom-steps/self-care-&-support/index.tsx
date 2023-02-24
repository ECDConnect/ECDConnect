import { Alert } from '@ecdlink/ui';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect } from 'react';
import { HealthPromotion } from './health-promotion';

export const SelfCareAndSupportStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <HealthPromotion
        clientName={infant?.caregiver?.firstName || ''}
        onClose={() => setIsTip && setIsTip(false)}
      />
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title="Self care & support"
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />

        <Alert
          type="warning"
          title={`Discuss how ${infant?.caregiver?.firstName}'s family can support her as a new mom.`}
          message={`Ask ${infant?.caregiver?.firstName} if she has decided on a family planning method.`}
          titleColor="textDark"
          messageColor="textMid"
          customIcon={
            <div className="bg-primary h-14 w-14 rounded-full">
              <Polly className="h-14 w-14" />
            </div>
          }
        />
      </div>
    </>
  );
};
