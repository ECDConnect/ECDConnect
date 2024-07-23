import { Alert, DialogPosition, Dialog, Typography } from '@ecdlink/ui';
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
import { getAgeInYearsMonthsAndDays } from '@ecdlink/core';
import { differenceInDays } from 'date-fns';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { getIsInfantFirstVisitSelector } from '@/store/infant/infant.selectors';

export const BreastMilkOnlyStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
  onNextStep,
}: DynamicFormProps) => {
  const { isOnline } = useOnlineStatus();

  const name = useMemo(
    () => infant?.user?.firstName || '',
    [infant?.user?.firstName]
  );
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );
  const sectionName = 'Breast milk only';

  const dateOfBirth = infant?.user?.dateOfBirth as string;

  const { years: ageYears, months: ageMonths } =
    getAgeInYearsMonthsAndDays(dateOfBirth);
  const ageDays = differenceInDays(new Date(), new Date(dateOfBirth));

  const isFirstVisit = useSelector(getIsInfantFirstVisitSelector);

  const isBenefitsOfBreastfeeding = useMemo(
    () => isFirstVisit && ageDays < 7,
    [ageDays, isFirstVisit]
  );
  const isHowBreastfeedingWorks = useMemo(
    () => isFirstVisit && ageDays >= 7 && ageDays <= 13,
    [ageDays, isFirstVisit]
  );
  const isBreastfeedingChallenges = useMemo(
    () => isFirstVisit && ageDays >= 14 && ageDays <= 27,
    [ageDays, isFirstVisit]
  );
  const isUnsafeFeedingPractices = useMemo(
    () => isFirstVisit && ageDays >= 28 && ageDays <= 48,
    [ageDays, isFirstVisit]
  );
  const isBreastfeedingInTheWorkplace = useMemo(
    () => isFirstVisit && !ageYears && ageMonths <= 4,
    [ageMonths, ageYears, isFirstVisit]
  );

  const isAfter6Months = !ageYears && ageMonths === 6;

  const { promptMessage, videoSection } = useMemo(() => {
    if (isBenefitsOfBreastfeeding) {
      return {
        promptMessage: `Watch the Benefits of Breastfeeding video with ${caregiverName} and answer any questions.`,
        videoSection: 'Benefits of breastfeeding',
      };
    }

    if (isHowBreastfeedingWorks) {
      return {
        promptMessage: `Watch the How Breastfeeding Works video with ${caregiverName} and answer any questions.`,
        videoSection: 'How breastfeeding works',
      };
    }

    if (isBreastfeedingChallenges) {
      return {
        promptMessage: `Watch the Breastfeeding Challenges video with ${caregiverName} and answer any questions.`,
        videoSection: 'Breastfeeding challenges',
      };
    }

    if (isUnsafeFeedingPractices) {
      return {
        promptMessage: `Watch the Unsafe Feeding Practices video with ${caregiverName} and answer any questions.`,
        videoSection: 'Unsafe feeding practices',
      };
    }

    if (isBreastfeedingInTheWorkplace) {
      return {
        promptMessage: `Watch the Breastfeeding in the Workplace video with ${caregiverName} and answer any questions.`,
        videoSection: 'Breastfeeding in the workplace',
      };
    }

    return {
      promptMessage: undefined,
      videoSection: undefined,
    };
  }, [
    caregiverName,
    isBenefitsOfBreastfeeding,
    isBreastfeedingChallenges,
    isBreastfeedingInTheWorkplace,
    isHowBreastfeedingWorks,
    isUnsafeFeedingPractices,
  ]);

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

    if (!!promptMessage) {
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
            title={promptMessage}
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
  }, [
    caregiverName,
    isAfter6Months,
    isOnline,
    name,
    promptMessage,
    setIsTip,
    videoSection,
  ]);

  if (isTipPage) {
    return (
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <HealthPromotion
          title={`Discuss with ${caregiverName}`}
          subTitle={sectionName}
          section={sectionName}
          onClose={() => setIsTip?.(false)}
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
        title={sectionName}
      />
      <div className="flex flex-col gap-4 p-4">{renderContent}</div>
    </>
  );
};
