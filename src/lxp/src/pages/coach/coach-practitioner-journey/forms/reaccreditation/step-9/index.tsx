import {
  CheckboxChange,
  CheckboxGroup,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { options } from './options';
import { DynamicFormProps } from '../../dynamic-form';

export const Step9ReAccreditation = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [question, setAnswers] = useState({
    question: `Which of these did you see during the session?`,
    answer: [] as (string | number | undefined)[],
  });

  const visitSection = 'Step 9';
  const answers = question.answer as string[];

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        const updatedQuestion = { ...question, answer: currentAnswers };

        setAnswers(updatedQuestion);
        setEnableButton?.(true);
        return setSectionQuestions?.([
          {
            visitSection: visitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setEnableButton?.(!!currentAnswers?.length);
      setAnswers(updatedQuestion);
      return setSectionQuestions?.([
        {
          visitSection: visitSection,
          questions: [updatedQuestion],
        },
      ]);
    },
    [answers, question, setEnableButton, setSectionQuestions]
  );

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="A. The learning environment & use of the SmartStart routine"
      />
      <Divider dividerType="dashed" />
      <div className="flex flex-col gap-2 py-4">
        <Typography type="h4" text={`2.1 ${question.question}`} />
        {options.map((item) => (
          <CheckboxGroup
            checkboxColor="primary"
            id={item}
            key={item}
            title={item}
            titleWeight="normal"
            checked={answers?.some((option) => option === item)}
            value={item}
            onChange={onCheckboxChange}
          />
        ))}
      </div>
    </div>
  );
};
