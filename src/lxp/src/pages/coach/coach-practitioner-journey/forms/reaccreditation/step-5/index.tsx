import { FormInput, Typography } from '@ecdlink/ui';
import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { useParams } from 'react-router';
import { PractitionerJourneyParams } from '../../../coach-practitioner-journey.types';
import { useSelector } from 'react-redux';
import { ClassroomGroup } from '@ecdlink/graphql';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { calculateCapacity } from './utils/math';

export const Step5ReAccreditation = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'How many cm is the short side of the room?',
      answer: '',
    },
    {
      question: 'How many cm is the long side of the room?',
      answer: '',
    },
  ]);

  const visitSection = 'Step 5';

  const onOptionSelected = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index) => {
      const value = event.target.value;
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
          visitSection,
          questions: updatedQuestions,
        },
      ]);

      setEnableButton?.(updatedQuestions.every((item) => !!item.answer));
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  const t = calculateCapacity({
    longSide: 800,
    shortSide: 205,
    numberOfAssistants: 1,
    programType: 'preschool',
  });

  console.log({ t });

  return (
    <div className="p-4">
      <Typography type="h2" text="Programme details" color="textDark" />
      <Typography
        type="h4"
        text="Measure the room in centimetres:"
        color="textDark"
        className="my-4"
      />
      <Typography
        type="h4"
        text="Help the SmartStarter clear the space so that it is laid out as it will be when the programme is running. Now use your measuring tape to measure it."
        color="textMid"
        className="my-4"
      />
      {questions.map((item, index) => (
        <div className="flex items-end gap-2">
          <FormInput
            type="number"
            className="mt-2"
            label={item.question}
            placeholder="e.g. 410"
            value={item.answer}
            onChange={(value) => onOptionSelected(value, index)}
            {...(!!item.answer &&
              Number(item.answer) < 50 && {
                error: {
                  type: 'max',
                  message: 'Please enter a number that is more 49.',
                },
              })}
          />
          <span className="mb-4">cm</span>
        </div>
      ))}
    </div>
  );
};
