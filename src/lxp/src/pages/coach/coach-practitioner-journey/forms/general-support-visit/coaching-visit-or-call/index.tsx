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
  getCurrentReAccreditationRatingByUserId,
  getLastCoachAttendedVisitByUserId,
  getPractitionerTimelineByIdSelector,
  getVisitDataByVisitIdSelector,
} from '@/store/pqa/pqa.selectors';
import { useParams } from 'react-router';
import {
  PractitionerJourneyParams,
  visitTypes,
} from '../../../coach-practitioner-journey.types';
import { Maybe } from 'graphql/jsutils/Maybe';
import { currentActivityKey, visitIdKey } from '../..';
import { addDays } from 'date-fns';
import { followUpDeadline, getRatingData } from '../../../timeline/utils';

export const visitOrCallQuestion =
  'Did you visit the practitioner’s site, or did you have a support phone call?';
export const callAnswer = 'Call';
export const reAccreditationFollowUpQuestion =
  'Is {client} ready for a follow-up reaccreditation visit?';
export const supportVisitSharedQuestion = 'What next steps did you agree on?';
export const supportVisitQuestion2 = 'The focus of this coaching visit was:';

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
      question: supportVisitQuestion2,
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
      question: supportVisitSharedQuestion,
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

  const followUpQuestionIndex = questions.length - 1;
  const isPqaFollowUp = activityName === visitTypes.pqa.followUp.name;
  const isReAccreditationFollowUp =
    activityName === visitTypes.reaccreditation.followUp.name;

  const firstName = smartStarter?.user?.firstName || 'the smartStarter';
  const visitSection = 'Coaching visit or call';

  const { practitionerId } = useParams<PractitionerJourneyParams>();
  const lastAttendedPqaVisit = useSelector(
    getLastCoachAttendedVisitByUserId({
      userId: practitionerId,
      visitType: 'pQASiteVisits',
      followUpType: 'pqa_visit_follow_up',
    })
  );
  const lastAttendedReAccreditationVisit = useSelector(
    getLastCoachAttendedVisitByUserId({
      userId: practitionerId,
      visitType: 'reAccreditationVisits',
      followUpType: 're_accreditation_follow_up',
    })
  );
  const currentPqaRating = useSelector(
    getCurrentPQaRatingByUserId(practitionerId)
  );
  const currentReAccreditationRating = useSelector(
    getCurrentReAccreditationRatingByUserId(practitionerId)
  );
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );
  const pqaRating3 = timeline?.pQARating3;
  const reAccreditationRating3 = timeline?.reAccreditationRating3;

  // INFO: The user can start the follow-up after 14 days, but if it's the last visit (third one), this number changes to 60 days
  const currentPqaFollowUpDeadline = pqaRating3?.overallRating
    ? followUpDeadline.lastVisit
    : followUpDeadline.default;
  const currentReAccreditationFollowUpDeadline =
    reAccreditationRating3?.overallRating
      ? followUpDeadline.lastVisit
      : followUpDeadline.default;

  const isPQAFollowUpDeadline =
    addDays(
      new Date(lastAttendedPqaVisit?.insertedDate),
      currentPqaFollowUpDeadline
    ) <= new Date();
  const isReAccreditationFollowUpDeadline =
    addDays(
      new Date(lastAttendedPqaVisit?.insertedDate),
      currentReAccreditationFollowUpDeadline
    ) <= new Date();
  const isToShowPqaFollowUpQuestion =
    !pqaRating3?.overallRating &&
    currentPqaRating.rating?.overallRatingColor !== 'Error';

  const isToShowReAccreditationFollowUpQuestion = true;

  const visitId = window.sessionStorage.getItem(visitIdKey);

  const previousVisitAnswers = useSelector(
    getVisitDataByVisitIdSelector(visitId || '', 'prePqaPreviousFormData')
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

      const questionList =
        isToShowPqaFollowUpQuestion || isToShowReAccreditationFollowUpQuestion
          ? updatedQuestions
          : updatedQuestions.slice(0, 5);

      const isAllCompleted = questionList.every((item) => !!item.answer);
      const isEnabledButton =
        isAllCompleted &&
        ((questionList.length === 5 &&
          !isPqaFollowUp &&
          !isReAccreditationFollowUp) ||
          (isPqaFollowUp && isPQAFollowUpDeadline) ||
          (isReAccreditationFollowUp && isReAccreditationFollowUpDeadline));

      if (isEnabledButton) {
        return setEnableButton?.(true);
      }

      setEnableButton?.(false);
    },
    [
      isToShowReAccreditationFollowUpQuestion,
      isPQAFollowUpDeadline,
      isPqaFollowUp,
      isReAccreditationFollowUp,
      isReAccreditationFollowUpDeadline,
      isToShowPqaFollowUpQuestion,
      questions,
      setEnableButton,
      setSectionQuestions,
    ]
  );

  const InfoCard = () => {
    const currentRating = isPqaFollowUp
      ? currentPqaRating.rating?.overallRatingColor
      : currentReAccreditationRating.rating?.overallRatingColor;
    const lastAttendedFollowUpVisit = isPqaFollowUp
      ? lastAttendedPqaVisit?.insertedDate
      : lastAttendedReAccreditationVisit?.insertedDate;

    return (
      <>
        <Divider dividerType="dashed" className="my-3" />
        <Typography
          type="h4"
          text={`${firstName} ${
            smartStarter?.user?.surname ?? ''
          } received an ${getRatingData(
            currentRating
          ).text.toLowerCase()} on ${new Date(
            lastAttendedFollowUpVisit
          ).toLocaleDateString('en-ZA', dateLongMonthOptions)}`}
        />
        <Divider dividerType="dashed" className="my-3" />
      </>
    );
  };

  const PqaAlerts = () => {
    if (isPqaFollowUp) {
      return (
        <>
          {currentPqaRating.rating?.overallRatingColor === 'Error' && (
            <Alert
              className="mt-4"
              type="warning"
              title={`Start another First PQA visit by ${addDays(
                new Date(lastAttendedPqaVisit?.insertedDate),
                currentPqaFollowUpDeadline
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
                new Date(lastAttendedPqaVisit?.insertedDate),
                currentPqaFollowUpDeadline
              ).toLocaleDateString('en-ZA', {
                month: 'long',
                day: 'numeric',
              })}.`}
            />
          )}
        </>
      );
    }

    return <></>;
  };

  const ReAccreditationAlerts = () => {
    if (isReAccreditationFollowUp) {
      return (
        <>
          {currentReAccreditationRating.rating?.overallRatingColor ===
            'Error' && (
            <Alert
              className="mt-4"
              type="warning"
              title={`Start another reaccreditation visit by ${addDays(
                new Date(lastAttendedReAccreditationVisit?.insertedDate),
                currentReAccreditationFollowUpDeadline
              ).toLocaleDateString('en-ZA', {
                month: 'long',
                day: 'numeric',
              })}.`}
            />
          )}
          {reAccreditationRating3?.overallRatingColor === 'Warning' && (
            <Alert
              className="mt-4"
              type="warning"
              title={`This is your third follow up visit with ${firstName}.`}
              message={`You must conduct a full reaccreditation visit by ${addDays(
                new Date(lastAttendedReAccreditationVisit?.insertedDate),
                currentReAccreditationFollowUpDeadline
              ).toLocaleDateString('en-ZA', {
                month: 'long',
                day: 'numeric',
              })}.`}
            />
          )}
        </>
      );
    }

    return <></>;
  };

  useEffect(() => {
    if (isToShowPqaFollowUpQuestion) {
      setAnswers((prevState) => [
        ...prevState,
        {
          question: 'Is {client} ready for a follow-up PQA observation visit?',
          answer: '',
        },
      ]);
    }
  }, [isToShowPqaFollowUpQuestion]);

  useEffect(() => {
    if (isToShowReAccreditationFollowUpQuestion) {
      setAnswers((prevState) => [
        ...prevState,
        {
          question: reAccreditationFollowUpQuestion,
          answer: '',
        },
      ]);
    }
  }, [isToShowReAccreditationFollowUpQuestion]);

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
      {(isPqaFollowUp || isReAccreditationFollowUp) && <InfoCard />}
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
      {(isPqaFollowUp || isReAccreditationFollowUp) && (
        <>
          {(isToShowPqaFollowUpQuestion ||
            isToShowReAccreditationFollowUpQuestion) && (
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
          <PqaAlerts />
          <ReAccreditationAlerts />
        </>
      )}
    </div>
  );
};
