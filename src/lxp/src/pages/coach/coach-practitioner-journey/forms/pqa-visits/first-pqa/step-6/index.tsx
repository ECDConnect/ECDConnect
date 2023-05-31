import { Divider, Radio, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useState } from 'react';
import { options } from './options';
import { Score } from '../components/score';

export const Step6 = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'Talking to children & encouraging communication',
      answer: '',
    },
    {
      question: 'Listening & responding',
      answer: '',
    },
    {
      question: 'Using talk to extend learning',
      answer: '',
    },
    {
      question: 'Building language',
      answer: '',
    },
    {
      question: 'Encouraging initiative',
      answer: '',
    },
  ]);
  const visitSection = 'Step 6';

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
        text="4. Positive & plentiful adult-child interactions which encourage a rich use of language"
      />
      <Typography
        type="h4"
        text="Choose a score for each of the areas below"
        color="textMid"
      />
      <Divider dividerType="dashed" />
      {questions.map((question, index) => (
        <>
          <Typography type="h4" text={`4.${index + 1} ${question.question}`} />
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
      <Score questions={questions} total={10} />
    </div>
  );
};
