import {
  Alert,
  CheckboxChange,
  CheckboxGroup,
  Colours,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps, SectionQuestions } from '../../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { options } from './options';
import { useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';
import { usePrevious } from 'react-use';

export const step13VisitSection = 'Step 13';

export const Step13 = ({
  setSectionQuestions,
  setEnableButton,
  isView,
}: DynamicFormProps) => {
  const [question, setAnswers] = useState({
    question: 'Additional standards',
    answer: [] as (string | number | undefined)[],
  });

  const answers = question.answer as string[];

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;

  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'pqaPreviousFormData',
      step13VisitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

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

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      const answer =
        previousData?.questions?.[0]?.answer?.toString()?.split('.,') ?? [];

      setAnswers((prevState) => ({
        question: prevState.question,
        answer,
      }));
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
      {isViewAnswers && (
        <Alert
          className="mt-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
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
          checked={answers?.some((option) => item.includes(option))}
          value={item}
          disabled={isViewAnswers}
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
