import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { PractitionerDto } from '@ecdlink/core';
import {
  Alert,
  Button,
  CheckboxGroup,
  Colours,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';
import PositiveBonusEmoticon from '../../../../../../../../../assets/positive-bonus-emoticon.png';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { coachSelectors } from '@/store/coach';
import { authSelectors } from '@/store/auth';
import { SmartSpaceVisitData } from '@/store/trainee/trainee.types';

interface SmartSpaceCheck1Props {
  coachSmartSpaceVisitId: string;
  practitioner: PractitionerDto;
  saveSmartSpaceCheckData: (
    value: SmartSpaceVisitData[],
    visitSection: string
  ) => void;
  handleNextSection: () => void;
  onSubmit: () => void;
  setNotificationStep: (value: string) => void;
}

export const getGroupColor = (count: number): Colours => {
  if (count === 0) {
    return 'errorMain';
  }

  if (count < 5) {
    return 'alertMain';
  }

  return 'successMain';
};

export const SmartSpaceCheck10: React.FC<SmartSpaceCheck1Props> = ({
  coachSmartSpaceVisitId,
  practitioner,
  saveSmartSpaceCheckData,
  onSubmit,
  setNotificationStep,
}) => {
  const visitSection = 'SmartSpace licence awarded';

  const history = useHistory();
  const coach = useSelector(coachSelectors.getCoach);
  const user = useSelector(authSelectors.getAuthUser);
  const isCoach = coach?.user?.id === user?.id;
  const visitData = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionAnswers(
      coachSmartSpaceVisitId,
      visitSection
    )
  );
  const [questions, setAnswers] = useState<SmartSpaceVisitData[]>([
    {
      visitSection,
      question: 'I have issued a SmartSpace Certificate for this SmartStarter',
      questionAnswer: 'false',
    },
  ]);

  const trueAnswers = useMemo(() => {
    const answers = questions.every((item) => item.questionAnswer === 'true');
    return answers;
  }, [questions]);

  useEffect(() => {
    if (!!visitData && !!visitData.length) {
      setAnswers(visitData);
    }
  }, []);

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

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={visitSection}
        color={'textDark'}
        className={'my-3'}
      />

      <div>
        <div className="bg-successMain my-4 flex flex-row flex-nowrap items-center rounded-lg">
          <div className="rounded-full p-4">
            <img
              className={'h-14 w-16'}
              src={PositiveBonusEmoticon}
              alt="complete"
            />
          </div>
          <div>
            <Typography
              className={'w-full p-2'}
              type={'body'}
              color={'white'}
              text={`${practitioner?.user?.firstName}’s venue meets all of the SmartSpace standards.`}
            />
          </div>
        </div>
      </div>
      {!isCoach && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Typography
        className={'my-2 w-full p-2'}
        type={'h4'}
        color={'textDark'}
        text={`Please confirm:`}
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
          disabled={!isCoach}
        />
      ))}

      {trueAnswers && (
        <Alert
          type={'success'}
          title={'All steps complete - your signature has been added.'}
          className="mt-4 mb-2"
        />
      )}

      <div className="mt-2 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {
                if (!isCoach) {
                  setNotificationStep('');
                } else {
                  saveSmartSpaceCheckData(questions, visitSection);
                  onSubmit();
                  history.push(ROUTES.COACH_FRANCHISE_AGREEMENT, {
                    practitioner: practitioner,
                  });
                }
              }}
              disabled={!trueAnswers}
            >
              {renderIcon('DownloadIcon', 'mr-2 text-white w-5')}
              <Typography
                type={'help'}
                text={'Save & continue'}
                color={'white'}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
