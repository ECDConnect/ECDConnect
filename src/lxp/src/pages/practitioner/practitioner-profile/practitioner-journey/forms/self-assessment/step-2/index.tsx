import { Alert, Divider, Radio, Typography } from '@ecdlink/ui';
import { Fragment, useLayoutEffect, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';

export const selfAssessmentVisitSectionStep2 = 'Step 2';

export const Step2 = ({
  setEnableButton,
  setSectionQuestions,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'I make sure children are supervised:',
      answer: '',
    },
    {
      question: 'I make a fun & interesting space, with things on the wall:',
      answer: '',
    },
    {
      question:
        'I unpack the playkit and materials and put them where children can reach them:',
      answer: '',
    },
    {
      question:
        'I set up different interest areas with area labels (art, pretend, building, toys and games, story):',
      answer: '',
    },
    {
      question:
        'I put up the SmartStart routine so children can reach and ask the children to move a marker that shows where we are in the programme:',
      answer: '',
    },
    {
      question:
        'I make sure children always have the chance to plan their activities before free play, and to talk about it afterwards:',
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
        visitSection: selfAssessmentVisitSectionStep2,
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
