import { Alert, Divider, Radio, Typography } from '@ecdlink/ui';
import { Fragment, useLayoutEffect, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';

export const selfAssessmentVisitSectionStep3 = 'Step 3';

export const Step3 = ({
  setEnableButton,
  setSectionQuestions,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question:
        'I speak and act warmly and respectfully to children. I give individual attention to different children and encourage them:',
      answer: '',
    },
    {
      question: 'I make sure that children who are upset are comforted:',
      answer: '',
    },
    {
      question:
        'I use calm methods to keep order, and do not use harsh words or physical methods:',
      answer: '',
    },
    {
      question:
        'I involve children in solving conflicts and listen carefully to their feelings, views and suggestions:',
      answer: '',
    },
  ]);

  const options = ['Sometimes', 'Most of the time', 'All the time'];

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
        visitSection: selfAssessmentVisitSectionStep3,
        questions: updatedQuestions,
      },
    ]);

    if (updatedQuestions.every((item) => item.answer !== '')) {
      return setEnableButton?.(true);
    }

    setEnableButton?.(false);
  };

  useLayoutEffect(() => {
    setEnableButton?.(false);
  }, [setEnableButton]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Typography type="h2" text="Self-assessment" color="textDark" />
      <Alert
        type="info"
        title="Read each statement and think carefully about your programme."
      />
      <Divider dividerType="dashed" />
      {questions.map((question, index) => (
        <Fragment key={question.question}>
          <Typography type="h4" text={question.question} />
          <fieldset className="flex flex-col gap-2">
            {options.map((item) => (
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
    </div>
  );
};
