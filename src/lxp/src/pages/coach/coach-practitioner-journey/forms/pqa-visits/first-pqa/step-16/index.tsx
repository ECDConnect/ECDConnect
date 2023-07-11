import {
  ButtonGroup,
  ButtonGroupTypes,
  Colours,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { Fragment, useCallback, useState } from 'react';
import { step5TotalScore, step5VisitSection } from '../step-5';

export const step16VisitSection = 'Step 16';
export const step16Question1 =
  'Did you observe an adult hitting or smacking a child at this programme?';
export const step16Question2 =
  'Is the SmartStart programme being implemented for long enough?';
export const step16Question3 =
  'Are there too many children attending the SmartStart programme?';

export const Step16 = ({
  sectionQuestions,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: step16Question1,
      answer: '',
    },
    {
      question: step16Question2,
      answer: '',
    },
    {
      question: step16Question3,
      answer: '',
    },
  ]);

  const step5Questions = sectionQuestions?.find(
    (item) => item.visitSection === step5VisitSection
  )?.questions;

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const getScore = () => {
    const scores = step5Questions
      ?.filter((item) => item.answer !== '')
      ?.map((item) => Number(String(item?.answer)?.split(' - ')[0]));

    const result = scores?.reduce((total, number) => total + number, 0) ?? 0;
    let scoreColours: Colours = 'errorMain';

    if (result >= 4) {
      scoreColours = 'successMain';
    }

    return {
      score: result,
      color: scoreColours,
    };
  };

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
          visitSection: step16VisitSection,
          questions: updatedQuestions,
        },
      ]);

      const isAllCompleted = updatedQuestions.every(
        (item) => item.answer !== ''
      );

      if (isAllCompleted) {
        setEnableButton?.(true);
      } else {
        setEnableButton?.(false);
      }
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  return (
    <div className="p-4">
      <Typography
        type="h2"
        className="mb-4"
        text="Additional concerns or observations"
        color="textDark"
      />
      {questions.map((item, index) => (
        <Fragment key={item.question}>
          <Typography
            type="h4"
            text={item.question}
            color="textDark"
            className="mt-4 mb-2"
          />
          <ButtonGroup<boolean>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={options}
            onOptionSelected={(value) => onOptionSelected(value, index)}
          />
          {index === 0 && (
            <>
              <Divider className="mt-2 mb-4" dividerType="dashed" />
              <Typography
                type="h4"
                text="Rating for “3. A stable and nurturing environment where children feel save & loved”:"
                color="textDark"
                className="mt-4 mb-2"
              />
              <span
                className={`p-1 text-sm font-semibold text-white bg-${
                  getScore().color
                } rounded-15`}
              >
                {getScore().score}/{step5TotalScore}
              </span>
              <Divider className="mt-2 mb-4" dividerType="dashed" />
            </>
          )}
        </Fragment>
      ))}
    </div>
  );
};
