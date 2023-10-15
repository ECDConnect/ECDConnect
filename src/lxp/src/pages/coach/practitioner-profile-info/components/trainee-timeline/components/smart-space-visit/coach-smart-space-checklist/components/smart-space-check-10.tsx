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
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';
import PositiveBonusEmoticon from '../../../../../../../../../assets/positive-bonus-emoticon.png';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';

interface SmartSpaceCheck1Props {
  practitioner: PractitionerDto;
  programmeName: string | undefined | null;
  setSectionQuestions: (value?: SectionQuestions[]) => void;
  handleNextSection: any;
  saveSmartSpaceCheckData: () => void;
  onSubmit: () => void;
  setNotificationStep: any;
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
  practitioner,
  programmeName,
  setSectionQuestions,
  handleNextSection,
  saveSmartSpaceCheckData,
  onSubmit,
  setNotificationStep,
}) => {
  const history = useHistory();
  const isTrainee = practitioner?.isTrainee;
  const visitData = useSelector(traineeSelectors.getCoachSmartSpaceVisitData);
  const [questions, setAnswers] = useState([
    {
      question: 'I have issued a SmartSpace Certificate for this SmartStarter',
      answer: false,
    },
  ]);

  const visitSection = 'SmartSpace licence awarded';

  const trueAnswers = useMemo(() => {
    const answers = questions?.every((item) => item?.answer === true);
    return answers;
  }, [questions]);

  useEffect(() => {
    if (isTrainee) {
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
      {isTrainee && (
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
              option.question === item.question && option?.answer === true
          )}
          value={item.question}
          onChange={() => onOptionSelected(!item.answer, index)}
          className="mb-1"
          disabled={isTrainee}
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
              onClick={
                isTrainee
                  ? setNotificationStep('')
                  : () => {
                      handleNextSection();
                      saveSmartSpaceCheckData();
                      onSubmit();
                      history.push(ROUTES.COACH_FRANCHISE_AGREEMENT, {
                        practitioner: practitioner,
                      });
                    }
              }
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
