import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Alert, CheckboxChange, CheckboxGroup, Typography } from '@ecdlink/ui';
import { replaceBraces } from '@ecdlink/core';
import { Header } from '@/pages/infant/infant-profile/components';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';

import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps } from '../../dynamic-form';

export const ReferralsStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const questionForMom = 'Clinic referrals:';

  // TODO: get the info from getReferralsForInfant
  const [questions, setAnswers] = useState([
    {
      question: questionForMom,
      options: [
        '{client} had thoughts and plans to harm herself or commit suicide',
        'Missed clinic visit',
      ],
      answer: [],
    },
    {
      question: 'SASSA referrals',
      options: ['Has not applied for a child support grant'],
      answer: [],
    },
    {
      question: 'Department of Home Affairs referrals',
      options: ['{client} does not have a birth certificate'],
      answer: [],
    },
  ]);

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const visitSection = 'Referrals';

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

      const formattedQuestions = updatedQuestions.map((item) => {
        const { options, ...rest } = item;

        return rest;
      });

      setAnswers(updatedQuestions);

      // TODO: add integration
      // setSectionQuestions?.([
      //   {
      //     visitSection,
      //     questions: formattedQuestions,
      //   },
      // ]);
    },
    [questions]
  );

  const onCheckboxChange = useCallback(
    (event: CheckboxChange, index: number) => {
      const answers = questions[index].answer;
      if (event.checked) {
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        return onOptionSelected(currentAnswers, index);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);

      return onOptionSelected(currentAnswers, index);
    },
    [onOptionSelected, questions]
  );

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        icon="CalendarIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title={visitSection}
      />
      <div className="flex flex-col gap-4 p-4">
        <Alert
          type="warning"
          title="Once you’ve written a referral on paper for the concerns below, tap the box."
          titleColor="textDark"
          list={[
            `If you would like to write your referrals later, you can see this list on ${name} & ${caregiverName}’s profile.`,
          ]}
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
        {questions.map((item, index) => (
          <Fragment key={item.question}>
            <Typography type="h3" text={item.question} color="textDark" />
            {item.options.map((option) => (
              <CheckboxGroup
                id={option}
                key={option}
                title={replaceBraces(
                  option,
                  item.question === questionForMom ? caregiverName : name
                )}
                titleColours="textMid"
                checked={item.answer?.some((answer) => answer === option)}
                value={option}
                onChange={(event) => onCheckboxChange(event, index)}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </>
  );
};
