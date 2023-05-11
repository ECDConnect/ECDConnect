import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { replaceBraces } from '@ecdlink/core';

const MOCKED_DATA = {
  programmeType: 'Playgroup',
};
export const ProgrammeDetails = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: `Does {client} receive start-up support from SmartStart?`,
      answer: '',
    },
    {
      question: `Does {client} collect preschool fees from caregivers?`,
      answer: '',
    },
    {
      question: `How much does {client} charge per month?`,
      answer: '',
    },
  ]);

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const name = smartStarter?.user?.firstName || 'the smartStarter';
  const visitSection = 'Programme details';
  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question, currentIndex) => {
        if (index === 1 && currentIndex === 2) {
          return {
            ...question,
            answer: '',
          };
        }

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

      const count = updatedQuestions.filter(
        (item) => item.answer !== ''
      ).length;

      if (
        (!!Boolean(updatedQuestions[1].answer) && count === 3) ||
        (Boolean(updatedQuestions[1].answer) === false && count === 2)
      ) {
        return setEnableButton?.(true);
      }

      setEnableButton?.(false);
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  return (
    <div className="p-4">
      <Typography type="h2" text={visitSection} color="textDark" />
      <Typography
        type="h4"
        text={new Date().toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })}
        color="textMid"
      />
      <Typography
        type="h4"
        text={`Programme type: ${MOCKED_DATA.programmeType}`}
        color="textDark"
        className="my-4"
      />

      <Typography
        type="h4"
        text={replaceBraces(questions[0].question, name)}
        color="textDark"
        className="my-4"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        onOptionSelected={(value) => onOptionSelected(value, 0)}
      />
      <Typography
        type="h4"
        text={replaceBraces(questions[1].question, name)}
        color="textDark"
        className="my-4"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        onOptionSelected={(value) => onOptionSelected(value, 1)}
      />
      {!!Boolean(questions[1].answer) && (
        <FormInput
          className="mt-4"
          label={replaceBraces(questions[2].question, name)}
          type="number"
          prefixIcon
          value={questions[2].answer}
          onChange={(event) => onOptionSelected(event.target.value, 2)}
        />
      )}
      {!!Boolean(questions[0].answer) && (
        <Alert
          className="mt-4"
          type="info"
          title={`Check if ${name} has any questions about fees or needs support.`}
        />
      )}
    </div>
  );
};
