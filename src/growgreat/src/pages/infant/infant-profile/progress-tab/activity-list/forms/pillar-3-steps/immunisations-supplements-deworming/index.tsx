import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import P3 from '@/assets/pillar/p3.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { activitiesColours } from '../../../activities-list';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';

export const ImmunisationsSupplementsDewormingStep = ({
  infant,
  setSectionQuestions: setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'Did the baby have the 6 month immunisation?',
      answer: undefined,
    },
    {
      question: 'Is Vitamin A up to date?',
      answer: undefined,
    },
    {
      question: 'Is deworming up to date?',
      answer: undefined,
    },
  ]);

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant]
  );

  const visitSection = 'Immunisations, supplements & deworming';

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
      setQuestions?.([
        {
          visitSection,
          questions: updatedQuestions,
        },
      ]);

      const isCompleted = updatedQuestions.every((item) => !!item.answer);

      if (isCompleted) {
        setEnableButton?.(true);
      }
    },
    [questions, setEnableButton, setQuestions]
  );

  return (
    <>
      <Header
        customIcon={P3}
        title={visitSection}
        iconHexBackgroundColor={activitiesColours.pillar3.primaryColor}
        hexBackgroundColor={activitiesColours.pillar3.secondaryColor}
      />
      <div className="flex flex-col gap-4 p-4">
        <Typography
          type="h3"
          text="Check page 27 of the Road to Health Book."
          color="textDark"
        />
        <Alert
          type="info"
          title={`If ${caregiverName} has the old Road to Health Booklet, check page 5.`}
        />
        {questions.map((item, index) => (
          <Fragment key={item.question}>
            {index === 1 && (
              <>
                <Divider dividerType="dashed" />
                <Typography
                  type="h3"
                  text="Check page 28 of the Road to Health Booklet."
                  color="textDark"
                />
                <Alert
                  type="info"
                  title="Or page 9 of the old Road to Health Booklet."
                />
              </>
            )}
            <Typography type="body" text={item.question} color="textDark" />
            <ButtonGroup<boolean>
              color="secondary"
              type={ButtonGroupTypes.Button}
              options={options}
              onOptionSelected={(value) => onOptionSelected(value, index)}
            />
          </Fragment>
        ))}
        {questions.every((item) => !!item.answer) && (
          <SuccessCard
            customIcon={<CelebrateIcon className="h-14	w-14" />}
            text={`Well done ${caregiverName}!`}
            subText={`Remind Lethabo to take Themba to the clinic at 9 months for more immunisations.`}
            textColour="successDark"
            subTextColours="textDark"
            color="successBg"
          />
        )}
        {questions.some((item) => item.answer === false) && (
          <Alert
            type="error"
            title={`Oh dear! Refer ${name} to the clinic`}
            customIcon={
              <div className="rounded-full">
                {renderIcon(
                  'ExclamationCircleIcon',
                  'text-errorMain w-10 h-10'
                )}
              </div>
            }
          />
        )}
      </div>
    </>
  );
};
