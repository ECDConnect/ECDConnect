import { Alert, ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { parseBool, replaceBraces } from '@ecdlink/core';
import { currentActivityKey } from '../..';
import { useSelector } from 'react-redux';
import {
  getCurrentCoachPractitionerVisitByUserId,
  getVisitDataByVisitIdSelector,
} from '@/store/pqa/pqa.selectors';
import { Maybe } from '@ecdlink/graphql';

export const InitialObservations = ({
  isView,
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState<
    {
      question: string;
      answer: null | Maybe<string> | string | boolean | undefined;
    }[]
  >([
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
    { text: 'Yes', value: true, disabled: isView },
    { text: 'No', value: false, disabled: isView },
  ];

  const name = smartStarter?.user?.firstName || 'the smartStarter';
  const visitSection = 'Initial observations';
  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  const currentVisit = useSelector(
    getCurrentCoachPractitionerVisitByUserId(
      activityName,
      smartStarter?.userId!
    )
  );
  const previousVisitAnswers = useSelector(
    getVisitDataByVisitIdSelector(currentVisit?.id, 'prePqaPreviousFormData')
  );
  const previousSectionAnswers = previousVisitAnswers?.filter(
    (item) => item.visitSection === visitSection
  );

  const question1 = previousSectionAnswers?.find(
    (item) => item.question === questions[0].question
  );
  const question2 = previousSectionAnswers?.find(
    (item) => item.question === questions[1].question
  );

  const setPreviousAnswers = useCallback(() => {
    setAnswers((prevState) =>
      prevState.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            answer: parseBool(question1?.questionAnswer!),
          };
        }

        return {
          ...item,
          answer: parseBool(question2?.questionAnswer!),
        };
      })
    );
  }, [question1, question2]);

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

  useEffect(() => {
    if (isView) {
      setPreviousAnswers();
      setEnableButton?.(true);
    }
  }, [isView, setEnableButton, setPreviousAnswers]);

  return (
    <div className="p-4">
      <Typography type="h2" text={visitSection} color="textDark" />
      <Typography
        type="h4"
        text="What did you observe when you first arrived?"
        color="textMid"
      />
      {isView && (
        <Alert
          className="mt-4"
          type="warning"
          title="You are viewing this form and cannot edit responses."
        />
      )}
      <Typography
        type="h4"
        text={replaceBraces(questions[0].question, name)}
        color={isView ? 'textLight' : 'textDark'}
        className="my-4"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        selectedOptions={
          questions[0].answer !== ''
            ? parseBool(String(questions[0].answer))
            : undefined
        }
        onOptionSelected={(value) => onOptionSelected(value, 0)}
      />
      <Typography
        type="h4"
        text={replaceBraces(questions[1].question, name)}
        color={isView ? 'textLight' : 'textDark'}
        className="my-4"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        selectedOptions={
          questions[1].answer !== ''
            ? parseBool(String(questions[1].answer))
            : undefined
        }
        onOptionSelected={(value) => onOptionSelected(value, 1)}
      />
    </div>
  );
};
