import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { traineeSelectors } from '@/store/trainee';
import { PractitionerDto } from '@ecdlink/core';
import {
  Button,
  Card,
  Colours,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

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

export const SmartSpaceCheck4: React.FC<SmartSpaceCheck1Props> = ({
  practitioner,
  programmeName,
  setSectionQuestions,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const visitData = useSelector(traineeSelectors.getCoachSmartSpaceVisitData);
  const [enableButton, setEnableButton] = useState(false);
  const [questions, setAnswers] = useState([
    {
      question: 'How many assistants will attend every session?',
      answer: '',
    },
  ]);

  const visitSection = `Programme details`;

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

      if (updatedQuestions.every((item) => item.answer !== '')) {
        return setEnableButton?.(true);
      }
      setEnableButton(false);
    },
    [questions, setSectionQuestions, visitSection]
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

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={visitSection}
        color={'textDark'}
        className={'my-3'}
      />
      <Typography
        type={'h3'}
        text={`Programme type:`}
        color={'textDark'}
        className={'my-3'}
      />
      <Divider dividerType="dashed" className={'my-4'} />

      {questions.map((item, index) => (
        <FormInput
          className="mt-4"
          label={item?.question}
          placeholder={'e.g. 2'}
          type="number"
          value={item.answer}
          subLabel="Any programme with more than 10 children must have an assistant."
          onChange={(e) => onOptionSelected(e.target.value, index)}
          onKeyDown={(e) => e.code !== '69'}
        />
      ))}

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
              disabled={!enableButton && questions[0]?.answer === ''}
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
