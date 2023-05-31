import {
  Alert,
  CheckboxChange,
  CheckboxGroup,
  Colours,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { options } from './options';

export const step13VisitSection = 'Step 13';

export const Step13 = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [question, setAnswers] = useState({
    question: 'Additional standards',
    answer: [] as (string | number | undefined)[],
  });

  const answers = question.answer as string[];

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        const updatedQuestion = { ...question, answer: currentAnswers };
        setAnswers(updatedQuestion);
        return setSectionQuestions?.([
          {
            visitSection: step13VisitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setAnswers(updatedQuestion);
      return setSectionQuestions?.([
        { visitSection: step13VisitSection, questions: [updatedQuestion] },
      ]);
    },
    [answers, question, setSectionQuestions]
  );

  const getScore = () => {
    const length = answers.length;
    let scoreColours: Colours = 'errorMain';
    const total = 5;
    if (length > 0 && length < total) {
      scoreColours = 'alertMain';
    }

    if (length === total) {
      scoreColours = 'successMain';
    }

    return {
      score: length,
      color: scoreColours,
      total,
    };
  };

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography type="h2" text={question.question} color="textDark" />
      <Alert
        className="mt-4"
        type="info"
        title="These standards are also required. If they are not in place, SmartStarters should be able to show how they are working towards them."
      />
      <Divider dividerType="dashed" className="my-4" />
      {options.question1.map((item) => (
        <CheckboxGroup
          className="mb-2"
          id={item}
          key={item}
          title={item}
          titleColours="textMid"
          titleSize="sm"
          titleWeight="normal"
          checked={answers?.some((option) => option === item)}
          value={item}
          onChange={onCheckboxChange}
        />
      ))}
      <div className="mt-6 flex items-center gap-2">
        <span
          className={`p-2 text-sm font-semibold text-white bg-${
            getScore().color
          } rounded-15`}
        >
          {getScore().score}/{getScore().total}
        </span>
        <Typography type="h4" text="Score" />
      </div>
    </div>
  );
};
