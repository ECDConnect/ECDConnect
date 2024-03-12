import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
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
import { traineeSelectors } from '@/store/trainee';
import { coachSelectors } from '@/store/coach';
import { authSelectors } from '@/store/auth';
import { SmartSpaceVisitData } from '@/store/trainee/trainee.types';

interface SmartSpaceCheck1Props {
  coachSmartSpaceVisitId: string;
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

  if (count < 5) {
    return 'alertMain';
  }

  return 'successMain';
};

export const SmartSpaceCheck2: React.FC<SmartSpaceCheck1Props> = ({
  coachSmartSpaceVisitId,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const visitSection = 'Additional standards';
  const visitData = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionAnswers(
      coachSmartSpaceVisitId,
      'Additional standards'
    )
  );
  const coach = useSelector(coachSelectors.getCoach);
  const user = useSelector(authSelectors.getAuthUser);
  const isCoach = coach?.user?.id === user?.id;
  const [questions, setAnswers] = useState<SmartSpaceVisitData[]>([
    {
      visitSection,
      question:
        'The venue offers children enough space to play freely (about one square metre per child).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'If children use an outdoor area, it is fenced with a lockable gate.',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question: 'There is a list of emergency numbers visible on the wall.',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'The venue has good natural ventilation (windows or doors that can open).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'The programme does not exceed the maximum child number per programme type.',
      questionAnswer: 'false',
    },
  ]);

  const trueAnswers = useMemo(() => {
    const answers = questions?.filter(
      (item) => item?.questionAnswer === 'true'
    );
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
        text={`Additional standards`}
        color={'textDark'}
        className={'my-3'}
      />
      <Divider dividerType="dashed" className={'my-4'} />

      {!isCoach ? (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      ) : (
        <Alert
          className="my-4"
          type="info"
          title="Walk around the site and make sure the following standards are in place."
        />
      )}

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
      <div className="mt-2 flex items-center gap-2">
        <div
          className={`text-14 flex h-5 w-12 rounded-full bg-${getGroupColor(
            trueAnswers.length
          )} items-center justify-center font-bold text-white`}
        >
          {`${trueAnswers.length} / ${questions?.length}`}
        </div>
        <Typography type={'body'} text={'score'} color={'textDark'} />
      </div>

      <div className="mt-2 space-y-4">
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
