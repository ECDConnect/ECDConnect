import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { authSelectors } from '@/store/auth';
import { coachSelectors } from '@/store/coach';
import { traineeSelectors } from '@/store/trainee';
import { SmartSpaceVisitData } from '@/store/trainee/trainee.types';
import { PractitionerDto } from '@ecdlink/core';
import {
  Alert,
  Button,
  CheckboxGroup,
  Colours,
  Divider,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

interface SmartSpaceCheck1Props {
  coachSmartSpaceVisitId: string;
  practitioner: PractitionerDto;
  saveSmartSpaceCheckData: (
    value: SmartSpaceVisitData[],
    visitSection: string
  ) => void;
  handleNextSection: () => void;
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

export const SmartSpaceCheck8: React.FC<SmartSpaceCheck1Props> = ({
  coachSmartSpaceVisitId,
  practitioner,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const visitSection = 'Confirm';
  const visitData = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionAnswers(
      coachSmartSpaceVisitId,
      visitSection
    )
  );
  const coach = useSelector(coachSelectors.getCoach);
  const user = useSelector(authSelectors.getAuthUser);
  const isCoach = coach?.user?.id === user?.id;
  const [questions, setAnswers] = useState<SmartSpaceVisitData[]>([
    {
      visitSection,
      question: `I gave ${practitioner?.user?.firstName} a playkit and admin file and explained the contents of the file.`,
      questionAnswer: 'false',
    },
    {
      visitSection,
      question: `I reminded and showed ${practitioner?.user?.firstName} how to keep child attendance (on paper and on Funda App).`,
      questionAnswer: 'false',
    },
    {
      visitSection,
      question: `I have checked that all of ${practitioner?.user?.firstName}'s personal information is correct on the Funda App system.`,
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
      <Divider dividerType="dashed" className={'my-4'} />
      {!isCoach && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}

      <Typography
        type={'h4'}
        text={'Please confirm the following:'}
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
              option?.questionAnswer === 'true'
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

      <div className="mt-4 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {
                saveSmartSpaceCheckData(questions, visitSection);
                handleNextSection();
              }}
              disabled={!trueAnswers && isCoach}
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
