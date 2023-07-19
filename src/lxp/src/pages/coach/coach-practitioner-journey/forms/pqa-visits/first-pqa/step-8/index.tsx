import { Divider, Radio, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { Fragment, useState } from 'react';
import { options } from './options';
import { Score } from '../components/score';

export const step8VisitSection = 'Step 8';
export const step8TotalScore = 8;

export const Step8 = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'Encouraging conversation during story time',
      answer: '',
    },
    {
      question: 'Explaining new words & ideas',
      answer: '',
    },
    {
      question: 'Asking questions & helping children to think',
      answer: '',
    },
    {
      question: 'Helping children to become familiar with books & print',
      answer: '',
    },
  ]);

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
        visitSection: step8VisitSection,
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
        text="6. Interactive storytelling that introduces children to new language & learning"
      />
      <Typography
        type="h4"
        text="Choose a score for each of the areas below"
        color="textMid"
      />
      <Divider dividerType="dashed" />
      {questions.map((question, index) => (
        <Fragment key={question.question}>
          <Typography type="h4" text={`6.${index + 1} ${question.question}`} />
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
        </Fragment>
      ))}
      <Score questions={questions} total={step8TotalScore} />
    </div>
  );
};
