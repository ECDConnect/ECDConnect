import {
  CheckboxChange,
  CheckboxGroup,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { questions } from './questions';
import { useCallback, useEffect, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { replaceBraces } from '@ecdlink/core';

export const ProgrammeObservations = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [question, setAnswers] = useState({
    question: "Think about {client}'s SmartStart programme delivery.",
    answer: [] as (string | number | undefined)[],
  });

  const answers = question.answer as string[];

  const name = smartStarter?.user?.firstName || 'the smartStarter';

  const visitSection = 'Programme observations';

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
            visitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setAnswers(updatedQuestion);
      return setSectionQuestions?.([
        { visitSection, questions: [updatedQuestion] },
      ]);
    },
    [answers, question, setSectionQuestions, visitSection]
  );

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography type="h2" text={visitSection} color="textDark" />
      <Typography
        type="h4"
        text={replaceBraces(question.question, name)}
        color="textMid"
      />
      <Divider dividerType="dashed" className="p-3" />
      <div className="flex flex-col gap-2">
        <Typography
          type="h3"
          text="Select the box below if the statement is true."
          color="textDark"
        />
        {questions.map((item) => (
          <CheckboxGroup
            id={item?.title}
            key={item?.title}
            title={item.title}
            description={item.subTitle}
            titleColours="textMid"
            checked={answers?.some(
              (option) => option === item.title + item.subTitle
            )}
            value={item.title + item.subTitle}
            onChange={onCheckboxChange}
          />
        ))}
      </div>
    </div>
  );
};
