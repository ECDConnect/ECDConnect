import { Divider, Radio, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useState } from 'react';
import { options } from './options';
import { Score } from '../components/score';

export const Step4 = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'SmartStart routine',
      answer: '',
    },
    {
      question: 'Small group time',
      answer: '',
    },
    {
      question: 'Making plans',
      answer: '',
    },
    {
      question: 'Free play',
      answer: '',
    },
    {
      question: 'Recall',
      answer: '',
    },
    {
      question: 'Story time',
      answer: '',
    },
    {
      question: 'Large group time',
      answer: '',
    },
  ]);
  const visitSection = 'Step 4';

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
        visitSection,
        questions: updatedQuestions,
      },
    ]);

    if (updatedQuestions.every((item) => item.answer !== '')) {
      return setEnableButton?.(true);
    }

    setEnableButton?.(false);
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <Typography
        type="h2"
        text="2. Consistent use of the SmartStart routine"
      />
      <Typography
        type="h4"
        text="Choose a score for each of the areas below"
        color="textMid"
      />
      <Divider dividerType="dashed" />
      {questions.map((question, index) => (
        <>
          <Typography type="h4" text={`2.${index + 2} ${question.question}`} />
          <fieldset className="flex flex-col gap-2">
            {options[`question${String(index + 1)}`]?.map((item) => (
              <Radio
                variant="slim"
                key={item}
                description={item}
                value={item}
                checked={questions[index].answer === item}
                onChange={(event) => handleChange(event, question.question)}
              />
            ))}
          </fieldset>
        </>
      ))}
      <Score questions={questions} total={14} />
    </div>
  );
};
