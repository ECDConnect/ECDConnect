import ROUTES from '@/routes/routes';
import { traineeSelectors, traineeThunkActions } from '@/store/trainee';
import { SmartSpaceVisitData } from '@/store/trainee/trainee.types';
import { PractitionerDto } from '@ecdlink/core';
import {
  Alert,
  Button,
  Card,
  CheckboxGroup,
  Colours,
  Divider,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

interface CoachTraineeFranchisorAgreement1Props {
  smartSpaceVisitId: string;
  practitioner: PractitionerDto;
  saveFranchisorAgreementData: (
    value: SmartSpaceVisitData[],
    visitSection: string
  ) => void;
  submitCoachFranchisorAgreement: () => void;
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

export const CoachTraineeFranchisorAgreement1: React.FC<
  CoachTraineeFranchisorAgreement1Props
> = ({
  smartSpaceVisitId,
  practitioner,
  saveFranchisorAgreementData,
  submitCoachFranchisorAgreement,
}) => {
  const visitSection = 'Franchisee agreement';

  const history = useHistory();

  const visitData = useSelector(
    traineeSelectors.getCoachFranchisorAgreementSectionData(
      smartSpaceVisitId,
      visitSection
    )
  );
  const coachVisitNextSteps = useSelector(
    traineeSelectors.getCoachVisitDataNextSteps(smartSpaceVisitId)
  );

  const [questions, setAnswers] = useState<SmartSpaceVisitData[]>([
    {
      visitSection,
      question: `${practitioner.user?.firstName} agrees to take the actions described in the box above in order to meet & maintain all SmartSpace standards.`,
      questionAnswer: 'false',
    },
    {
      visitSection,
      question: `${practitioner.user?.firstName} understands that the Club Coach will visit again within 2 weeks to make sure changes have been made and that the Practice Licence may be withdrawn if they have not.`,
      questionAnswer: 'false',
    },
    {
      visitSection,
      question: `${practitioner.user?.firstName} understands that they should not have more than 20 children at their site.`,
      questionAnswer: 'false',
    },
    {
      visitSection,
      question: `${practitioner.user?.firstName} received the SmartStart playkit and SmartStart admin file.`,
      questionAnswer: 'false',
    },
  ]);

  const trueAnswers = useMemo(() => {
    const answers = questions?.every((item) => item.questionAnswer === 'true');
    return answers;
  }, [questions]);

  const onOptionSelected = useCallback(
    (value: string, index: number) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question) => {
        if (question.question === currentQuestion.question) {
          return {
            ...question,
            questionAnswer: value,
          };
        }
        return question;
      });

      setAnswers(updatedQuestions);
    },
    [questions]
  );

  useEffect(() => {
    if (!!visitData && !!visitData.length) {
      setAnswers(visitData);
    }
  }, []);

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={visitSection}
        color={'textDark'}
        className={'my-3'}
      />
      <Card className="bg-uiBg rounded-2xl p-4">
        <Typography
          type={'body'}
          weight="bold"
          text={`Next steps for ${practitioner?.user?.firstName}`}
          color={'textDark'}
          className={'my-3'}
        />
        <Typography
          type={'body'}
          text={`• ${coachVisitNextSteps?.questionAnswer}`}
          color={'textMid'}
          className={'my-3'}
        />
      </Card>

      <Typography
        type={'h4'}
        text={`Give the phone to ${practitioner?.user?.firstName} & ask them to confirm each item by tapping the box:`}
        color={'textDark'}
        className={'my-3'}
      />
      {questions.map((item, index) => (
        <CheckboxGroup
          id={item.question}
          key={item.question}
          title={''}
          description={item.question}
          checked={questions?.some(
            (option) =>
              option.question === item.question &&
              option.questionAnswer === 'true'
          )}
          value={item.question}
          onChange={() =>
            onOptionSelected(
              item.questionAnswer === 'true' ? 'false' : 'true',
              index
            )
          }
          className="mb-1"
        />
      ))}

      <Alert
        type="warning"
        className="mt-4"
        title={`By tapping the “Next” button below, you are confirming that ${practitioner?.user?.firstName} checked the boxes above and agrees to all of the steps.`}
      />

      <div className="mt-4 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {
                saveFranchisorAgreementData(questions, visitSection);
                submitCoachFranchisorAgreement();
                history.push(ROUTES.COACH_SELF_ASSESSMENT, {
                  practitioner: practitioner,
                });
              }}
              disabled={!trueAnswers}
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
