import { Divider, Radio, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useState } from 'react';
import { options } from './options';
import { Score } from '../components/score';

export const Step7 = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'Letting children make choices',
      answer: '',
    },
    {
      question: "Facilitating children's play",
      answer: '',
    },
    {
      question: "Participating in children's play",
      answer: '',
    },
    {
      question: 'Extending learning through play',
      answer: '',
    },
    {
      question: 'Ensuring play & learning is at the right level',
      answer: '',
    },
  ]);
  const visitSection = 'Step 7';

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
        text="5. Opportunities for child-directed, open-ended play, supported & extended by adults"
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
