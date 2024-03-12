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
import * as styles from './health-strutcture-area.styles';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  SmartSpaceChecklistProps,
  SmartSpaceChecklistStepsSteps,
} from '../../smart-space-checklist.types';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';

export const getGroupColor = (count: number): Colours => {
  if (count === 0) {
    return 'errorMain';
  }

  if (count < 10) {
    return 'alertMain';
  }

  return 'successMain';
};

export const HealthStructureArea: React.FC<SmartSpaceChecklistProps> = ({
  setSectionQuestions,
  setVisitSection,
  onSubmit,
  setActiveStep,
  onSubmitAndContinue,
  checklistVisitId,
}) => {
  const { isOnline } = useOnlineStatus();
  const visitData = useSelector(
    traineeSelectors.getTraineeVisitData(checklistVisitId)
  );

  const [questions, setAnswers] = useState([
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

  const trueAnswers = useMemo(() => {
    const answers = questions?.filter((item) => item?.answer === true);
    return answers;
  }, [questions]);

  const visitSection = 'Safety - structure, space & area';

  const completedItems = visitData
    ?.filter((item) => item?.visitSection === visitSection)
    .filter(
      (item) =>
        item?.questionAnswer === 'true' ||
        (item?.questionAnswer !== ' ' && item?.questionAnswer !== 'false')
    );

  const disableSection = completedItems?.length === 10;

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

  return (
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={visitSection}
        subTitle={'Step 3 of 4'}
        color={'primary'}
        onBack={() => setActiveStep(SmartSpaceChecklistStepsSteps.INITIAL)}
        displayOffline={!isOnline}
        className="pb-16"
      >
        <div className="p-4">
          <Typography
            type={'h2'}
            text={'Safety - structure, space & area'}
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
                      setVisitSection(visitSection);
                      onSubmitAndContinue();
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
