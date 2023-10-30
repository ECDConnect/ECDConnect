import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { staticDataSelectors } from '@/store/static-data';
import { traineeSelectors } from '@/store/trainee';
import { PractitionerDto } from '@ecdlink/core';
import {
  Alert,
  Button,
  Colours,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { QuestionAnswersProps } from './smart-space-check-3';
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

  if (count < 17) {
    return 'alertMain';
  }

  return 'successMain';
};

export const SmartSpaceCheck5: React.FC<SmartSpaceCheck1Props> = ({
  practitioner,
  programmeName,
  setSectionQuestions,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const numberOfAssistants = useSelector(
    traineeSelectors.getCoachVisitDataAssitantsNumber
  );
  const coach = useSelector(coachSelectors.getCoach);
  const user = useSelector(authSelectors.getAuthUser);
  const isCoach = coach?.user?.id === user?.id;
  const [enableButton, setEnableButton] = useState(false);
  const programData = useSelector(staticDataSelectors.getProgrammeTypes);
  const traineeProgrammeType = useSelector(
    traineeSelectors.getTraineeProgrammeType
  );
  const traineeProgrammeTypeObject = programData?.find(
    (item) => item?.id === traineeProgrammeType
  );
  const visitData = useSelector(traineeSelectors.getCoachSmartSpaceVisitData);

  const renderAlert = useMemo(() => {
    if (traineeProgrammeTypeObject?.description === 'Day Mother') {
      return (
        <Alert
          type="info"
          title="Check the capacity above before tapping Next. How is programme capacity calculated?"
          list={[
            'Day mothers can have a maximum of 6 children at a time.',
            'Every child must have at least 1 square metre of free space each to play in.',
            'There should be 10 children to every 1 adult in the programme.',
          ]}
        />
      );
    }

    if (traineeProgrammeTypeObject?.description === 'Playgroup') {
      return (
        <Alert
          type="info"
          title="Check the capacity above before tapping Next. How is programme capacity calculated?"
          list={[
            'Playgroups can have a maximum of 12 children at a time.',
            'Every child must have at least 1 square metre of free space each to play in.',
            'There should be 10 children to every 1 adult in the programme.',
          ]}
        />
      );
    }

    if (traineeProgrammeTypeObject?.description === 'Preschool') {
      return (
        <Alert
          type="info"
          title="Check the capacity above before tapping Next. How is programme capacity calculated?"
          list={[
            'Preschools can have a maximum of 20 children at a time.',
            'Every child must have at least 1 square metre of free space each to play in.',
            'There should be 10 children to every 1 adult in the programme.',
          ]}
        />
      );
    }
    return null;
  }, [traineeProgrammeTypeObject?.description]);

  const [questions, setAnswers] = useState([
    {
      question: 'How many cm is the short side of the room?',
      answer: '',
    },
    {
      question: 'How many cm is the long side of the room?',
      answer: '',
    },
    {
      question: 'Capacity',
      answer: '',
    },
  ]);

  const visitSection = `Calculate programme capacity`;
  const twoMeasuresFilled = useMemo(
    () => questions[0].answer !== '' && questions[1].answer !== '',
    [questions]
  );

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

        if (previousAnswer) {
          return {
            ...item,
            answer: previousAnswer?.questionAnswer!,
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

      setAnswers(previousData as QuestionAnswersProps[]);
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

      const previousHasTrueAnswer = previousAnswer?.find(
        (item: any) =>
          item?.answer !== '' || Boolean(item?.answer) !== undefined
      );

      if (previousAnswer) {
        return {
          ...item,
          answer: previousHasTrueAnswer?.answer,
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
    if (questions.every((item) => item.answer !== '')) {
      return setEnableButton?.(true);
    }
    setEnableButton(false);
  }, [questions]);

  const maximumCapacity = useMemo(() => {
    if (traineeProgrammeTypeObject?.description === 'Preschool') {
      if (
        (Number(questions[1].answer) * Number(questions[0].answer)) / 10000 <
        20
      ) {
        return String(
          Math.floor(
            (Number(questions[1].answer) * Number(questions[0].answer)) / 10000
          )
        );
      }
      if (Number(numberOfAssistants) === 0) {
        return '10';
      }
      return '20';
    }

    if (traineeProgrammeTypeObject?.description === 'Day Mother') {
      if (
        (Number(questions[1].answer) * Number(questions[0].answer)) / 10000 <
        6
      ) {
        return String(
          Math.floor(
            (Number(questions[1].answer) * Number(questions[0].answer)) / 10000
          )
        );
      }
      return '6';
    }

    if (traineeProgrammeTypeObject?.description === 'Playgroup') {
      if (
        (Number(questions[1].answer) * Number(questions[0].answer)) / 10000 <
        12
      ) {
        return String(
          Math.floor(
            (Number(questions[1].answer) * Number(questions[0].answer)) / 10000
          )
        );
      }
      if (Number(numberOfAssistants) === 0) {
        return '10';
      }
      return '12';
    }
  }, [numberOfAssistants, questions, traineeProgrammeTypeObject?.description]);

  useEffect(() => {
    if (maximumCapacity) {
      onOptionSelected(maximumCapacity, 2);
    }
  }, [maximumCapacity]);

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={visitSection}
        color={'textDark'}
        className={'my-3'}
      />
      <Typography
        type={'h4'}
        text={`Measure the room in centimetres:`}
        color={'textDark'}
        className={'my-3'}
      />

      <Typography
        type={'body'}
        text={`Help the SmartStarter clear the space so that it is laid out as it will be when the programme is running. Now use your measuring tape to measure it.`}
        color={'textMid'}
        className={'my-3'}
      />
      {questions.map((item, index) => {
        if (item?.question !== 'Capacity') {
          return (
            <FormInput
              className="mt-4"
              label={item?.question}
              placeholder={'e.g. 410'}
              value={item.answer}
              onChange={(e) => onOptionSelected(e.target.value, index)}
              {...(!!item.answer &&
                Number(item.answer) < 50 && {
                  error: {
                    type: 'max',
                    message: 'Please enter a number that is more 49.',
                  },
                })}
              disabled={!isCoach}
            />
          );
        } else return null;
      })}

      {twoMeasuresFilled && (
        <div className="mt-2 flex flex-col gap-2">
          <Divider dividerType="dashed" className="my-2" />
          <div className="flex items-center gap-1">
            <Typography
              type={'body'}
              text={`Total metres squared available:`}
              color={'textDark'}
            />
            <Typography
              type={'body'}
              text={`${
                (Number(questions[1].answer) * Number(questions[0].answer)) /
                10000
              }`}
              color={'primary'}
            />
          </div>
          <div className="flex items-center gap-1">
            <Typography type={'body'} text={`Assistants:`} color={'textDark'} />
            <Typography
              type={'body'}
              text={`${Number(numberOfAssistants)}`}
              color={'primary'}
            />
          </div>
          <div className="flex items-center gap-1">
            <Typography type={'body'} text={`Capacity:`} color={'textDark'} />
            <Typography
              type={'body'}
              text={maximumCapacity}
              color={'primary'}
            />
          </div>
          <Divider dividerType="dashed" className="my-2" />
          <div>{renderAlert}</div>
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
