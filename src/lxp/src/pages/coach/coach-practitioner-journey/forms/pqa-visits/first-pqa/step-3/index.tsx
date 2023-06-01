import {
  CheckboxChange,
  CheckboxGroup,
  Colours,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { noneOption, options } from './options';
import { usePrevious } from '@ecdlink/core';

export const Step3 = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [optionList, setOptionList] = useState<
    {
      title: string;
      disabled?: boolean;
    }[]
  >(options.map((item) => ({ title: item, disabled: false })));
  const [question, setAnswers] = useState({
    question: `Which of these did you see during the session?`,
    answer: [] as (string | number | undefined)[],
  });

  const answers = question.answer as string[];
  const previousAnswers = usePrevious(answers) as string[] | undefined;

  const visitSection = 'Step 3';

  const getScore = () => {
    const length = answers.length;
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
            visitSection,
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
          visitSection,
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
          visitSection,
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

  useEffect(() => {
    handleOnChangeSelectedOptions();
  }, [handleOnChangeSelectedOptions]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="1. A stimulating & adequately resourced learning environment"
      />
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
            disabled={answers?.includes(noneOption) ? item?.disabled : false}
          />
        ))}
      </div>
      <div className="mt-8 flex items-center gap-2">
        <span
          className={`p-2 text-sm font-semibold text-white bg-${
            getScore().color
          } rounded-15`}
        >
          {getScore().score}/2
        </span>
        <Typography type="h4" text="Score" />
      </div>
    </div>
  );
};
