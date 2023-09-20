import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { PractitionerDto } from '@ecdlink/core';
import {
  Button,
  Colours,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { SelfAssessmentAlert } from '../self-assessment-alert/self-assessment-alert';

interface SmartSpaceCheck1Props {
  practitioner: PractitionerDto;
  programmeName?: string | undefined | null;
  setSectionQuestions?: (value?: SectionQuestions[]) => void;
  handleNextSection?: any;
  saveSmartSpaceCheckData?: () => void;
}

export const getGroupColor = (count: number): Colours => {
  if (count === 0) {
    return 'errorMain';
  }

  if (count < 17) {
    return 'alertMain';
  }

  return 'successMain';
};

export const CoachSelfAssessment7: React.FC<SmartSpaceCheck1Props> = ({
  practitioner,
}) => {
  const history = useHistory();

  const [questions, setAnswers] = useState([
    {
      question:
        'What are some of the things you would like to do differently or get better at?',
      answer: '',
    },
  ]);

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={'Self-assessment (view only)'}
        color={'textDark'}
        className={'my-3'}
      />

      <SelfAssessmentAlert practitioner={practitioner} />

      <Divider dividerType="dashed" className={'my-4'} />

      <Typography
        type={'body'}
        className={'py-0.5'}
        text={questions[0].question}
        color="textDark"
      />
      <FormInput
        className="text-textDark mt-4"
        textInputType="textarea"
        // label={questions[0].question}

        placeholder={'e.g. always include recall time in my daily routine'}
        value={questions[0].answer}
        onChange={() => {}}
        disabled={true}
      />

      <div className="mt-2 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() =>
                history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
                  practitionerId: practitioner?.userId,
                })
              }
            >
              {renderIcon('ArrowLeftIcon', 'mr-2 text-white w-5')}
              <Typography type={'help'} text={'Exit'} color={'white'} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
