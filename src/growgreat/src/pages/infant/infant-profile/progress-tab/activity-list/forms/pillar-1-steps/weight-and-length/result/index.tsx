import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { Alert, Divider, Typography } from '@ecdlink/ui';
import { useEffect, useMemo } from 'react';
import { DynamicFormProps } from '../../../dynamic-form';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { Chart } from './chart';
import {
  weightForAgeBoys,
  weightForAgeGirls,
  heightForAgeBoys,
  heightForAgeGirls,
} from './data';

const Card = ({
  value,
  title,
  subTitle,
}: {
  value: string;
  title: string;
  subTitle: string;
}) => (
  <div className="bg-successBg flex w-full flex-col items-center justify-center rounded-xl p-4">
    <Typography type="h4" color="textDark" text={title} />
    <Typography
      type="body"
      color="successMain"
      className="my-3 text-4xl font-bold"
      text={value}
    />
    <Typography
      type="body"
      color="textMid"
      className="text-xs font-bold"
      text={subTitle}
    />
  </div>
);

export const WeightAndLengthResultStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  console.log(infant);

  const renderCard = useMemo(() => {
    // TODO: add integration
    return (
      <SuccessCard
        text={`${name} is growing well! Great job ${caregiverName}.`}
        color="successMain"
        customIcon={<CelebrateIcon className="h-14	w-14" />}
      />
    );
  }, [caregiverName, name]);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title="Growth monitoring"
        subTitle="Weight & length"
      />
      <div className="relative flex flex-col gap-3 p-4">
        <Alert
          type="warning"
          title={`Discuss ${name}'s growth with ${caregiverName}`}
          titleColor="textDark"
          customIcon={
            <div className="bg-tertiary h-14 w-14 rounded-full">
              <Polly className="h-14 w-14" />
            </div>
          }
        />
        {renderCard}
        <div className="flex gap-2">
          <Card title="Weight" value="7" subTitle="KG" />
          <Card title="Weight" value="60" subTitle="CM" />
        </div>
        <Typography type="h3" color="textDark" text="Weight for age (kg)" />
        <Chart
          data={
            infant?.gender?.description === 'Girl'
              ? weightForAgeGirls
              : weightForAgeBoys
          }
        />
        <Divider dividerType="dashed" />
        <Typography type="h3" color="textDark" text="Length for age (cm)" />
        <Chart
          data={
            infant?.gender?.description === 'Girl'
              ? heightForAgeGirls
              : heightForAgeBoys
          }
        />
      </div>
    </>
  );
};
