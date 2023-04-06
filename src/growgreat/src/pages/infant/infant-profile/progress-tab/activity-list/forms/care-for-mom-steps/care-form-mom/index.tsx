import { Divider } from '@ecdlink/ui';
import CareForMomImage from '../../assets/careForMom.png';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import {
  Label,
  Header,
  TipCard,
} from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect } from 'react';
import { MoreInformation } from '../../components/more-information';

export const CareForMomStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <MoreInformation
        section="Care for mom"
        subTitle="Care for mom"
        onClose={() => setIsTip?.(false)}
      />
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title="Care for mom"
        subTitle={`${infant?.caregiver?.firstName || ''} ${
          infant?.caregiver?.surname || ''
        }`}
      />
      <img src={CareForMomImage} className="w-full" alt="care for mom" />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="See more info"
          buttonIcon="InformationCircleIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />

        <SuccessCard
          customIcon={<CelebrateIcon className="h-14	w-14" />}
          text={`Congratulations to ${infant?.caregiver?.firstName || ''}!`}
          textColour="successDark"
          subTextColours="textDark"
          color="successBg"
        />
        <Divider dividerType="dashed" />
        <Label text={`Ask ${infant?.caregiver?.firstName || ''} z.`} />
        <Divider dividerType="dashed" />
      </div>
    </>
  );
};
