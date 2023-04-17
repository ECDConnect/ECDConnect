import { Alert } from '@ecdlink/ui';
import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import P2 from '@/assets/pillar/p2.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { activitiesColours } from '../../../activities-list';
import { MoreInformation } from '../../components/more-information';
import { Video } from '../../components/video';

export const DevelopmentalScreeningStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );
  const videoSection = 'Bonding';
  const visitSection = 'Danger signs';

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <MoreInformation
        section={visitSection}
        subTitle={visitSection}
        onClose={() => setIsTip?.(false)}
      />
    );
  }

  return (
    <>
      <Header
        customIcon={P2}
        title={visitSection}
        iconHexBackgroundColor={activitiesColours.pillar2.primaryColor}
        hexBackgroundColor={activitiesColours.pillar2.secondaryColor}
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="See more info"
          buttonIcon="InformationCircleIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Alert
          type="warning"
          title={`Watch the Bonding video with ${caregiverName} and answer any questions.`}
          titleColor="textDark"
          customIcon={
            <div className="rounded-full">
              <PollyHappy className="h-16 w-16" />
            </div>
          }
        />
        <Video section={videoSection} />
      </div>
    </>
  );
};
