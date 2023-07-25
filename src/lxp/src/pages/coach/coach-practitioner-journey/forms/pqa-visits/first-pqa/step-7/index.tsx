import { Alert, Divider, Radio, Typography } from '@ecdlink/ui';
import { DynamicFormProps, SectionQuestions } from '../../../dynamic-form';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { options } from './options';
import { Score } from '../components/score';
import { usePrevious, useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';

export const step7VisitSection = 'Step 7';
export const step7TotalScore = 10;

interface State {
  question: string;
  answer: string;
}

export const Step7 = ({
  setSectionQuestions,
  setEnableButton,
  isView,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'Letting children make choices',
      answer: '',
    },
    {
      question: "Facilitating children's play",
      answer: '',
    },
    {
      question: "Participating in children's play",
      answer: '',
    },
    {
      question: 'Extending learning through play',
      answer: '',
    },
    {
      question: 'Ensuring play & learning is at the right level',
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
      step7VisitSection
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
        visitSection: step7VisitSection,
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
        text="5. Opportunities for child-directed, open-ended play, supported & extended by adults"
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
          <Typography type="h4" text={`5.${index + 1} ${question.question}`} />
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
      <Score questions={questions} total={step7TotalScore} />
    </div>
  );
};
