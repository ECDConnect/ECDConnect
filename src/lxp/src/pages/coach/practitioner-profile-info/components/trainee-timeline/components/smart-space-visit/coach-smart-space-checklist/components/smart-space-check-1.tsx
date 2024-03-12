import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
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
import PositiveBonusEmoticon from '../../../../../../../../../assets/positive-bonus-emoticon.png';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';
import { coachSelectors } from '@/store/coach';
import { authSelectors } from '@/store/auth';
import { SmartSpaceVisitData } from '@/store/trainee/trainee.types';

interface SmartSpaceCheck1Props {
  coachSmartSpaceVisitId: string;
  practitioner: PractitionerDto;
  programmeName: string | undefined | null;
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

export const SmartSpaceCheck1: React.FC<SmartSpaceCheck1Props> = ({
  coachSmartSpaceVisitId,
  practitioner,
  programmeName,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const visitSection = 'SmartSpace check';

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
      visitSection: visitSection,
      question: 'The venue has enough clean, safe water for children to drink.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question:
        'The venue has a safe, clean and hygienic place for children to go to the toilet.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question:
        'There is a tap, a tippy-tap, a water dispenser or similar for handwashing under clean running water with measures that allow for physical distancing as appropriate.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question:
        'Medicines and harmful substances are out of reach of children.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question: 'Children cannot reach matches, lighters or paraffin.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question:
        'Children cannot reach or step on sharp objects or other dangerous objects.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question:
        'Children cannot reach hot cooker plates or pans on the cooker.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question: 'There is no open water (where children could fall and drown).',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question:
        'There are no exposed electrical wires or electric sockets that children can reach.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question: 'There is no smoking or open fires in the venue.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question: 'There are no heights or steps from which children could fall.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question: 'No dangerous animals can approach the venue.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question:
        'If children use an outdoor area, it is clean, with no litter or animal faeces.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question:
        'The venue is in an area that is known as a safe place in the community.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question:
        'There is at minimum a bucket of sand available in case of fires or fire blanket or extinguisher.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question: 'There is a basic first aid kit in case of accidents.',
      questionAnswer: 'false',
    },
    {
      visitSection: visitSection,
      question:
        'There is an emergency plan displayed on the wall (can use one from Starter pack).',
      questionAnswer: 'false',
    },
  ]);

  const trueAnswers = useMemo(() => {
    const answers = questions?.filter(
      (item) => item?.questionAnswer === 'true'
    );
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
        text={`${practitioner?.user?.firstName}'s - SmartSpace check`}
        color={'textDark'}
        className={'my-3'}
      />
      <Typography
        type={'h4'}
        text={programmeName || ''}
        color={'primary'}
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

      {trueAnswers.length === 17 && (
        <div>
          <div className="bg-successMain mt-4 flex flex-row flex-nowrap items-center rounded-lg">
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
                text={`Great! ${practitioner?.user?.firstName}’s venue meets all the basic standards.`}
              />
            </div>
          </div>
        </div>
      )}
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
