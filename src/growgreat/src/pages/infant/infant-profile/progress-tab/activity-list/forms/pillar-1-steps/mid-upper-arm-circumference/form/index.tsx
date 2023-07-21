import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { Alert, FormInput, Typography } from '@ecdlink/ui';
import { ChangeEvent, useMemo, useState } from 'react';
import { DynamicFormProps } from '../../../dynamic-form';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { activitiesColours } from '../../../../activities-list';
import { replaceBraces } from '@ecdlink/core';

export const muacFormSection =
  'Growth monitoring (Mid-upper arm circumference)';

export const muacQuestion = `What is {client} MUAC today?`;

export const MidUpperArmCircumferenceFormStep = ({
  infant,
  setEnableButton,
  setSectionQuestions,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

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

    if (Number(value) <= 30) {
      return setEnableButton?.(true);
    }

    return setEnableButton?.(false);
  };

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor={activitiesColours.pillar1.primaryColor}
        hexBackgroundColor={activitiesColours.pillar1.secondaryColor}
        title="Growth monitoring"
        subTitle="Mid-upper arm circumference"
      />
      <div className="relative flex flex-col p-4">
        <Alert
          className="mb-4"
          type="warning"
          title={`Measure ${name}’s mid-upper arm circumference (MUAC)`}
          titleColor="textDark"
          customIcon={
            <div className="bg-tertiary h-14 w-14 rounded-full">
              <Polly className="h-14 w-14" />
            </div>
          }
        />
        <Typography
          type="h4"
          color="textDark"
          text={replaceBraces(muacQuestion, name)}
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
        {Number(answer) > 30 && (
          <Alert
            className="mb-4"
            type="error"
            title="Please enter a MUAC measurement less than 30cm"
          />
        )}
        <Alert type="info" title="MUAC helps identify malnutrition" />
      </div>
    </>
  );
};
