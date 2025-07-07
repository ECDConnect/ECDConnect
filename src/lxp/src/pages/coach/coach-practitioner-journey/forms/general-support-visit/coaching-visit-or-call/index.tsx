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
import { chunkArray, replaceBraces } from '@ecdlink/core';
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
  maxNumberOfVisits,
  visitTypes,
} from '../../../coach-practitioner-journey.types';
import { Maybe } from 'graphql/jsutils/Maybe';
import { currentActivityKey, visitIdKey } from '../..';
import { divideArrayByFollowUp, getRatingData } from '../../../timeline/utils';
import {
  callAnswer,
  pqaFollowUpQuestion,
  reAccreditationFollowUpQuestion,
  supportVisitQuestion2,
  supportVisitSharedQuestion,
  visitAnswer,
  visitOrCallQuestion,
} from './constants';
import { PqaRating } from '@ecdlink/graphql';

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
    { text: 'Visit', value: visitAnswer, disabled: isView },
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

  const pqaVisits = divideArrayByFollowUp(timeline?.pQASiteVisits ?? []);
  const currentPqaVisits = pqaVisits.find((visits) =>
    visits.some((item) => !item?.attended)
  );
  const currentPqaIndex = pqaVisits.findIndex((visits) =>
    currentPqaVisits?.some((item) =>
      visits.find((visit) => visit?.id === item?.id)
    )
  );
  const nextPqaVisits = pqaVisits[currentPqaIndex + 1] ?? [];

  const isThirdPqaFollowUpVisit =
    currentPqaVisits?.filter(
      (item) => item?.visitType?.name === visitTypes.pqa.followUp.name
    )?.length === 3;

  const reAccreditationVisits = divideArrayByFollowUp(
    timeline?.reAccreditationVisits ?? []
  );
  const currentReAccreditationVisits = reAccreditationVisits.find((visits) =>
    visits.some((item) => !item?.attended)
  );
  const currentReAccreditationIndex = reAccreditationVisits.findIndex(
    (visits) =>
      currentReAccreditationVisits?.some((item) =>
        visits.find((visit) => visit?.id === item?.id)
      )
  );
  const nextReAccreditationVisits =
    reAccreditationVisits[currentReAccreditationIndex + 1] ?? [];

  const isThirdReAccreditationFollowUpVisit =
    currentReAccreditationVisits?.filter(
      (item) =>
        item?.visitType?.name === visitTypes.reaccreditation.followUp.name
    )?.length === 3;

  // All years
  const filteredReAccreditationRatings =
    timeline?.reAccreditationRatings?.filter(
      (item) => item?.visitTypeName !== visitTypes.reaccreditation.followUp.name
    ) ?? [];
  const subdividedReAccreditationRatings = chunkArray<Maybe<PqaRating>>(
    filteredReAccreditationRatings,
    maxNumberOfVisits
  );
  const reAccreditationRatingsFromCurrentYear =
    subdividedReAccreditationRatings?.[
      subdividedReAccreditationRatings.length - 1
    ];
  const pqaRatings =
    timeline?.pQARatings?.filter(
      (item) => item?.visitTypeName !== visitTypes.pqa.followUp.name
    ) ?? [];

  const pqaRating3 = pqaRatings?.[2];
  const reAccreditationRating3 = reAccreditationRatingsFromCurrentYear?.[2];

  const isToShowPqaFollowUpQuestion =
    !pqaRating3?.overallRating &&
    activityName.includes(visitTypes.pqa.followUp.name);

  const isToShowReAccreditationFollowUpQuestion =
    !reAccreditationRating3?.overallRating &&
    activityName.includes(visitTypes.reaccreditation.followUp.name);

  const visitId = window.sessionStorage.getItem(visitIdKey);

  const requestedCoachVisit = timeline?.requestedCoachVisits?.find(
    (item) => item?.id === visitId
  );

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
        (isToShowPqaFollowUpQuestion && !isThirdPqaFollowUpVisit) ||
        (isToShowReAccreditationFollowUpQuestion &&
          !isThirdReAccreditationFollowUpVisit)
          ? updatedQuestions
          : updatedQuestions.slice(0, 5);

      const isAllCompleted = questionList.every((item) => !!item.answer);

      if (isAllCompleted) {
        return setEnableButton?.(true);
      }
      setEnableButton?.(false);
    },
    [
      questions,
      setSectionQuestions,
      isToShowPqaFollowUpQuestion,
      isThirdPqaFollowUpVisit,
      isToShowReAccreditationFollowUpQuestion,
      isThirdReAccreditationFollowUpVisit,
      setEnableButton,
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
              title={`Start another First PQA visit by ${new Date(
                nextPqaVisits[0]?.plannedVisitDate
              ).toLocaleDateString('en-ZA', {
                month: 'long',
                day: 'numeric',
              })}.`}
            />
          )}
          {isThirdPqaFollowUpVisit && (
            <Alert
              className="mt-4"
              type="warning"
              title={`This is your third follow up visit with ${firstName}.`}
              message={`You must conduct a full PQA visit by ${new Date(
                nextPqaVisits[0]?.plannedVisitDate
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
              title={`Start another reaccreditation visit by ${new Date(
                nextReAccreditationVisits[0]?.plannedVisitDate
              ).toLocaleDateString('en-ZA', {
                month: 'long',
                day: 'numeric',
              })}.`}
            />
          )}
          {isThirdReAccreditationFollowUpVisit && (
            <Alert
              className="mt-4"
              type="warning"
              title={`This is your third follow up visit with ${firstName}.`}
              message={`You must conduct a full reaccreditation visit by ${new Date(
                nextReAccreditationVisits[0]?.plannedVisitDate
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
    if (!!requestedCoachVisit && !questions[0].answer) {
      setAnswers((prevState) => {
        const updatedQuestions = prevState.map((item, index) => {
          if (index === 0) {
            return {
              ...item,
              answer: requestedCoachVisit?.visitType?.name?.includes('Call')
                ? callAnswer
                : visitAnswer,
            };
          }
          return item;
        });
        return updatedQuestions;
      });
    }
  }, [questions, requestedCoachVisit]);

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
      {!requestedCoachVisit && (
        <>
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
              questions[0].answer !== ''
                ? String(questions[0].answer)
                : undefined
            }
            onOptionSelected={(value) => onOptionSelected(value, 0)}
          />
        </>
      )}
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
          {((isToShowPqaFollowUpQuestion && !isThirdPqaFollowUpVisit) ||
            (isToShowReAccreditationFollowUpQuestion &&
              !isThirdReAccreditationFollowUpVisit)) && (
            <>
              <Typography
                type="h4"
                text={replaceBraces(
                  isToShowPqaFollowUpQuestion
                    ? pqaFollowUpQuestion
                    : reAccreditationFollowUpQuestion,
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
