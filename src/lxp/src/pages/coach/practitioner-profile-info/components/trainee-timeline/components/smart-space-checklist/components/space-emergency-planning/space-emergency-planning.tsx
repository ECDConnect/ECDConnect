import {
  Button,
  Typography,
  renderIcon,
  BannerWrapper,
  CheckboxGroup,
  Colours,
  Alert,
  Divider,
} from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import * as styles from './space-emergency-planning.styles';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  SmartSpaceChecklisstStepsSteps,
  SmartSpaceChecklistProps,
} from '../../smart-space-checklist.types';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';

export const getGroupColor = (count: number): Colours => {
  if (count === 0) {
    return 'errorMain';
  }

  if (count < 4) {
    return 'alertMain';
  }

  return 'successMain';
};

export const SpaceEmergencyPlanning: React.FC<SmartSpaceChecklistProps> = ({
  handleNextSection,
  setActiveStep,
  visitId,
}) => {
  const visitSection = 'Space & emergency planning';

  const { isOnline } = useOnlineStatus();
  const visitData = useSelector(traineeSelectors.getTraineeVisitData(visitId));

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
  ]);

  const trueAnswers = useMemo(() => {
    const answers = questions?.filter((item) => item.answer);
    return answers;
  }, [questions]);

  const disableSection = true;

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
        title={'SmartSpace Checklist'}
        subTitle={'Step 4 of 4'}
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
          <Divider dividerType="dashed" className={'mt-4'} />

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
                  (option) => option.question === item.question && option.answer
                )}
                value={item.question}
                onChange={() => {}}
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
          </div>
        </div>
        <div className="mt-2 space-y-4 px-4">
          <div>
            <div>
              <Button
                type="filled"
                color="primary"
                className={styles.button}
                onClick={() => handleNextSection()}
              >
                {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
                <Typography
                  type={'help'}
                  text={'Save & continue'}
                  color={'white'}
                />
              </Button>
            </div>
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
