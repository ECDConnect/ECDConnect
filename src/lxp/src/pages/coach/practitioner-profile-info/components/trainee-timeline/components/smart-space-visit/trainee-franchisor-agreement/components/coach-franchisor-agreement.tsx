import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { traineeSelectors } from '@/store/trainee';
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

interface CoachTraineeFranchisorAgreement1Props {
  practitioner: PractitionerDto;
  setSectionQuestions: (value?: SectionQuestions[]) => void;
  saveFranchisorAgreementData: () => void;
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
  practitioner,
  setSectionQuestions,
  saveFranchisorAgreementData,
  submitCoachFranchisorAgreement,
}) => {
  const visitData = useSelector(
    traineeSelectors.getCoachFranchisorAgreementData
  );
  const [questions, setAnswers] = useState([
    {
      question: `${practitioner?.user?.firstName} agrees to take the actions described in the box above in order to meet & maintain all SmartSpace standards.`,
      answer: false,
    },
    {
      question: `${practitioner?.user?.firstName} understands that the Club Coach will visit again within 2 weeks to make sure changes have been made and that the Practice Licence may be withdrawn if they have not.`,
      answer: false,
    },
    {
      question: `${practitioner?.user?.firstName} understands that they should not have more than 20 children at their site.`,
      answer: false,
    },
    {
      question: `${practitioner?.user?.firstName} received the SmartStart playkit and SmartStart admin file.`,
      answer: false,
    },
  ]);

  const visitSection = 'Franchisee agreement';

  const trueAnswers = useMemo(() => {
    const answers = questions?.every((item) => item?.answer === true);
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
        text={visitSection}
        color={'textDark'}
        className={'my-3'}
      />
      <Card className="bg-uiBg rounded-2xl p-4">
        <Typography
          type={'h4'}
          weight="bold"
          text={`Next steps for ${practitioner?.user?.firstName}`}
          color={'textDark'}
          className={'my-3'}
        />
        <Typography
          type={'body'}
          text={`Create a list of emergency numbers. Clean outside area.`}
          color={'textMid'}
          className={'my-3'}
        />
      </Card>

      <Typography
        type={'h4'}
        text={
          'Give the phone to Nothando & ask them to confirm each item by tapping the box:'
        }
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
              option.question === item.question && option?.answer === true
          )}
          value={item.question}
          onChange={() => onOptionSelected(!item.answer, index)}
          className="mb-1"
        />
      ))}

      <Alert
        type="warning"
        className="mt-4"
        title={`By tapping the “Next” button below, you are confirming that Nothando checked the boxes above and agrees to all of the steps.`}
      />

      <div className="mt-4 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {
                saveFranchisorAgreementData();
                submitCoachFranchisorAgreement();
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
