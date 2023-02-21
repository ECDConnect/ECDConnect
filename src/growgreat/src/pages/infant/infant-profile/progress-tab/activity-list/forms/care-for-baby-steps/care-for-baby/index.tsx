import { Alert } from '@ecdlink/ui';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header } from '@/pages/infant/infant-profile/components';
import Infant from '@/assets/infant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import CareForBabyImage from '../../assets/careForBaby.png';

const mock = '1 day';

export const CareForBabyStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title="Care for baby"
        subTitle={name}
        tag={mock}
      />
      <img src={CareForBabyImage} className="w-full" alt="care for baby" />
      <div className="flex flex-col gap-4 p-4">
        <Alert
          type="warning"
          title={`If ${name} shows any danger signs during your visit, refer them to the clinic immediately.`}
          message={`Explain to the family how important it is to take ${name} as soon as possible - it could save ${name}’s life!`}
          titleColor="textDark"
          messageColor="textMid"
          customIcon={
            <div className="bg-primary h-14 w-14 rounded-full">
              <Polly className="h-14 w-14" />
            </div>
          }
        />
      </div>
    </>
  );
};
