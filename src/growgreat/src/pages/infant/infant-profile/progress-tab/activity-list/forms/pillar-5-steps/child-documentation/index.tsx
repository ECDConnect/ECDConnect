import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  CheckboxChange,
  CheckboxGroup,
  FormInput,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import P5 from '@/assets/pillar/p5.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { replaceBraces, useDialog } from '@ecdlink/core';
import { activitiesColours } from '../../../activities-list';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { SuccessCard } from '@/components/success-card/success-card';
import { showDialog } from './dialog';
import { getNextDateByDay } from '@ecdlink/core';
import { differenceInDays } from 'date-fns';

enum Question {
  one = 0,
  two = 1,
  three = 2,
  four = 3,
  five = 4,
  six = 5,
  seven = 6,
}

export const birthCertificateQuestion = `Does {client} have a birth certificate?`;
export const childDocumentSection = 'Child documentation';

export const ChildDocumentationStep = ({
  infant,
  setSectionQuestions: setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: birthCertificateQuestion,
      answer: undefined as boolean | undefined,
    },
    {
      question: '{client}’s ID number',
      answer: undefined as string | undefined,
    },
    {
      question: 'Is {client} receiving the CSG?',
      answer: undefined as boolean | undefined,
    },
    {
      question: 'Does {client} qualify for CSG?',
      answer: undefined as boolean | undefined,
    },
    {
      question: 'Has {client} applied for a CSG?',
      answer: undefined as boolean | undefined,
    },
    {
      question: 'Was {client} receiving the CSG before turning 1 years old?',
      answer: undefined as boolean | undefined,
    },
    {
      question: 'Why has {client} not applied for a CSG?',
      answer: [] as string[],
    },
  ]);

  const [
    questionOne,
    questionTwo,
    questionThree,
    questionFour,
    questionFive,
    questionSix,
    questionSeven,
  ] = questions;

  const questionSevenAnswers = questionSeven.answer as string[];

  const dialog = useDialog();

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const dateOfBirth = infant?.user?.dateOfBirth as string;
  const ageDays = differenceInDays(new Date(), new Date(dateOfBirth));
  const daysAfterBirth = getNextDateByDay(
    30,
    infant?.user?.dateOfBirth as Date
  );
  const isChildBefore30Days = useMemo(() => ageDays <= 30, [ageDays]);
  const isChildBefore1Year = useMemo(() => ageDays <= 365, [ageDays]);

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const checkboxOptions = [
    { name: 'Didn’t know that they qualify.' },
    { name: 'Don’t know where SASSA offices are' },
    { name: 'SASSA offices are far from home' },
    { name: 'Other' },
  ];

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      let updatedQuestions = questions.map((question) => {
        if (question.question === currentQuestion.question) {
          return {
            ...question,
            answer: value,
          };
        }
        return question;
      });

      if (index === Question.three) {
        [Question.four, Question.five, Question.six].map((value) => {
          return (updatedQuestions[value] = {
            question: questions[value].question,
            answer: undefined,
          });
        });
      }

      if (index === Question.four) {
        [Question.five, Question.six, Question.seven].map((value) => {
          return (updatedQuestions[value] = {
            question: questions[value].question,
            answer: undefined,
          });
        });
      }

      const filteredQuestions = updatedQuestions.filter(
        (item) => item.answer !== undefined
      );

      setAnswers(updatedQuestions);
      setQuestions?.([
        {
          visitSection: childDocumentSection,
          questions: filteredQuestions,
        },
      ]);
    },
    [questions, setQuestions]
  );

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      const answers = questionSeven.answer as string[];
      if (event.checked) {
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        return onOptionSelected(currentAnswers, 6);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);

      return onOptionSelected(currentAnswers, 6);
    },
    [onOptionSelected, questionSeven]
  );

  const handleEnableButton = useCallback(() => {
    let isCompleted = false;

    const isBaseQuestionsCompleted = questions.every((item, index) => {
      if (index > 2) return true;

      return item.answer !== undefined && item.answer !== '';
    });

    if (!!questionThree.answer) {
      if (questionThree.answer === true && isChildBefore1Year)
        isCompleted = true;
      else if (questionSix.answer !== undefined) {
        isCompleted = true;
      }
    }

    if (questionThree.answer === false && questionFour.answer !== undefined) {
      isCompleted = questionFour.answer === false;

      if (
        !!questionFive.answer ||
        (questionFive.answer === false && !!questionSevenAnswers?.length)
      ) {
        isCompleted = true;
      }
    }

    const isAllCompleted =
      questionOne.answer === false || (isCompleted && isBaseQuestionsCompleted);

    setEnableButton?.(isAllCompleted);
  }, [
    questionFive.answer,
    questionFour.answer,
    questionOne.answer,
    questionSevenAnswers?.length,
    questionSix.answer,
    questionThree.answer,
    questions,
    setEnableButton,
    isChildBefore1Year,
  ]);

  useEffect(() => {
    handleEnableButton();
  }, [handleEnableButton]);

  return (
    <>
      <Header
        customIcon={P5}
        title={childDocumentSection}
        iconHexBackgroundColor={activitiesColours.pillar5.primaryColor}
        hexBackgroundColor={activitiesColours.pillar5.secondaryColor}
      />
      <div className="flex flex-col p-4">
        <Typography
          type="h3"
          text="Birth certificate"
          color="textDark"
          className="mb-4"
        />
        <Typography
          type="body"
          text={replaceBraces(questionOne.question, name)}
          color="textDark"
        />
        <ButtonGroup<boolean>
          color="secondary"
          type={ButtonGroupTypes.Button}
          options={options}
          onOptionSelected={(value) => onOptionSelected(value, Question.one)}
        />
        {!!questionOne.answer && (
          <>
            <FormInput
              label={replaceBraces(questionTwo.question, name)}
              subLabel="The ID number is needed to complete the profile."
              placeholder="e.g 851201123456"
              type="number"
              className="mt-4"
              value={questionTwo.answer as string}
              onChange={(event) =>
                onOptionSelected(event.target.value, Question.two)
              }
            ></FormInput>
            <Typography
              type="h3"
              text="Child support grant (CSG)"
              color="textDark"
              className="mt-4"
            />
            {questions.map((item, index) => {
              if (
                index < Question.three ||
                index >= Question.six ||
                (index > Question.three && questionThree.answer !== false) ||
                (index === Question.five && questionFour.answer !== true)
              )
                return null;

              return (
                <Fragment key={item.question}>
                  <div className="mt-4 flex items-center gap-2">
                    <Typography
                      type="body"
                      text={replaceBraces(
                        item.question,
                        index === Question.five ? caregiverName : name
                      )}
                      color="textDark"
                    />
                    {index === Question.four && (
                      <button onClick={showDialog(dialog)}>
                        {renderIcon(
                          'QuestionMarkCircleIcon',
                          'w-5 h-5 text-infoMain'
                        )}
                      </button>
                    )}
                  </div>
                  <ButtonGroup<boolean>
                    color="secondary"
                    type={ButtonGroupTypes.Button}
                    options={options}
                    onOptionSelected={(value) => onOptionSelected(value, index)}
                  />
                </Fragment>
              );
            })}
          </>
        )}
        {!!questionThree.answer && !isChildBefore1Year && (
          <>
            <Typography
              className="mt-4"
              type="body"
              text={replaceBraces(questionSix.question, name)}
              color="textDark"
            />
            <ButtonGroup<boolean>
              color="secondary"
              type={ButtonGroupTypes.Button}
              options={options}
              onOptionSelected={(value) =>
                onOptionSelected(value, Question.six)
              }
            />
          </>
        )}
        {questionFive.answer === false && (
          <div className="flex flex-col gap-2">
            <Typography
              className="mt-4"
              type="body"
              text={replaceBraces(questionSeven.question, caregiverName)}
              color="textDark"
            />
            {checkboxOptions.map((item) => (
              <CheckboxGroup
                checkboxColor="primary"
                id={item.name}
                key={item.name}
                title={item.name}
                titleColours="textMid"
                checked={questionSevenAnswers?.some(
                  (option) => option === item.name
                )}
                value={item.name}
                onChange={onCheckboxChange}
              />
            ))}
            {questionSevenAnswers?.includes('Other') && (
              <FormInput
                label={replaceBraces(questionTwo.question, name)}
                subLabel="Provide more information"
                placeholder="Add details"
                type="text"
                textInputType="textarea"
                className="mt-4"
                value={
                  questionSevenAnswers
                    .find((item) => item.includes('Other:'))
                    ?.split(':')[1]
                }
                onChange={(event) =>
                  onOptionSelected(
                    [
                      ...questionSevenAnswers.filter(
                        (item) => !item.includes('Other:')
                      ),
                      `Other: ${event.target.value}`,
                    ],
                    Question.seven
                  )
                }
              ></FormInput>
            )}
            <Alert
              className="mt-2"
              type="error"
              title={`Oh no! Refer ${caregiverName} to SASSA`}
              list={[
                `If ${caregiverName} is unsure where SASSA, explain how to get there, what documents to take and the process of applying. `,
              ]}
            />
          </div>
        )}
        {questionOne.answer === false && !isChildBefore30Days && (
          <Alert
            className="mt-8"
            type="warning"
            title="Oh dear! Encourage the family to get the Birth Certificate from the Department of Home Affairs."
            list={[
              'Note that the the hospital can only provide a Birth Certificate within 30 days of the baby’s birth.',
            ]}
          />
        )}
        {questionOne.answer === false && isChildBefore30Days && (
          <Alert
            className="mt-8"
            type="warning"
            title={`Encourage the family to get the Birth Certificate from the clinic/hospital where the baby was born before ${daysAfterBirth.toLocaleDateString(
              'en-ZA',
              {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }
            )}.`}
            list={[
              'Note that the hospital can only provide a Birth Certificate within 30 days of the baby’s birth.',
            ]}
          />
        )}
        {(!!questionSix.answer ||
          (questionThree.answer === true && isChildBefore1Year)) && (
          <SuccessCard
            className="my-4"
            customIcon={<CelebrateIcon className="h-14	w-14" />}
            text={`Great!`}
            textColour="successDark"
            color="successBg"
          />
        )}
      </div>
    </>
  );
};
