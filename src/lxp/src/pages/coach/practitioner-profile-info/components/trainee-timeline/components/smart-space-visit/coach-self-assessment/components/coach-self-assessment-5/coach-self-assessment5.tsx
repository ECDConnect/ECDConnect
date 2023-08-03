import { PractitionerDto } from '@ecdlink/core';
import { Alert, Button, Radio, Typography, renderIcon } from '@ecdlink/ui';
import { Fragment, useState } from 'react';
import { options } from './options';

interface CoachSelfAssessment1Props {
  practitioner: PractitionerDto;
  handleNextSection: () => void;
  // programmeName: string | undefined | null;
  // setSectionQuestions: (value?: SectionQuestions[]) => void;
  // saveFranchisorAgreementData: () => void;
}

interface State {
  question: string;
  answer: string;
}

export const CoachSelfAssessment5: React.FC<CoachSelfAssessment1Props> = ({
  practitioner,
  handleNextSection,
}) => {
  const isViewAnswers = true;
  const [questions, setAnswers] = useState<State[]>([
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
        'I involve children in solving conflicts and listen carefully to their feelings, views and suggestions:',
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

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={`Self assessment (View only)`}
        color={'textDark'}
        className={'mt-3'}
      />

      <Alert
        type={'warning'}
        title={'You are viewing this form and cannot fill in responses.'}
        list={['Discuss the self-assessment form with Nothando.']}
        className="mt-4 mb-2"
      />

      <Alert
        type={'info'}
        title={'Read each statement and think carefully about your programme.'}
        className="mt-4 mb-2"
      />

      {questions.map((question, index) => (
        <div key={question.question} className="mb-4">
          <Typography
            type="h4"
            text={`${question.question}`}
            className="mb-2"
          />
          <fieldset className="flex flex-col gap-2">
            {options[`question${String(index + 1)}`]?.map((item) => (
              <Radio
                variant="slim"
                key={item}
                description={item}
                value={item}
                checked={questions[0].answer === item}
                disabled={isViewAnswers}
                onChange={(event) => {}}
              />
            ))}
          </fieldset>
        </div>
      ))}

      <div className="mt-4 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {
                handleNextSection();
              }}
            >
              {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
              <Typography type={'help'} text={'Next'} color={'white'} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
