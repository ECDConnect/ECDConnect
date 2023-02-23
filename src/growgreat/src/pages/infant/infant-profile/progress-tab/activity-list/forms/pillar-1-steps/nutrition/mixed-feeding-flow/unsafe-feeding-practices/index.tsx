import { Alert } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { HealthPromotion } from './health-promotion';
import LanguageSelector from '@/components/language-selector/language-selector';
// @ts-ignore
import mockedVideo from '../../../../assets/mocked.mp4';

export const MixedUnsafeFeedingPracticesStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
  onNextStep,
}: DynamicFormProps) => {
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <HealthPromotion
        clientName={caregiverName}
        onClose={() => setIsTip && setIsTip(false)}
      />
    );
  }

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title="Mixed feeding"
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Alert
          type="warning"
          title={`Watch the video on Unsafe Feeding Practices with ${caregiverName} and answer any questions.`}
          titleColor="textDark"
          customIcon={
            <div className="rounded-full">
              <PollyNeutral className="h-16 w-16" />
            </div>
          }
        />
        <LanguageSelector selectLanguage={() => {}} />
        <video src={mockedVideo} controls className="rounded-3xl" />
      </div>
    </>
  );
};
