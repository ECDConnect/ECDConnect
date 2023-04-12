import { Alert } from '@ecdlink/ui';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header } from '@/pages/infant/infant-profile/components';
import Infant from '@/assets/infant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import CareForBabyImage from '../../assets/careForBaby.png';
import { getAgeInYearsMonthsAndDays } from '@ecdlink/core';

export const CareForBabyStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  const age = useMemo(() => {
    const dateOfBirth = infant?.user?.dateOfBirth as string;
    const { years, months, days } = getAgeInYearsMonthsAndDays(dateOfBirth);

    if (!dateOfBirth) return undefined;

    if (years === 0 && months < 1) {
      return `${days} ${days > 1 ? 'days' : 'day'}`;
    }

    if (years === 0) {
      return `${months} months ${days} ${days > 1 ? 'days' : 'day'}`;
    }

    return `${years} ${years > 1 ? 'years' : 'year'} ${months} ${
      months > 1 ? 'months' : 'month'
    }`;
  }, [infant?.user?.dateOfBirth]);

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title="Care for baby"
        subTitle={name}
        {...(!!age
          ? {
              tag: age,
            }
          : {})}
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
            <div className="bg-tertiary h-14 w-14 rounded-full">
              <Polly className="h-14 w-14" />
            </div>
          }
        />
      </div>
    </>
  );
};
