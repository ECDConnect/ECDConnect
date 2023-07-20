import { ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import { Fragment, useCallback, useState } from 'react';
import { options } from './options';
import { DynamicFormProps } from '../../dynamic-form';

export const step15ReAccreditationQuestions = {
  question1:
    'Did you observe an adult hitting or smacking a child at this programme?',
  question2: 'Is the SmartStart programme being implemented for long enough?',
  question3: 'Are there too many children attending the SmartStart programme?',
  question4: 'Are there enough assistants for the programme?',
};

export const step15ReAccreditationVisitSection = 'Step 15';

export const Step15ReAccreditation = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
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

  const optionsButtonGroup = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
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

  return (
    <div className="flex flex-col p-4">
      <Typography type="h2" text="Additional concerns or observations" />
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
