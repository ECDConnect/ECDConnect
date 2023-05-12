import { ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { replaceBraces } from '@ecdlink/core';

export const InitialObservations = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: `Did it seem that you were interrupting {client}’s programme?`,
      answer: '',
    },
    {
      question: `If the daily routine was displayed, was there a marker on it that corresponded to what the SmartStarter was doing?`,
      answer: '',
    },
  ]);

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const name = smartStarter?.user?.firstName || 'the smartStarter';
  const visitSection = 'Initial observations';

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question) => {
        if (question.question === currentQuestion.question) {
          return {
            ...question,
            answer: value,
          };
        }
        return question;
      });

      setAnswers(updatedQuestions);
      setSectionQuestions?.([
        {
          visitSection,
          questions: updatedQuestions,
        },
      ]);

      if (updatedQuestions.every((item) => item.answer !== '')) {
        return setEnableButton?.(true);
      }

      setEnableButton?.(false);
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  return (
    <div className="p-4">
      <Typography type="h2" text={visitSection} color="textDark" />
      <Typography
        type="h4"
        text="What did you observe when you first arrived?"
        color="textMid"
      />
      <Typography
        type="h4"
        text={replaceBraces(questions[0].question, name)}
        color="textDark"
        className="my-4"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        onOptionSelected={(value) => onOptionSelected(value, 0)}
      />
      <Typography
        type="h4"
        text={replaceBraces(questions[1].question, name)}
        color="textDark"
        className="my-4"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        onOptionSelected={(value) => onOptionSelected(value, 1)}
      />
    </div>
  );
};
