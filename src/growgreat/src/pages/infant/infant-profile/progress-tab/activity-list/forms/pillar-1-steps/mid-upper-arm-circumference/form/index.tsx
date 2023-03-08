import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { Alert, FormInput, Typography } from '@ecdlink/ui';
import { ChangeEvent, useMemo, useState } from 'react';
import { DynamicFormProps } from '../../../dynamic-form';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { activitiesColours } from '../../../../activities-list';

export const MidUpperArmCircumferenceFormStep = ({
  infant,
  setEnableButton,
  setSectionQuestions,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  const question = `What is ${name}’s MUAC today?`;
  const visitSection = 'Growth monitoring (Mid-upper arm circumference)';

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAnswer(e.target.value);
    setSectionQuestions?.([
      {
        visitSection,
        questions: [
          {
            question,
            answer: e.target.value,
          },
        ],
      },
    ]);
    setEnableButton && setEnableButton(true);
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
        <Typography type="h4" color="textDark" text={question} />
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
        <Alert type="info" title="MUAC helps identify malnutrition" />
      </div>
    </>
  );
};
