import {
  CheckboxChange,
  CheckboxGroup,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { noneOption, selfAssessmentStep5Options } from './options';
import { usePrevious } from '@ecdlink/core';

export const selfAssessmentVisitSectionStep5 = 'Step 5';

export const Step5 = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [optionList, setOptionList] = useState<
    {
      title: string;
      disabled?: boolean;
    }[]
  >(
    selfAssessmentStep5Options.map((item) => ({ title: item, disabled: false }))
  );
  const [question, setAnswers] = useState({
    question: 'Which activities do you do every day?',
    answer: [] as (string | number | undefined)[],
  });

  const answers = question.answer as string[];
  const previousAnswers = usePrevious(answers) as string[] | undefined;

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
            visitSection: selfAssessmentVisitSectionStep5,
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
          visitSection: selfAssessmentVisitSectionStep5,
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
          visitSection: selfAssessmentVisitSectionStep5,
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
      <Typography type="h2" text="Self-assessment" />
      <Divider dividerType="dashed" />
      <div className="flex flex-col gap-2 py-4">
        <Typography type="h4" text={question.question} />
        {optionList.map((item, index) => (
          <CheckboxGroup
            checkboxColor="primary"
            id={item.title}
            key={item.title}
            title={item.title}
            titleWeight="normal"
            checked={answers?.some((option) => option === item.title)}
            value={item.title}
            onChange={onCheckboxChange}
            disabled={answers?.includes(noneOption) ? item?.disabled : false}
          />
        ))}
      </div>
    </div>
  );
};
