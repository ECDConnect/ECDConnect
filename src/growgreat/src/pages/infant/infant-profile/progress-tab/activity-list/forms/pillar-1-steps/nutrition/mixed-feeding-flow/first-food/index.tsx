import { Alert, Divider, DialogPosition, Dialog } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { HealthPromotion } from '../../../../components/health-promotion';
import { Video } from '../../../../components/video';
import { getAgeInYearsMonthsAndDays } from '@ecdlink/core';
import { differenceInDays } from 'date-fns';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const FirstFoodsStep = ({
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

  const dateOfBirth = infant?.user?.dateOfBirth as string;

  const { years: ageYears, months: ageMonths } =
    getAgeInYearsMonthsAndDays(dateOfBirth);
  const ageDays = differenceInDays(new Date(), new Date(dateOfBirth));

  const isFirstVisit = true;

  const isMixedFeedingVideo1 = useMemo(
    () => isFirstVisit && ageDays < 7,
    [ageDays, isFirstVisit]
  );

  const isMixedFeedingVideo2 = useMemo(
    () => isFirstVisit && ageDays >= 7 && ageDays <= 13,
    [ageDays, isFirstVisit]
  );

  const isMixedFeedingVideo3 = useMemo(
    () => isFirstVisit && ageDays >= 14 && ageDays <= 56,
    [ageDays, isFirstVisit]
  );

  const isMixedFeedingVideo4 = useMemo(
    () => isFirstVisit && !ageYears && ageMonths >= 5 && ageMonths <= 6,
    [ageMonths, ageYears, isFirstVisit]
  );

  const isMixedFeedingVideo5 = useMemo(
    () => isFirstVisit && !ageYears && ageMonths >= 6 && ageMonths <= 9,
    [ageMonths, ageYears, isFirstVisit]
  );

  const { promptMessage, videoSection } = useMemo(() => {
    if (isMixedFeedingVideo1) {
      return {
        promptMessage: `Watch the Benefits of Breastfeeding video with ${caregiverName} and answer any questions.`,
        videoSection: 'Benefits of Breastfeeding',
      };
    }

    if (isMixedFeedingVideo2) {
      return {
        promptMessage: `Watch the How Breastfeeding Works video with ${caregiverName} and answer any questions.`,
        videoSection: 'How Breastfeeding Works',
      };
    }

    if (isMixedFeedingVideo3) {
      return {
        promptMessage: `Watch the video on First Foods with ${caregiverName} and answer any questions.`,
        videoSection: 'First Foods',
      };
    }

    if (isMixedFeedingVideo4) {
      return {
        promptMessage: `Watch the video on First Foods with ${caregiverName} and answer any questions.`,
        videoSection: 'First Foods',
      };
    }

    if (isMixedFeedingVideo5) {
      return {
        promptMessage: `Watch the video on Complimentary Feeding with ${caregiverName} and answer any questions.`,
        videoSection: 'Complimentary Feeding',
      };
    }

    return {
      promptMessage: undefined,
      videoSection: undefined,
    };
  }, [
    caregiverName,
    isMixedFeedingVideo1,
    isMixedFeedingVideo2,
    isMixedFeedingVideo3,
    isMixedFeedingVideo4,
    isMixedFeedingVideo5,
  ]);

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
          subTitle="Mixed feeding"
          section="Mixed feeding"
          onClose={() => setIsTip && setIsTip(false)}
        />
      </Dialog>
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
          title="Discuss the dangers of mixed feeding"
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
        {promptMessage && (
          <>
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
            <Video section={videoSection} />
          </>
        )}
        {!isOnline && (
          <Alert type="error" title="You can only view this online" />
        )}
      </div>
    </>
  );
};
