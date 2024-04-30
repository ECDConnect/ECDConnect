import {
  Alert,
  DialogPosition,
  Dialog,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { activitiesColours } from '../../../../../activities-list';
import { HealthPromotion } from '../../../../components/health-promotion';
import { Video } from '../../../../components/video';
import { getAgeInYearsMonthsAndDays } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const BenefitsOfBreastfeedingStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
  onNextStep,
}: DynamicFormProps) => {
  const { isOnline } = useOnlineStatus();

  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );
  const sectionName = 'Formula milk only';
  const videoSection = 'Benefits of breastfeeding';

  const dateOfBirth = infant?.user?.dateOfBirth as string;

  const { years: ageYears, months: ageMonths } =
    getAgeInYearsMonthsAndDays(dateOfBirth);

  const isAfter6Months = !ageYears && ageMonths === 6;

  const renderContent = useMemo(() => {
    if (isAfter6Months) {
      return (
        <>
          <PollyImpressed className="mt-11 h-28 w-28 self-center" />
          <Typography
            type="h3"
            text={`Congratulate ${caregiverName} on waiting until 6 months!`}
            align="center"
          />
          <Typography
            type="body"
            text="This is a huge achievement. Now is the time to start solid foods."
            color="textMid"
            align="center"
          />
        </>
      );
    }

    return (
      <>
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Alert
          type="warning"
          title={`If ${caregiverName} chooses to formula feed, check that she knows how to safely prepare formula and give her baby the correct amounts.`}
          titleColor="textDark"
          message="Include other family members in the discussion – they are an important source of support."
          messageColor="textMid"
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
        <Divider dividerType="dashed" />
        <Alert
          type="warning"
          title={`Watch the video on Benefits of Breastfeeding with ${caregiverName} and answer any questions.`}
          titleColor="textDark"
          customIcon={
            <div className="rounded-full">
              <PollyNeutral className="h-16 w-16" />
            </div>
          }
        />
        {isOnline ? (
          <Video section={videoSection} />
        ) : (
          <Alert type="error" title="You can only view this online" />
        )}
      </>
    );
  }, [caregiverName, isAfter6Months, isOnline, setIsTip]);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <HealthPromotion
          title={`Discuss with ${caregiverName}`}
          subTitle="Formula milk only"
          sectionTitle="Pillar 1: Nutrition (every visit)"
          section={sectionName}
          onClose={() => setIsTip && setIsTip(false)}
          client={caregiverName}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor={activitiesColours.pillar1.primaryColor}
        hexBackgroundColor={activitiesColours.pillar1.secondaryColor}
        title="Formula milk only"
      />
      <div className="flex flex-col gap-4 p-4">{renderContent}</div>
    </>
  );
};
