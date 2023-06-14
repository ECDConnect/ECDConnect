import {
  Alert,
  CheckboxChange,
  CheckboxGroup,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { options } from './options';
import { DynamicFormProps } from '../../dynamic-form';
import { Score } from '../components/score';

export const Step11ReAccreditation = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [question, setAnswers] = useState({
    question: `C. Records`,
    answer: [] as (string | number | undefined)[],
  });

  const answers = question.answer as string[];
  const visitSection = 'Step 11';

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
      <Typography type="h2" text={question.question} className="mb-4" />
      <Alert
        type="info"
        title="Ask the SmartStarter if you can look at their records together. Check all of the statements that are true."
      />
      <Divider dividerType="dashed" className="my-4" />
      {options.map((item) => {
        const [title, description] = item.split(':');
        const label = `<strong>${title}:</strong> ${description}`;

        return (
          <CheckboxGroup
            className="mb-2"
            checkboxColor="primary"
            id={item}
            key={item}
            title={label}
            titleWeight="normal"
            checked={answers?.some((option) => option === item)}
            value={item}
            onChange={onCheckboxChange}
          />
        );
      })}
      <Score sum={answers.length} total={6} />
    </div>
  );
};
