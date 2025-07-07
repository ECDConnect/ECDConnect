import { Alert, Divider, Radio, Typography } from '@ecdlink/ui';
import { DynamicFormProps, SectionQuestions } from '../../../dynamic-form';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { options } from './options';
import { Score } from '../components/score';
import { useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';
import { usePrevious } from 'react-use';

export const step5VisitSection = 'Step 5';
export const step5TotalScore = 12;

interface State {
  question: string;
  answer: string;
}

export const Step5 = ({
  setSectionQuestions,
  setEnableButton,
  isView,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState<State[]>([
    {
      question: 'Warm & respectful interactions',
      answer: '',
    },
    {
      question: 'Individual attention',
      answer: '',
    },
    {
      question: 'Acknowledgement & encouragement',
      answer: '',
    },
    {
      question: 'Looking after upset children',
      answer: '',
    },
    {
      question: 'Maintaining order',
      answer: '',
    },
    {
      question: 'Resolving conflict',
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
      'pqaPreviousFormData',
      step5VisitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    questionName: string
  ) => {
    const value = event.target.value;

    const updatedQuestions = questions.map((question) => {
      if (question.question === questionName) {
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
        visitSection: step5VisitSection,
        questions: updatedQuestions,
      },
    ]);

    if (updatedQuestions.every((item) => item.answer !== '')) {
      return setEnableButton?.(true);
    }

    setEnableButton?.(false);
  };

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      setAnswers(previousData?.questions as State[]);
    }
  }, [isViewAnswers, previousData, previousStatePreviousData]);

  useEffect(() => {
    handleViewMode();
  }, [handleViewMode]);

  useEffect(() => {
    if (isViewAnswers) {
      setEnableButton?.(true);
    }
  }, [isViewAnswers, setEnableButton]);

  return (
    <div className="flex flex-col gap-2 p-4">
      <Typography
        type="h2"
        text="3. A stable & nurturing environment where children feel safe & loved"
      />
      <Typography
        type="h4"
        text="Choose a score for each of the areas below"
        color="textMid"
      />
      {isViewAnswers && (
        <Alert
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Divider dividerType="dashed" />
      {questions.map((question, index) => (
        <Fragment key={question.question}>
          <Typography type="h4" text={`3.${index + 1} ${question.question}`} />
          {index === 3 && (
            <Alert
              className="my-2"
              type="info"
              title="If during the session, you do not observe an upset child, you will need to find out more to rate 3.4:"
              list={[
                'After the session has ended, ask them an open-ended question about what they do when children are upset. Use their answers to update the rating.',
              ]}
            />
          )}
          {index === 5 && (
            <Alert
              className="my-2"
              type="info"
              title="If during the session, you do not observe any conflict, you will need to find out more to rate 3.6:"
              list={[
                'After the session has ended, ask them an open-ended question about what they do when children fight. Use their answers to give a rating.',
              ]}
            />
          )}
          <fieldset className="flex flex-col gap-2">
            {options[`question${String(index + 1)}`]?.map((item) => (
              <Radio
                variant="slim"
                key={item}
                description={item}
                value={item}
                checked={questions[index].answer === item}
                disabled={isViewAnswers}
                onChange={(event) => handleChange(event, question.question)}
              />
            ))}
          </fieldset>
        </Fragment>
      ))}
      <Score questions={questions} total={step5TotalScore} />
    </div>
  );
};
