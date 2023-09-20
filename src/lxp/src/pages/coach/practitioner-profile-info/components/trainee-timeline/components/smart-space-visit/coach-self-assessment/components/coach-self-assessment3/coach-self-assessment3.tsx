import { PractitionerDto } from '@ecdlink/core';
import { Alert, Button, Radio, Typography, renderIcon } from '@ecdlink/ui';
import { Fragment, useState } from 'react';
import { options } from './options';
import { SelfAssessmentAlert } from '../self-assessment-alert/self-assessment-alert';

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

export const CoachSelfAssessment3: React.FC<CoachSelfAssessment1Props> = ({
  practitioner,
  handleNextSection,
}) => {
  const isViewAnswers = true;
  const [questions, setAnswers] = useState<State[]>([
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
        'I put up the SmartStart routine so children can reach and ask the children to move a marker that shows where we are in the programme:s',
      answer: '',
    },
    {
      question:
        'I make sure children always have the chance to plan their activities before free play, and to talk about it afterwards:',
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

      <SelfAssessmentAlert practitioner={practitioner} />

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
