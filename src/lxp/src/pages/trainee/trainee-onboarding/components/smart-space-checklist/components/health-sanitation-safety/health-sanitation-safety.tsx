import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Typography,
  renderIcon,
  BannerWrapper,
  CheckboxGroup,
  Colours,
  Divider,
  Alert,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import * as styles from './health-sanitation-safety.styles';
import { HealthSanitationSafetysProps } from './health-sanitation-safety.types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  ProgrammeDetailsModel,
  ProgrammeDetailsSchema,
} from '@/schemas/trainee/programme-details';
import { SmartSpaceChecklisstStepsSteps } from '../../smart-space-checklist.types';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';

export const getGroupColor = (count: number): Colours => {
  if (count === 0) {
    return 'errorMain';
  }

  if (count < 7) {
    return 'alertMain';
  }

  return 'successMain';
};

export const HealthSanitationSafety: React.FC<HealthSanitationSafetysProps> = ({
  setSectionQuestions,
  setShowProgrammeDetails,
  setVisitSection,
  onSubmit,
  setActiveStep,
  onSubmitAndContinue,
}) => {
  useForm<ProgrammeDetailsModel>({
    resolver: yupResolver(ProgrammeDetailsSchema),
    shouldUnregister: true,
    mode: 'onChange',
  });

  const { isOnline } = useOnlineStatus();
  const visitData = useSelector(traineeSelectors.getTraineeVisitData);

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
  ]);

  const trueAnswers = useMemo(() => {
    const answers = questions?.filter((item) => item?.answer === true);
    return answers;
  }, [questions]);

  const visitSection = 'Health, sanitation & safety';

  const completedItems = visitData
    ?.filter((item) => item?.visitSection === visitSection)
    .filter(
      (item) =>
        item?.questionAnswer === 'true' ||
        (item?.questionAnswer !== ' ' && item?.questionAnswer !== 'false')
    );

  const disableSection = completedItems?.length === 7;

  useEffect(() => {
    const previousData = questions.map((item) => {
      const previousAnswer = visitData
        ?.filter((item) => item?.visitSection === visitSection)
        .filter((obj) => obj.question === item.question);

      const previousHasTrueAnswer = previousAnswer?.some(
        (item) => item?.questionAnswer === 'true'
      );

      if (previousAnswer) {
        return {
          ...item,
          answer: previousHasTrueAnswer!,
        };
      }
      return item;
    });

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
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={'SmartSpace Checklist'}
        subTitle={'Step 2 of 4'}
        color={'primary'}
        onBack={() => setActiveStep(SmartSpaceChecklisstStepsSteps.INITIAL)}
        displayOffline={!isOnline}
        renderOverflow={true}
      >
        <div className="p-4">
          <Typography
            type={'h2'}
            text={visitSection}
            color={'textDark'}
            className={'my-3'}
          />

          <Divider dividerType="dashed" className={'my-4'} />

          {disableSection && (
            <Alert
              className="my-4"
              type="warning"
              title="You are viewing this form and cannot edit responses."
              list={['This form should be filled in by the trainee.']}
            />
          )}
          <div
            className={`${
              disableSection ? 'pointer-events-none opacity-50' : ''
            }`}
          >
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
              <Typography type={'body'} text={'checked'} color={'textDark'} />
            </div>

            <div className="mt-2 space-y-4">
              <div>
                <div>
                  <Button
                    type="filled"
                    color="primary"
                    className={styles.button}
                    onClick={() => {
                      onSubmitAndContinue();
                      setVisitSection(visitSection);
                    }}
                  >
                    {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
                    <Typography
                      type={'help'}
                      text={'Save & continue'}
                      color={'white'}
                    />
                  </Button>
                </div>
                <div>
                  <Button
                    type="outlined"
                    color="primary"
                    className={styles.button}
                    onClick={() => {
                      setVisitSection(visitSection);
                      onSubmit();
                    }}
                  >
                    {renderIcon('SaveIcon', styles.icon)}
                    <Typography
                      type={'help'}
                      text={'Save & exit'}
                      color={'primary'}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
