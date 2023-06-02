import {
  Alert,
  CheckboxChange,
  CheckboxGroup,
  Divider,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { replaceBraces } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const delicensingStep1VisitSection = 'Delicensing step 1';
export const delicensingQuestion2 = 'Additional notes';

export const Step1Delicensing = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question:
        'Please ask {client} to return the items below and confirm that you have received them.',
      answer: [],
    },
    {
      question: delicensingQuestion2,
      answer: undefined as string | undefined,
    },
  ]);

  const [question1, question2] = questions;
  const question1Answers = question1.answer as string[];

  const firstName = smartStarter?.user?.firstName || 'The smartStarter';
  const fullName = `${firstName} ${smartStarter?.user?.surname || ''}`;

  const checkboxOptions = [
    `I have collected ${firstName}’s SmartStart playkit`,
    `I have collected ${firstName}’s SmartStart handbook`,
  ];

  const { isOnline } = useOnlineStatus();

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      let updatedQuestions = questions.map((question) => {
        if (question.question === currentQuestion.question) {
          return {
            ...question,
            answer: value,
          };
        }
        return question;
      });

      const filteredQuestions = updatedQuestions.filter(
        (item) => item.answer !== undefined
      );

      setAnswers(updatedQuestions);
      setSectionQuestions?.([
        {
          visitSection: delicensingStep1VisitSection,
          questions: filteredQuestions,
        },
      ]);

      if (updatedQuestions[0].answer?.length === 2 && isOnline) {
        setEnableButton?.(true);
      } else {
        setEnableButton?.(false);
      }
    },
    [isOnline, questions, setEnableButton, setSectionQuestions]
  );

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      const answers = question1.answer as string[];
      if (event.checked) {
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        return onOptionSelected(currentAnswers, 0);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);

      return onOptionSelected(currentAnswers, 0);
    },
    [onOptionSelected, question1]
  );

  useEffect(() => {
    setEnableButton?.(false);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      {!isOnline && (
        <Alert className="mb-4" type="error" title="Not available offline" />
      )}
      <Typography type="h2" text="Exiting the programme" color="textDark" />
      <Typography
        type="h4"
        text={`${fullName}, ${new Date().toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`}
        color="textMid"
      />
      <Divider dividerType="dashed" className="my-4" />
      <Typography
        className="mt-4 mb-4"
        type="body"
        text={replaceBraces(question1.question, firstName)}
        color="textDark"
      />
      {checkboxOptions.map((item) => (
        <CheckboxGroup
          titleWeight="normal"
          className="mt-2"
          checkboxColor="primary"
          id={item}
          key={item}
          title={item}
          titleColours="textMid"
          checked={question1Answers?.some((option) => option === item)}
          value={item}
          onChange={onCheckboxChange}
        />
      ))}
      <FormInput
        label={question2.question}
        subLabel="Optional"
        placeholder="e.g. discussed alternative career paths"
        type="text"
        textInputType="textarea"
        className="mt-4"
        value={question2.answer as string}
        onChange={(event) => onOptionSelected(event.target.value, 1)}
      />
    </div>
  );
};
