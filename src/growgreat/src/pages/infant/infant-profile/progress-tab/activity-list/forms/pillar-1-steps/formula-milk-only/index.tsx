import { Alert } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import LanguageSelector from '@/components/language-selector/language-selector';
import { HealthPromotion } from './health-promotion';
// @ts-ignore
import mockedVideo from '../../assets/mocked.mp4';

export const BreastMilkOnlyStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
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
        title="Formula milk only"
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="See more info"
          buttonIcon="InformationCircleIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Alert
          type="warning"
          title={`Check how ${caregiverName} is managing and observe her breastfeeding.`}
          titleColor="textDark"
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
        <Alert
          type="warning"
          title={`Watch the Benefits of Breastfeeding video with ${caregiverName} and answer any questions.`}
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
