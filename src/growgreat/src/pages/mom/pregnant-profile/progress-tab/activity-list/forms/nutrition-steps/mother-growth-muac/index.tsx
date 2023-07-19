import { Alert, FormInput, Typography } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import NutritionCare from '@/assets/nutritionCare.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { ChangeEvent, useEffect, useState } from 'react';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { replaceBraces } from '@ecdlink/core';

export const muacQuestion = `What is {client} mid-upper arm circumference (MUAC) today?`;

export const muacFormSection =
  'Mother growth monitoring (Mid-upper arm circumference)';

export const MotherGrowthMUACStep = ({
  mother,
  setEnableButton,
  setSectionQuestions,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');
  const [notUnderWeight, setNotUnderWeight] = useState(0);
  const errorMessage =
    (Number(answer) === 0 && answer !== '') ||
    (Number(answer) >= 100 && answer !== '');
  const underWeightError = Number(answer) < 22 && Number(answer) > 0;
  const notUnderWeightMessage = notUnderWeight > 21 && notUnderWeight < 100;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setAnswer(value);
    setSectionQuestions?.([
      {
        visitSection: muacFormSection,
        questions: [
          {
            question: muacQuestion,
            answer: value,
          },
        ],
      },
    ]);
  };

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  useEffect(() => {
    if (answer) {
      setNotUnderWeight(Number(answer));
    }
    if (Number(answer) > 0 && Number(answer) < 100) {
      setEnableButton?.(true);
      return;
    }
    setEnableButton?.(false);
  }, [answer, setEnableButton]);

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={NutritionCare}
        title="MUAC measurement"
      />
      <div className="relative flex flex-col p-4">
        <Typography
          type="h4"
          color="textDark"
          text={replaceBraces(muacQuestion, mother?.user?.firstName!)}
        />
        <div className="mb-4 flex flex-row items-center gap-1">
          <FormInput
            placeholder={'Tap to add'}
            type={'number'}
            className="w-2/4"
            value={answer}
            onChange={handleChange}
          ></FormInput>
          <Typography type="body" color="textDark" text="cm" className="mt-2" />
        </div>
        {errorMessage && (
          <Typography
            type="body"
            color="errorMain"
            text="Please check your measurement. You must enter a number more than 0 and less than 100."
          />
        )}
        {underWeightError && (
          <Alert
            className="mb-4"
            type="error"
            title={`${mother?.user?.firstName} might be underweight. Refer her to the clinic.`}
            list={['Encourage her to eat 3 meals and 1 small snack every day.']}
          />
        )}
        {notUnderWeightMessage && (
          <SuccessCard
            customIcon={<CelebrateIcon className="h-14	w-14" />}
            text={`Great, ${mother?.user?.firstName} is not underweight!`}
            textColour="successDark"
            subTextColours="textDark"
            color="successBg"
          />
        )}
      </div>
    </>
  );
};
