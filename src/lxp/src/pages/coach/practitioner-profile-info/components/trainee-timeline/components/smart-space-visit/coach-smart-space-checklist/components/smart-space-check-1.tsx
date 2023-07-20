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

interface SmartSpaceCheck1Props {
  practitioner: PractitionerDto;
  programmeName: string | undefined | null;
  setSectionQuestions: (value?: SectionQuestions[]) => void;
  handleNextSection: any;
  saveSmartSpaceCheckData: () => void;
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
  practitioner,
  programmeName,
  setSectionQuestions,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const visitData = useSelector(traineeSelectors.getCoachSmartSpaceVisitData);

  const [questions, setAnswers] = useState([
    {
      question: 'The venue has enough clean, safe water for children to drink.',
      answer: false,
    },
    {
      question:
        'The venue has a safe, clean and hygienic place for children to go to the toilet.',
      answer: false,
    },
    {
      question:
        'There is a tap, a tippy-tap, a water dispenser or similar for handwashing under clean running water with measures that allow for physical distancing as appropriate.',
      answer: false,
    },
    {
      question:
        'Medicines and harmful substances are out of reach of children.',
      answer: false,
    },
    {
      question: 'Children cannot reach matches, lighters or paraffin.',
      answer: false,
    },
    {
      question:
        'Children cannot reach or step on sharp objects or other dangerous objects.',
      answer: false,
    },
    {
      question:
        'Children cannot reach hot cooker plates or pans on the cooker.',
      answer: false,
    },
    {
      question: 'There is no open water (where children could fall and drown).',
      answer: false,
    },
    {
      question:
        'There are no exposed electrical wires or electric sockets that children can reach.',
      answer: false,
    },
    {
      question: 'There is no smoking or open fires in the venue.',
      answer: false,
    },
    {
      question: 'There are no heights or steps from which children could fall.',
      answer: false,
    },
    {
      question: 'No dangerous animals can approach the venue.',
      answer: false,
    },
    {
      question:
        'If children use an outdoor area, it is clean, with no litter or animal faeces.',
      answer: false,
    },
    {
      question:
        'The venue is in an area that is known as a safe place in the community.',
      answer: false,
    },
    {
      question:
        'There is at minimum a bucket of sand available in case of fires or fire blanket or extinguisher.',
      answer: false,
    },
    {
      question: 'There is a basic first aid kit in case of accidents.',
      answer: false,
    },
    {
      question:
        'There is an emergency plan displayed on the wall (can use one from Starter pack).',
      answer: false,
    },
  ]);

  const visitSection = 'SmartSpace check';

  const trueAnswers = useMemo(() => {
    const answers = questions?.filter((item) => item?.answer === true);
    return answers;
  }, [questions]);

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question) => {
        if (question.question === currentQuestion.question) {
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
          visitSection,
          questions: updatedQuestions,
        },
      ]);
    },
    [questions, setSectionQuestions]
  );

  useEffect(() => {
    const previousData = questions.map((item) => {
      const visitDataWithoutTypo = visitData as any;
      const previousAnswer = visitDataWithoutTypo
        ?.find((item: any) => {
          const sectionData = item?.visitSection === visitSection;
          return sectionData;
        })
        ?.questions.filter((obj: any) => {
          return obj.question === item.question;
        });

      const previousHasTrueAnswer = previousAnswer?.some(
        (item: any) => item?.answer === 'true' || Boolean(item?.answer) === true
      );

      if (previousAnswer) {
        return {
          ...item,
          answer: previousHasTrueAnswer!,
        };
      }

      return item;
    });
    setSectionQuestions?.([
      {
        visitSection,
        questions: previousData,
      },
    ]);

    setAnswers(previousData);
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

      <Alert
        className="my-4"
        type="info"
        title="Walk around the site and make sure the following standards are in place."
      />

      {questions.map((item, index) => (
        <CheckboxGroup
          id={item.question}
          key={item.question}
          title={''}
          description={item.question}
          checked={questions?.some(
            (option) =>
              option.question === item.question && option?.answer === true
          )}
          value={item.question}
          onChange={() => onOptionSelected(!item.answer, index)}
          className="mb-1"
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
                saveSmartSpaceCheckData();
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
