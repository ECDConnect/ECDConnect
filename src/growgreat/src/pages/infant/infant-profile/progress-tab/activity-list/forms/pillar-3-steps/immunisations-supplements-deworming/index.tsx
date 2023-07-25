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
import { differenceInDays, differenceInCalendarMonths } from 'date-fns';
import { replaceBraces } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import { getIsInfantFirstVisitSelector } from '@/store/infant/infant.selectors';

export const ImmunisationsSupplementsDewormingStep = ({
  infant,
  setSectionQuestions: setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'Did the baby have the {age} immunisation?',
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

  const dateOfBirth = infant?.user?.dateOfBirth as string;
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  //const { months: ageMonths } = getAgeInYearsMonthsAndDays(dateOfBirth);
  const ageMonths = differenceInCalendarMonths(
    new Date(),
    new Date(dateOfBirth)
  );
  const ageDays = differenceInDays(new Date(), new Date(dateOfBirth));

  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant]
  );

  const visitSection = 'Immunisations, supplements & deworming';

  const isFirstVisit = useSelector(getIsInfantFirstVisitSelector);

  const is6Week = ageDays >= 49 && ageDays <= 56;
  const is10Week = ageDays >= 57 && ageMonths <= 3;
  const is14Week = ageMonths === 4;
  const is6Month = ageMonths >= 6 && ageMonths < 9;
  const is9Month = ageMonths >= 9 && ageMonths < 12;
  const is12Month = ageMonths >= 12 && ageMonths < 15;
  const is18Month = ageMonths >= 18 && ageMonths < 21;
  const is2Years = ageMonths >= 24 && ageMonths < 30;
  const is2YearsAHalfYears = ageMonths >= 30 && ageMonths < 36;
  const is3Years = ageMonths >= 36 && ageMonths < 42;
  const is3YearsAHalfYears = ageMonths >= 42 && ageMonths < 48;
  const is4Years = ageMonths >= 48 && ageMonths < 54;
  const is4AHalfYears = ageMonths >= 54 && ageMonths < 60;
  const is5Years = ageMonths >= 60;

  const age = is6Week
    ? '6 week'
    : is10Week
    ? '10 week'
    : is14Week
    ? '14 week'
    : is6Month
    ? '6 month'
    : is9Month
    ? '9 month'
    : is12Month
    ? '12 month'
    : is18Month
    ? '18 month'
    : is2Years
    ? '2 year'
    : is2YearsAHalfYears
    ? '2 and a half years'
    : is3Years
    ? '3 year'
    : is3YearsAHalfYears
    ? '3 and a half years'
    : is4Years
    ? '4 year'
    : is4AHalfYears
    ? '4 and a half years'
    : is5Years
    ? '5 year'
    : '';

  const isImmunisationQuestion =
    isFirstVisit &&
    (is6Week ||
      is10Week ||
      is14Week ||
      is6Month ||
      is9Month ||
      is12Month ||
      is18Month);

  const isVitaminAQuestion =
    isFirstVisit &&
    (is6Month ||
      is12Month ||
      is18Month ||
      is2Years ||
      is2YearsAHalfYears ||
      is3Years ||
      is3YearsAHalfYears ||
      is4Years ||
      is4AHalfYears ||
      is5Years);

  const isDewormingQuestion =
    isFirstVisit &&
    (is12Month ||
      is18Month ||
      is2Years ||
      is2YearsAHalfYears ||
      is3Years ||
      is3YearsAHalfYears ||
      is4Years ||
      is4AHalfYears ||
      is5Years);

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

      const undefinedAnswersCount = updatedQuestions.filter(
        (item) => item.answer === undefined
      ).length;

      const questionsCount = [
        isImmunisationQuestion,
        isVitaminAQuestion,
        isDewormingQuestion,
      ].filter((item) => !!item).length;

      if (
        (questionsCount === 1 && undefinedAnswersCount === 2) ||
        (questionsCount === 2 && undefinedAnswersCount === 1) ||
        (questionsCount === 3 && undefinedAnswersCount === 0)
      ) {
        setEnableButton?.(true);
      }
    },
    [
      isDewormingQuestion,
      isImmunisationQuestion,
      isVitaminAQuestion,
      questions,
      setEnableButton,
      setQuestions,
    ]
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
        {questions.map((item, index) => {
          if (index === 0 && !isImmunisationQuestion) return <></>;
          if (index === 1 && !isVitaminAQuestion) return <></>;
          if (index === 2 && !isDewormingQuestion) return <></>;

          return (
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
              {index === 0 && (
                <>
                  <Typography
                    type="body"
                    text={replaceBraces(item.question, age)}
                    color="textDark"
                  />
                </>
              )}
              {index > 0 && (
                <>
                  <Typography
                    type="body"
                    text={item.question}
                    color="textDark"
                  />
                </>
              )}
              <ButtonGroup<boolean>
                color="secondary"
                type={ButtonGroupTypes.Button}
                options={options}
                onOptionSelected={(value) => onOptionSelected(value, index)}
              />
            </Fragment>
          );
        })}
        {questions.every((item) => !!item.answer) && (
          <SuccessCard
            customIcon={<CelebrateIcon className="h-14	w-14" />}
            text={`Well done ${caregiverName}!`}
            subText={`Remind ${caregiverName} to take ${name} to the clinic at 9 months for more immunisations.`}
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
