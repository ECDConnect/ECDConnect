import { Alert, ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { options } from './options';
import { DynamicFormProps, SectionQuestions } from '../../dynamic-form';
import { parseBool, useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';
import { usePrevious } from 'react-use';

export const step15ReAccreditationQuestions = {
  question1:
    'Did you observe an adult hitting or smacking a child at this programme?',
  question2: 'Is the SmartStart programme being implemented for long enough?',
  question3: 'Are there too many children attending the SmartStart programme?',
  question4: 'Are there enough assistants for the programme?',
};

export const step15ReAccreditationVisitSection = 'Step 15';

interface State {
  question: string;
  answer: string | boolean;
}

export const Step15ReAccreditation = ({
  isView,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState<State[]>([
    {
      question: step15ReAccreditationQuestions.question1,
      answer: '',
    },
    {
      question: step15ReAccreditationQuestions.question2,
      answer: '',
    },
    {
      question: step15ReAccreditationQuestions.question3,
      answer: '',
    },
    {
      question: step15ReAccreditationQuestions.question4,
      answer: '',
    },
  ]);

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;

  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'reAccreditationPreviousFormData',
      step15ReAccreditationVisitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const optionsButtonGroup = [
    { text: 'Yes', value: true, disabled: isViewAnswers },
    { text: 'No', value: false, disabled: isViewAnswers },
  ];

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question, currentIndex) => {
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
          visitSection: step15ReAccreditationVisitSection,
          questions: updatedQuestions,
        },
      ]);

      setEnableButton?.(updatedQuestions.every((item) => item.answer !== ''));
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      setAnswers((prevState) => {
        if (!previousData?.questions.length) {
          return prevState;
        }
        return previousData?.questions.map((item) => ({
          ...item,
          answer: item.answer ? parseBool(item.answer as string) : '',
        }));
      });
    }
  }, [
    isViewAnswers,
    previousData,
    previousStatePreviousData?.questions.length,
  ]);

  useEffect(() => {
    handleViewMode();
  }, [handleViewMode]);

  useEffect(() => {
    if (isViewAnswers) {
      setEnableButton?.(true);
    }
  }, [isViewAnswers, setEnableButton]);

  return (
    <div className="flex flex-col p-4">
      <Typography type="h2" text="Additional concerns or observations" />
      {isViewAnswers && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      {questions.map((question, index) => (
        <Fragment key={question.question}>
          <Typography type="h4" className="mt-4" text={question.question} />
          {index > 0 && <Typography type="body" text={options[index - 1]} />}
          <ButtonGroup<boolean>
            className="mt-2"
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={optionsButtonGroup}
            selectedOptions={
              questions[index].answer !== ''
                ? Boolean(questions[index].answer)
                : undefined
            }
            onOptionSelected={(value) => onOptionSelected(value, index)}
          />
        </Fragment>
      ))}
    </div>
  );
};
