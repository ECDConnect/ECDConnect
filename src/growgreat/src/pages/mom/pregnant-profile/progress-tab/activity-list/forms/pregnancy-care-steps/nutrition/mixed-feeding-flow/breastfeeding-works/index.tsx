import { Alert, Divider, DialogPosition, Dialog } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { HealthPromotion } from '../../../../components/health-promotion';
import { Video } from '../../../../components/video';

export const MixedBreastfeedingWorksStep = ({
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
  const videoSection = 'How Breastfeeding Works';

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
        <Alert
          type="warning"
          title={`Watch the video on How Breastfeeding Works with ${caregiverName} and answer any questions.`}
          titleColor="textDark"
          customIcon={
            <div className="rounded-full">
              <PollyNeutral className="h-16 w-16" />
            </div>
          }
        />
        <Video section={videoSection} />
        <Alert
          type="info"
          title={`Encourage ${caregiverName} to choose 1 option - either exclusive breastfeeding or exclusive formula feeding. Support her in this decision.`}
          list={[
            `Show ${caregiverName} how to feed her baby with its head covered and skin-to-skin contact.`,
            'This will keep the baby warm and encourage bonding.',
          ]}
        />
      </div>
    </>
  );
};
