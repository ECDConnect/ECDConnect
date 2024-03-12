import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { staticDataSelectors } from '@/store/static-data';
import { traineeSelectors } from '@/store/trainee';
import {
  Button,
  Colours,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { coachSelectors } from '@/store/coach';
import { authSelectors } from '@/store/auth';
import { SmartSpaceVisitData } from '@/store/trainee/trainee.types';

interface SmartSpaceCheck1Props {
  coachSmartSpaceVisitId: string;
  traineeChecklistVisitId: string;
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

export const SmartSpaceCheck4: React.FC<SmartSpaceCheck1Props> = ({
  coachSmartSpaceVisitId,
  traineeChecklistVisitId,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const visitSection = `Programme details`;
  const visitData = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionAnswers(
      coachSmartSpaceVisitId,
      visitSection
    )
  );
  const coach = useSelector(coachSelectors.getCoach);
  const user = useSelector(authSelectors.getAuthUser);
  const isCoach = coach?.user?.id === user?.id;
  const programData = useSelector(staticDataSelectors.getProgrammeTypes);
  const traineeProgrammeType = useSelector(
    traineeSelectors.getTraineeProgrammeType(traineeChecklistVisitId)
  );
  const traineeProgrammeTypeObject = programData?.find(
    (item) => item?.id === traineeProgrammeType
  );
  const [enableButton, setEnableButton] = useState(false);
  const [questions, setAnswers] = useState<SmartSpaceVisitData[]>([
    {
      visitSection,
      question: 'How many assistants will attend every session?',
      questionAnswer: '',
    },
  ]);

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

      if (updatedQuestions.every((item) => item.questionAnswer !== '')) {
        return setEnableButton(true);
      }
      setEnableButton(false);
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
      <Typography
        type={'h3'}
        text={`Programme type: ${traineeProgrammeTypeObject?.description}`}
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
          value={item.questionAnswer}
          subLabel="Any programme with more than 10 children must have an assistant."
          onChange={(e) => onOptionSelected(e.target.value, index)}
          onKeyDown={(e) => e.code !== '69'}
          disabled={!isCoach}
          key={index}
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
                saveSmartSpaceCheckData(questions, visitSection);
                handleNextSection();
              }}
              disabled={
                !enableButton && questions[0].questionAnswer === '' && isCoach
              }
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
