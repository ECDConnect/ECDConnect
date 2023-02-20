import { Alert } from '@ecdlink/ui';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import Infant from '@/assets/infant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { HealthPromotion } from './health-promotion';

export const NewbornCareStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  // TODO: add integration
  const isFirstVisit = true;

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <HealthPromotion
        clientName={name || ''}
        onClose={() => setIsTip && setIsTip(false)}
      />
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title="Newborn care"
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />

        <Alert
          type="warning"
          title={
            isFirstVisit
              ? `Show family members how to clean the baby’s eyes and cord.`
              : 'Observe how the mother or family member cleans the baby’s eyes and cord and offer support.'
          }
          titleColor="textDark"
          customIcon={
            <div className="bg-primary rounded-full">
              <Polly className="h-14 w-14" />
            </div>
          }
        />
      </div>
    </>
  );
};
