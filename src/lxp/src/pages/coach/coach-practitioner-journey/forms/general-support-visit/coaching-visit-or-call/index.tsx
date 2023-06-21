import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { replaceBraces } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import {
  getCurrentPQaRatingByUserId,
  getLastCoachAttendedVisitByUserId,
  getPractitionerTimelineByIdSelector,
  getVisitDataForVisitIdSelectorByUserId,
} from '@/store/pqa/pqa.selectors';
import { useParams } from 'react-router';
import {
  PractitionerJourneyParams,
  visitTypes,
} from '../../../coach-practitioner-journey.types';
import { Maybe } from 'graphql/jsutils/Maybe';
import { currentActivityKey, visitIdKey } from '../..';
import {
  followUpDeadline,
  getRatingData,
} from '../../../timeline/pqa-site-visits-step';
import { addDays } from 'date-fns';

export const visitOrCallQuestion =
  'Did you visit the practitioner’s site, or did you have a support phone call?';
export const callAnswer = 'Call';

export const CoachingAndVisitOrCallStep = ({
  isView,
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState<
    {
      question: string;
      answer: Maybe<string> | string | undefined;
    }[]
  >([
    {
      question: visitOrCallQuestion,
      answer: '',
    },
    {
      question: 'The focus of this coaching visit was:',
      answer: '',
    },
    {
      question: 'I observed the following parts of the programme:',
      answer: '',
    },
    {
      question:
        'Discussion notes: which issues and areas of practice did you discuss with {client}?',
      answer: '',
    },
    {
      question: 'What next steps did you agree on?',
      answer: '',
    },
    {
      question: 'Is {client} ready for a follow-up PQA observation visit?',
      answer: '',
    },
  ]);

  const visitTypeOptions = [
    { text: 'Visit', value: 'Visit', disabled: isView },
    { text: 'Call', value: callAnswer, disabled: isView },
  ];

  const options = [
    { text: 'Yes', value: 'true', disabled: isView },
    { text: 'No', value: 'false', disabled: isView },
  ];

  const dateLongMonthOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  const followUpQuestionIndex = 5;
  const isFollowUp = activityName === visitTypes.pqa.followUp.name;

  const firstName = smartStarter?.user?.firstName || 'the smartStarter';
  const visitSection = 'Coaching visit or call';

  const { practitionerId } = useParams<PractitionerJourneyParams>();
  const lastAttendedVisit = useSelector(
    getLastCoachAttendedVisitByUserId(practitionerId)
  );
  const currentPqaRating = useSelector(
    getCurrentPQaRatingByUserId(practitionerId)
  );
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );
  const pqaRating3 = timeline?.pQARating3;

  // INFO: The user can start the follow-up after 14 days, but if it's the last visit (third one), this number changes to 60 days
  const currentFollowUpDeadline = pqaRating3?.overallRating
    ? followUpDeadline.lastVisit
    : followUpDeadline.default;
  const isPQAFollowUpDeadline =
    addDays(
      new Date(lastAttendedVisit?.insertedDate),
      currentFollowUpDeadline
    ) <= new Date();
  const isToShowFollowUpQuestion =
    !pqaRating3?.overallRating &&
    currentPqaRating.rating?.overallRatingColor !== 'Error';
  console.log({ isPQAFollowUpDeadline });
  const visitId = window.sessionStorage.getItem(visitIdKey);

  const previousVisitAnswers = useSelector(
    getVisitDataForVisitIdSelectorByUserId(practitionerId, visitId || '')
  );
  const previousSectionAnswers = previousVisitAnswers?.filter(
    (item) => item.visitSection === visitSection
  );
  const previousDate = previousSectionAnswers?.[0].insertedDate;

  const question1 = previousSectionAnswers?.find(
    (item) => item.question === questions[0].question
  );
  const question2 = previousSectionAnswers?.find(
    (item) => item.question === questions[1].question
  );
  const question3 = previousSectionAnswers?.find(
    (item) => item.question === questions[2].question
  );
  const question4 = previousSectionAnswers?.find(
    (item) => item.question === questions[3].question
  );
  const question5 = previousSectionAnswers?.find(
    (item) => item.question === questions[4].question
  );

  const setPreviousAnswers = useCallback(() => {
    setAnswers((prevState) =>
      prevState.map((item, index) => {
        switch (index) {
          case 0:
            return {
              ...item,
              answer: question1?.questionAnswer,
            };
          case 1:
            return {
              ...item,
              answer: question2?.questionAnswer,
            };
          case 2:
            return {
              ...item,
              answer: question3?.questionAnswer,
            };
          case 3:
            return {
              ...item,
              answer: question4?.questionAnswer,
            };
          default:
            return {
              ...item,
              answer: question5?.questionAnswer,
            };
        }
      })
    );
  }, [
    question1?.questionAnswer,
    question2?.questionAnswer,
    question3?.questionAnswer,
    question4?.questionAnswer,
    question5?.questionAnswer,
  ]);

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question, currentIndex) => {
        if (index === 1 && currentIndex === 2) {
          return {
            ...question,
            answer: '',
          };
        }

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

      const questionList = isToShowFollowUpQuestion
        ? updatedQuestions
        : updatedQuestions.slice(0, 5);
      const isAllCompleted =
        questionList.every((item) => !!item.answer) && isPQAFollowUpDeadline;

      if (isAllCompleted) {
        return setEnableButton?.(true);
      }

      setEnableButton?.(false);
    },
    [
      isPQAFollowUpDeadline,
      isToShowFollowUpQuestion,
      questions,
      setEnableButton,
      setSectionQuestions,
    ]
  );

  useEffect(() => {
    if (isView) {
      setEnableButton?.(true);
    }
  }, [isView, setEnableButton]);

  useEffect(() => {
    setPreviousAnswers();
  }, [setPreviousAnswers]);

  return (
    <div className="p-4">
      <Typography type="h2" text={visitSection} color="textDark" />
      <Typography
        type="h4"
        text={(isView && !!previousDate
          ? new Date(previousDate)
          : new Date()
        ).toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })}
        color="textMid"
      />
      {isView && (
        <Alert
          className="mt-4"
          type="warning"
          title="You are viewing this form and cannot edit responses."
        />
      )}
      {isFollowUp && (
        <>
          <Divider dividerType="dashed" className="my-3" />
          <Typography
            type="h4"
            text={`${firstName} ${
              smartStarter?.user?.surname ?? ''
            } received an ${getRatingData(
              currentPqaRating.rating?.overallRatingColor
            ).text.toLowerCase()} on ${new Date(
              lastAttendedVisit?.insertedDate
            ).toLocaleDateString('en-ZA', dateLongMonthOptions)}`}
          />
          <Divider dividerType="dashed" className="my-3" />
        </>
      )}
      <Typography
        type="h4"
        text={replaceBraces(questions[0].question, firstName)}
        color={isView ? 'textLight' : 'textDark'}
        className="my-4"
      />
      <ButtonGroup<string>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={visitTypeOptions}
        selectedOptions={
          questions[0].answer !== '' ? String(questions[0].answer) : undefined
        }
        onOptionSelected={(value) => onOptionSelected(value, 0)}
      />
      {questions.slice(1, 5).map((item, index) => {
        const placeholders = [
          'e.g. Follow up on creating a healthy environment.',
          'e.g. Full daily routine',
          'e.g. Including more time for story reading',
          'e.g. Use more stories from Funda App',
        ];
        return (
          <FormInput
            key={item.question}
            disabled={isView}
            textInputType="textarea"
            className="mt-4"
            placeholder={placeholders[index]}
            label={replaceBraces(item.question, firstName)}
            value={
              !!questions[index + 1].answer
                ? String(questions[index + 1].answer)
                : ''
            }
            onChange={(value) =>
              onOptionSelected(value.target.value, index + 1)
            }
          />
        );
      })}
      {isFollowUp && (
        <>
          {isToShowFollowUpQuestion && (
            <>
              <Typography
                type="h4"
                text={replaceBraces(
                  questions[followUpQuestionIndex].question,
                  firstName
                )}
                color={isView ? 'textLight' : 'textDark'}
                className="my-4"
              />
              <ButtonGroup<string>
                color="secondary"
                type={ButtonGroupTypes.Button}
                options={options}
                selectedOptions={
                  questions[followUpQuestionIndex].answer !== ''
                    ? String(questions[followUpQuestionIndex].answer)
                    : undefined
                }
                onOptionSelected={(value) =>
                  onOptionSelected(value, followUpQuestionIndex)
                }
              />
            </>
          )}
          {currentPqaRating.rating?.overallRatingColor === 'Error' && (
            <Alert
              className="mt-4"
              type="warning"
              title={`Start another First PQA visit by ${addDays(
                new Date(lastAttendedVisit?.insertedDate),
                currentFollowUpDeadline
              ).toLocaleDateString('en-ZA', {
                month: 'long',
                day: 'numeric',
              })}.`}
            />
          )}
          {pqaRating3?.overallRatingColor === 'Warning' && (
            <Alert
              className="mt-4"
              type="warning"
              title={`This is your third follow up visit with ${firstName}.`}
              message={`You must conduct a full PQA visit by ${addDays(
                new Date(lastAttendedVisit?.insertedDate),
                currentFollowUpDeadline
              ).toLocaleDateString('en-ZA', {
                month: 'long',
                day: 'numeric',
              })}.`}
            />
          )}
        </>
      )}
    </div>
  );
};
