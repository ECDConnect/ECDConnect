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
import { useCallback, useMemo, useState } from 'react';
import PositiveBonusEmoticon from '../../../../../../../../../assets/positive-bonus-emoticon.png';

interface SmartSpaceCheck1Props {
  practitioner: PractitionerDto;
  programmeName: string | undefined | null;
  setSectionQuestions: (value?: SectionQuestions[]) => void;
  handleNextSection: any;
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

export const SmartSpaceCheck2: React.FC<SmartSpaceCheck1Props> = ({
  practitioner,
  programmeName,
  setSectionQuestions,
  handleNextSection,
}) => {
  const [questions, setAnswers] = useState([
    {
      question:
        'The venue offers children enough space to play freely (about one square metre per child).',
      answer: false,
    },
    {
      question:
        'If children use an outdoor area, it is fenced with a lockable gate.',
      answer: false,
    },
    {
      question: 'There is a list of emergency numbers visible on the wall.',
      answer: false,
    },
    {
      question:
        'The venue has good natural ventilation (windows or doors that can open).',
      answer: false,
    },
    {
      question:
        'The programme does not exceed the maximum child number per programme type.',
      answer: false,
    },
  ]);

  const visitSection = 'Additional standards';

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

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={`Additional standards`}
        color={'textDark'}
        className={'my-3'}
      />
      <Divider dividerType="dashed" className={'my-4'} />

      <Alert
        className="my-4"
        type="info"
        title="These standards are also required. If they are not in place, SmartStarters should be able to show how they are working towards them."
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

      <div className="mt-2 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {
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
