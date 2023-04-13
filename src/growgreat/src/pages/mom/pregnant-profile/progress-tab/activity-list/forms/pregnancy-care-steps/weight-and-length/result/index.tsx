import { Header } from '@/pages/infant/infant-profile/components';
import { Alert } from '@ecdlink/ui';
import { Fragment, useEffect } from 'react';
import { DynamicFormProps } from '../../../dynamic-form';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import Pregnant from '@/assets/pregnant.svg';
import { TipCard } from '@/pages/mom/pregnant-profile/components';
import { HealthPromotion } from '../../../components/health-promotion';

export const WeightAndLengthResultStep = ({
  mother,
  sectionQuestions,
  setEnableButton,
  setIsTip,
  isTipPage,
}: DynamicFormProps) => {
  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  const visitSection = 'Pregnancy care';
  const name = mother?.user?.firstName;

  if (isTipPage) {
    return (
      <HealthPromotion
        title={`Discuss with ${name}`}
        subTitle={visitSection}
        section={visitSection}
        client={name}
        onClose={() => setIsTip && setIsTip(false)}
      />
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title="Pregnancy care"
      />

      <div className="relative flex flex-col gap-3 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Alert
          type="warning"
          title={`Discuss pregnancy care with ${mother?.user?.firstName}.`}
          titleColor="textDark"
          customIcon={
            <div className="bg-tertiary h-14 w-14 rounded-full">
              <Polly className="h-14 w-14" />
            </div>
          }
        />
      </div>
    </>
  );
};
