import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { PractitionerDto } from '@ecdlink/core';
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  CheckboxGroup,
  Colours,
  Divider,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { traineeSelectors } from '@/store/trainee';
import { useSelector } from 'react-redux';
import { coachSelectors } from '@/store/coach';
import { authSelectors } from '@/store/auth';

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

  if (count < 14) {
    return 'alertMain';
  }

  return 'successMain';
};

const options = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export const SmartSpaceCheck9: React.FC<SmartSpaceCheck1Props> = ({
  practitioner,
  setSectionQuestions,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const visitData = useSelector(traineeSelectors.getCoachSmartSpaceVisitData);
  const coach = useSelector(coachSelectors.getCoach);
  const user = useSelector(authSelectors.getAuthUser);
  const isCoach = coach?.user?.id === user?.id;
  const [answer, setAnswer] = useState<boolean | undefined>(undefined);
  const [enableButton, setEnableButton] = useState(false);
  const [questions, setAnswers] = useState([
    {
      question: `Is the daily routine displayed and at the right height for children to reach it? Is
        there a marker that can be moved to show where they are?`,
      answer: false,
    },
    {
      question:
        'Is the SmartStarter running the programme according to the daily Routine?',
      answer: false,
    },
    {
      question: `Did the SmartStarter use the message board to give children information
        about the day?`,
      answer: false,
    },
    {
      question: `Is the playkit (or toys) unpacked in a way that children can reach and play
        with the toys and materials?`,
      answer: false,
    },
    {
      question: `Are the different interest areas set up with the area labels (art, pretend,
          building, toys and games, story)?`,
      answer: false,
    },
    {
      question:
        'Does the SmartStarter participate in the child’s play and get on their level?',
      answer: false,
    },
    {
      question:
        'Does the SmartStarter talk to the children in a warm, positive way?',
      answer: false,
    },
    {
      question:
        'Does the SmartStarter give the children choice in what to play with, and how?',
      answer: false,
    },
    {
      question:
        'Did the SmartStarter make sure children were supervised at all times while you were there?',
      answer: false,
    },
    {
      question:
        'Is the learning space interesting, with child pictures and posters displayed?',
      answer: false,
    },
    {
      question: `Did the SmartStarter make children feel loved and comforted them when
        upset?`,
      answer: false,
    },
    {
      question: `Did the SmartStarter chat to the children and encourage conversation
        through questions?`,
      answer: false,
    },
    {
      question:
        'If you saw storytime, did the SmartStarter share a story (book or oral) and encourage children to participate with questions and talking?',
      answer: false,
    },
    {
      question:
        'If you were there at free playtime, did the SmartStarter give children at least 45 minutes to play and choose freely?',
      answer: false,
    },
  ]);

  const visitSection = `Standards checklist`;

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
    if (!isCoach) {
      const previousData = questions.map((item) => {
        const previousAnswer = visitData?.find((item: any) => {
          const sectionData = item?.visitSection === visitSection;
          return sectionData;
        });

        const previousHasTrueAnswer =
          Boolean(previousAnswer?.questionAnswer) === true ||
          previousAnswer?.questionAnswer === 'true';

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
      return;
    }

    const previousData = questions.map((item) => {
      const visitDataWithoutTypo = visitData as any;
      const previousAnswer = visitDataWithoutTypo
        ?.find((item: any) => {
          const sectionData = item?.visitSection === visitSection;
          return sectionData;
        })
        ?.questions?.filter((obj: any) => {
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

  useEffect(() => {
    if (answer !== undefined) {
      return setEnableButton?.(true);
    }
    setEnableButton(false);
  }, [answer]);

  useEffect(() => {
    if (!isCoach) {
      setAnswer(true);
    }
  }, [isCoach]);

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={visitSection}
        color={'textDark'}
        className={'my-3'}
      />
      <div>
        {' '}
        <Typography
          type="h4"
          text={'Is the programme running today?'}
          color="textDark"
          className="mb-2"
        />
        <div className={`${!isCoach && 'pointer-events-none opacity-50'}`}>
          <ButtonGroup<boolean>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={options}
            onOptionSelected={(e) => setAnswer(e as boolean)}
          />
        </div>
      </div>
      {answer && (
        <div>
          {isCoach && (
            <Alert
              type={'info'}
              title={
                'Use the questions below to observe the SmartStart programme. .'
              }
              list={[
                'Remind the SmartStarter of their training.',
                'Help them improve their programme and get ready for the first PQA observation visit!',
              ]}
              className="mt-4"
            />
          )}
          <Divider dividerType="dashed" className={'my-4'} />
          {!isCoach && (
            <Alert
              className="my-4"
              type="warning"
              title="You are viewing this form and cannot fill in responses."
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
                  option.question === item.question && option?.answer === true
              )}
              value={item.question}
              onChange={() => onOptionSelected(!item.answer, index)}
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
                handleNextSection();
                saveSmartSpaceCheckData();
              }}
              disabled={!enableButton && isCoach}
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
