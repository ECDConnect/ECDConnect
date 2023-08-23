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
import { noneOption, options } from './options';
import { usePrevious, useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';

export const step3VisitSection = 'Step 3';
export const step3TotalScore = 2;

export const step3GetScore = (answers: string[]) => {
  const length = answers?.length;
  let result = 0;
  let scoreColours: Colours = 'errorMain';

  if (length > 3 && length < 8) {
    scoreColours = 'alertMain';
    result = 1;
  }

  if (length >= 8) {
    scoreColours = 'successMain';
    result = 2;
  }

  return {
    score: result,
    color: scoreColours,
  };
};

interface State {
  question: string;
  answer: (string | number | undefined)[] | undefined;
}

interface Option {
  title: string;
  disabled?: boolean;
}

export const Step3 = ({
  setSectionQuestions,
  setEnableButton,
  isView,
}: DynamicFormProps) => {
  const [optionList, setOptionList] = useState<Option[]>(
    options.map((item) => ({ title: item, disabled: false }))
  );
  const [question, setAnswers] = useState<State>({
    question: `Which of these did you see during the session?`,
    answer: [] as (string | number | undefined)[] | undefined,
  });

  const answers = question.answer as string[];
  const previousAnswers = usePrevious(answers) as string[] | undefined;

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;

  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'pqaPreviousFormData',
      step3VisitSection
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
        setEnableButton?.(true);
        return setSectionQuestions?.([
          {
            visitSection: step3VisitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setEnableButton?.(!!currentAnswers?.length);
      setAnswers(updatedQuestion);
      return setSectionQuestions?.([
        {
          visitSection: step3VisitSection,
          questions: [updatedQuestion],
        },
      ]);
    },
    [answers, question, setEnableButton, setSectionQuestions]
  );

  const handleOnChangeSelectedOptions = useCallback(() => {
    if (answers.length === previousAnswers?.length) return;

    if (!answers?.includes(noneOption) && answers.length) {
      return setOptionList((prevState) =>
        prevState.map((item) => {
          if (item.title === noneOption) {
            return { ...item, disabled: true };
          }
          return { ...item, disabled: false };
        })
      );
    }

    if (answers?.includes(noneOption)) {
      const updatedQuestion = { ...question, answer: [noneOption] };

      setAnswers(updatedQuestion);
      setSectionQuestions?.([
        {
          visitSection: step3VisitSection,
          questions: [updatedQuestion],
        },
      ]);
      return setOptionList((prevState) =>
        prevState.map((item) => {
          if (item.title !== noneOption) {
            return { ...item, disabled: true };
          }
          return { ...item, disabled: false };
        })
      );
    }

    return setOptionList((prevState) =>
      prevState.map((item) => ({ ...item, disabled: false }))
    );
  }, [answers, previousAnswers?.length, question, setSectionQuestions]);

  const getDisabledState = (item: Option) => {
    if (isViewAnswers) {
      return true;
    }

    return answers?.includes(noneOption) ? item?.disabled : false;
  };

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      const answer =
        previousData?.questions?.[0]?.answer?.toString()?.split(',') ?? [];
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
    handleOnChangeSelectedOptions();
  }, [handleOnChangeSelectedOptions]);

  useEffect(() => {
    handleViewMode();
  }, [handleViewMode]);

  useEffect(() => {
    if (isViewAnswers) {
      setEnableButton?.(true);
    }
  }, [isViewAnswers, setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="2. Consistent use of the SmartStart routine"
      />
      {isViewAnswers && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Divider dividerType="dashed" />
      <div className="flex flex-col gap-2 py-4">
        <Typography type="h4" text={`2.1 ${question.question}`} />
        {optionList.map((item, index) => (
          <CheckboxGroup
            checkboxColor="primary"
            id={item.title}
            key={item.title}
            title={item.title}
            checked={answers?.some((option) => option === item.title)}
            value={item.title}
            onChange={onCheckboxChange}
            disabled={getDisabledState(item)}
          />
        ))}
      </div>
      <div className="mt-8 flex items-center gap-2">
        <span
          className={`p-2 text-sm font-semibold text-white bg-${
            step3GetScore(answers).color
          } rounded-15`}
        >
          {step3GetScore(answers).score}/{step3TotalScore}
        </span>
        <Typography type="h4" text="Score" />
      </div>
    </div>
  );
};
