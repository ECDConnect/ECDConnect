import { Alert, Divider, Radio, Typography } from '@ecdlink/ui';
import { Fragment, useLayoutEffect, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';

export const selfAssessmentVisitSectionStep4 = 'Step 4';

export const Step4 = ({
  setEnableButton,
  setSectionQuestions,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question:
        'I talk with children throughout the programme. I encourage children to talk about what they are doing and thinking, and I listen carefully to their ideas:',
      answer: '',
    },
    {
      question:
        'I help to improve children’s language by telling them new words and explaining what they mean:',
      answer: '',
    },
    {
      question:
        'I let children make their own choices about what to play and I allow them to play and learn at their own level:',
      answer: '',
    },
    {
      question:
        'I give children appropriate toys and materials to play with and support them to use them when needed:',
      answer: '',
    },
    {
      question:
        'I join in children’s play and give support when needed. I get onto their level and share information and ask questions during play, to help children think and learn:',
      answer: '',
    },
    {
      question:
        'I make storytimes that are fun and full of conversation. I use questions and comments to encourage children to think:',
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
        visitSection: selfAssessmentVisitSectionStep4,
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
