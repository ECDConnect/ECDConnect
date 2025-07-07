import { Alert, CheckboxChange, CheckboxGroup, Typography } from '@ecdlink/ui';
import { DynamicFormProps, SectionQuestions } from '../../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { options } from './options';
import {
  step14CertificateQuestion,
  step14NoteQuestion,
  step14VisitSection,
} from '../step-14';
import { usePrevious, useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';

export const step15VisitSection = 'Step 15';

export const Step15 = ({
  smartStarter,
  sectionQuestions,
  isView,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [question, setAnswers] = useState({
    question: 'Franchisee agreement',
    answer: [] as (string | number | undefined)[],
  });

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;

  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'pqaPreviousFormData',
      step15VisitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const answers = question.answer as string[];
  const name = smartStarter?.user?.firstName || smartStarter?.firstName;
  const step14Question1Answer = sectionQuestions
    ?.find((item) => item.visitSection === step14VisitSection)
    ?.questions.find((item) => item.question === step14CertificateQuestion)
    ?.answer as boolean | undefined;
  const step14Question2Answer = sectionQuestions
    ?.find((item) => item.visitSection === step14VisitSection)
    ?.questions.find((item) => item.question === step14NoteQuestion)
    ?.answer as string;
  const currentOptions =
    !!step14Question2Answer && !step14Question1Answer
      ? options.question1FromNotPass
      : options.question1;

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        const updatedQuestion = { ...question, answer: currentAnswers };

        setAnswers(updatedQuestion);
        return setSectionQuestions?.([
          {
            visitSection: step15VisitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setAnswers(updatedQuestion);
      return setSectionQuestions?.([
        { visitSection: step15VisitSection, questions: [updatedQuestion] },
      ]);
    },
    [answers, question, setSectionQuestions]
  );

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      const answer =
        previousData?.questions?.[0]?.answer?.toString()?.split('.,') ?? [];

      setAnswers((prevState) => ({
        question: prevState.question,
        answer,
      }));
    }
  }, [
    isViewAnswers,
    previousData,
    previousStatePreviousData?.questions.length,
  ]);

  useEffect(() => {
    handleViewMode();
  }, [handleViewMode]);

  useEffect(() => {
    if (question.answer?.length === currentOptions?.length || isViewAnswers) {
      return setEnableButton?.(true);
    }

    setEnableButton?.(false);
  }, [currentOptions, isViewAnswers, question, setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text={`${name} - ${question.question}`}
        color="textDark"
      />
      {isViewAnswers && (
        <Alert
          className="mt-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      {!!step14Question2Answer && (
        <div className="bg-uiBg rounded-15 mt-4 p-4">
          <Typography
            type="h3"
            text={`Next steps for ${name}`}
            color="textDark"
          />
          <Typography
            type="body"
            text={step14Question2Answer}
            color="textMid"
          />
        </div>
      )}
      <Typography
        className="my-4"
        type="h4"
        text={`Give the phone to ${name} & ask them to confirm each item by tapping the box:`}
        color="textDark"
      />
      {currentOptions.map((item) => (
        <CheckboxGroup
          className="mb-2"
          id={item}
          key={item}
          title={item}
          titleColours="textMid"
          titleSize="sm"
          titleWeight="normal"
          checked={answers?.some((option) => item.includes(option))}
          disabled={isViewAnswers}
          value={item}
          onChange={onCheckboxChange}
        />
      ))}
      <Alert
        className="mt-4"
        type="warning"
        title={`Note: by tapping the “Next” button below, you are confirming that ${name} checked the boxes and agrees to all of the steps.`}
        list={[`${name}’s signature will be added.`]}
      />
    </div>
  );
};
