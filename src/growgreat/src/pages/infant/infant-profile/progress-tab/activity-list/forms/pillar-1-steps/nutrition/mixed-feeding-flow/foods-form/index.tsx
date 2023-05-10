import { Alert, CheckboxChange, CheckboxGroup, Divider } from '@ecdlink/ui';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header, Label } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useCallback, useMemo, useState } from 'react';
import { replaceBraces } from '@ecdlink/core';

export const FoodsFormStep = ({
  infant,
  setEnableButton,
  setSectionQuestions: setQuestions,
  onNextStep,
}: DynamicFormProps) => {
  const [question, setAnswers] = useState({
    question:
      'Which of these foods have you given {client}? You can choose more than one.',
    answer: [] as (string | number | undefined)[],
  });

  const name = useMemo(
    () => infant?.user?.firstName || '',
    [infant?.user?.firstName]
  );
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const visitSection = 'Mixed feeding';

  const answers = question.answer as string[];

  const options = [
    { name: 'Breast milk' },
    { name: 'Formula' },
    { name: 'Solid foods, tea, cereals/porridge, and/or water' },
  ];

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        const updatedQuestion = { ...question, answer: currentAnswers };

        setAnswers(updatedQuestion);
        setEnableButton?.(true);
        return setQuestions?.([
          {
            visitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setEnableButton?.(!!currentAnswers?.length);
      setAnswers(updatedQuestion);
      return setQuestions?.([
        {
          visitSection,
          questions: [updatedQuestion],
        },
      ]);
    },
    [answers, question, setEnableButton, setQuestions]
  );

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title={visitSection}
      />
      <div className="flex flex-col p-4">
        <Alert
          type="warning"
          title={`Find out more about what ${caregiverName} is feeding ${name}`}
          titleColor="textDark"
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
        <Label className="mt-4" text={replaceBraces(question.question, name)} />
        <Divider dividerType="dashed" className="mb-3" />
        {options.map((item, index) => (
          <CheckboxGroup
            checkboxColor="primary"
            className="mt-2"
            id={item.name}
            key={item.name}
            title={item.name}
            checked={answers?.some((option) => option === item.name)}
            value={item.name}
            onChange={onCheckboxChange}
          />
        ))}
      </div>
    </>
  );
};
