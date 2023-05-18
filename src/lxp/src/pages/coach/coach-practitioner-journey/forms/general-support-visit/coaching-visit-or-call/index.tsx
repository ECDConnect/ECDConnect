import {
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { replaceBraces } from '@ecdlink/core';

export const CoachingAndVisitOrCallStep = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question:
        'Did you visit the practitioner’s site, or did you have a support phone call?',
      answer: '',
    },
    {
      question: 'The focus of this coaching visit was:',
      answer: '',
    },
    {
      question: 'I observed the following parts of the programme:',
      answer: '',
    },
    {
      question:
        'Discussion notes: which issues and areas of practice did you discuss with {client}?',
      answer: '',
    },
    {
      question: 'What next steps did you agree on?',
      answer: '',
    },
  ]);

  const options = [
    { text: 'Visit', value: 'Visit' },
    { text: 'Call', value: 'Call' },
  ];

  const name = smartStarter?.user?.firstName || 'the smartStarter';
  const visitSection = 'Coaching visit or call';

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question, currentIndex) => {
        if (index === 1 && currentIndex === 2) {
          return {
            ...question,
            answer: '',
          };
        }

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

      if (updatedQuestions.every((item) => !!item.answer)) {
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
        text={new Date().toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })}
        color="textMid"
      />
      <Typography
        type="h4"
        text={replaceBraces(questions[0].question, name)}
        color="textDark"
        className="my-4"
      />
      <ButtonGroup<string>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        onOptionSelected={(value) => onOptionSelected(value, 0)}
      />
      {questions.slice(1, 5).map((item, index) => {
        const placeholders = [
          'e.g. Follow up on creating a healthy environment.',
          'e.g. Full daily routine',
          'e.g. Including more time for story reading',
          'e.g. Use more stories from Funda App',
        ];
        return (
          <FormInput
            textInputType="textarea"
            className="mt-4"
            placeholder={placeholders[index]}
            label={replaceBraces(item.question, name)}
            value={item.answer}
            onChange={(value) =>
              onOptionSelected(value.target.value, index + 1)
            }
          />
        );
      })}
    </div>
  );
};
