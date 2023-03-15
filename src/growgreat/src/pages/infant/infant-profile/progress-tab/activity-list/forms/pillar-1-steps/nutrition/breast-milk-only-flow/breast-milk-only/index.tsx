import { Alert, Typography } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { HealthPromotion } from '../../../../components/health-promotion';
import { activitiesColours } from '../../../../../activities-list';
import { Video } from '../../../../components/video';

export const BreastMilkOnlyStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
  onNextStep,
}: DynamicFormProps) => {
  const name = useMemo(
    () => infant?.user?.firstName || '',
    [infant?.user?.firstName]
  );
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );
  const sectionName = 'Breast milk only';
  const videoSection = 'Benefits of Breastfeeding';

  // TODO: add integration
  const isVideo = true;
  // TODO: add integration
  const isAfter6Months = false;

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [onNextStep, setEnableButton]);

  const renderContent = useMemo(() => {
    if (isAfter6Months) {
      return (
        <>
          <PollyImpressed className="mt-11 h-28 w-28 self-center" />
          <Typography
            type="h3"
            text={`Well done to ${caregiverName} for waiting 6 months!`}
            align="center"
          />
          <Typography
            type="body"
            text={`This is a huge achievement and has laid the foundation for ${name} to grow great.`}
            color="textMid"
            align="center"
          />
        </>
      );
    }

    if (isVideo) {
      return (
        <>
          <TipCard
            buttonText="Health promotion"
            buttonIcon="ChatIcon"
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
          <Video section={videoSection} />
        </>
      );
    }

    return (
      <>
        <TipCard
          buttonText="See discussion points"
          buttonIcon="ChatIcon"
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
      </>
    );
  }, [caregiverName, isAfter6Months, isVideo, name, setIsTip]);

  if (isTipPage) {
    return (
      <HealthPromotion
        title={`Discuss with ${caregiverName}`}
        subTitle={sectionName}
        section={sectionName}
        onClose={() => setIsTip?.(false)}
      />
    );
  }

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor={activitiesColours.pillar1.primaryColor}
        hexBackgroundColor={activitiesColours.pillar1.secondaryColor}
        title={sectionName}
      />
      <div className="flex flex-col gap-4 p-4">{renderContent}</div>
    </>
  );
};
