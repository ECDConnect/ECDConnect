import { Alert } from '@ecdlink/ui';
import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { MoreInformation } from '../../components/more-information';
import { Video } from '../../components/video';
import AntenatalCareSvg from '@/assets/antenatalCare.svg';

export const AntenatalClinicVideoStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );
  const videoSection = '';

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <MoreInformation
        section="Developmental Screening"
        subTitle="Developmental Screening"
        onClose={() => setIsTip?.(false)}
      />
    );
  }

  return (
    <>
      <Header
        customIcon={AntenatalCareSvg}
        title="Antenatal clinic video"
        backgroundColor="tertiary"
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
