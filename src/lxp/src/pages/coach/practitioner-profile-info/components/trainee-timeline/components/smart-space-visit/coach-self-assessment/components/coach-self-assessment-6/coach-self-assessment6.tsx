import { PractitionerDto } from '@ecdlink/core';
import { Button, Divider, Radio, Typography, renderIcon } from '@ecdlink/ui';
import { useState } from 'react';
import { options } from './options';
import { SelfAssessmentAlert } from '../self-assessment-alert/self-assessment-alert';

interface CoachSelfAssessment1Props {
  practitioner: PractitionerDto;
  handleNextSection: () => void;
}

interface State {
  question: string;
  answer: string;
}

export const CoachSelfAssessment6: React.FC<CoachSelfAssessment1Props> = ({
  practitioner,
  handleNextSection,
}) => {
  const isViewAnswers = true;
  const [questions, setAnswers] = useState<State[]>([
    {
      question: 'Which activities do you do every day?',
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

      <Divider dividerType="dashed" className="text-primaryAccent1 my-4" />

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
