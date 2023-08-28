import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import { replaceBraces } from '@ecdlink/core';
import { Maybe } from 'graphql/jsutils/Maybe';
import { DynamicFormProps } from '../dynamic-form';
import { callType, question1, question2 } from './constants';

export const RequestCoachingVisitOrCall = ({
  isView,
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState<
    {
      question: string;
      answer: Maybe<string> | string | undefined;
    }[]
  >([
    {
      question: question1,
      answer: '',
    },
    {
      question: question2,
      answer: '',
    },
  ]);

  const visitTypeOptions = [
    { text: 'Visit', value: 'Visit' },
    { text: 'Call', value: callType },
  ];

  const firstName = smartStarter?.user?.firstName || 'the smartStarter';
  const visitSection = 'Request a coaching visit or call';

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

      const isAllCompleted = updatedQuestions.every((item) => !!item.answer);

      if (isAllCompleted) {
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
        text={replaceBraces(questions[0].question, firstName)}
        color={isView ? 'textLight' : 'textDark'}
        className="my-4"
      />
      <ButtonGroup<string>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={visitTypeOptions}
        selectedOptions={
          questions[0].answer !== '' ? String(questions[0].answer) : undefined
        }
        onOptionSelected={(value) => onOptionSelected(value, 0)}
      />
      <FormInput
        disabled={isView}
        textInputType="textarea"
        className="mt-4"
        placeholder="e.g. Help with recruiting children."
        label={questions[1].question}
        value={questions[1].answer || ''}
        onChange={(value) => onOptionSelected(value.target.value, 1)}
      />
      <Alert
        className="mt-4"
        type="info"
        title="Your coach will be notified when you send this request."
      />
    </div>
  );
};
