import { Alert, ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import { DynamicFormProps, SectionQuestions } from '../../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { parseBool, usePrevious, useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';

export const step11VisitSection = 'Step 11';

export const Step11 = ({
  setSectionQuestions,
  setEnableButton,
  isView,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState<boolean | boolean[]>();
  const question = 'Do you have concerns about health & safety at this venue?';

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;

  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'pqaPreviousFormData',
      step11VisitSection
    )
  );

  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const options = [
    { text: 'Yes', value: true, disabled: isViewAnswers },
    { text: 'No', value: false, disabled: isViewAnswers },
  ];

  const onOptionSelected = useCallback(
    (value) => {
      setAnswer(value);
      setSectionQuestions?.([
        {
          visitSection: step11VisitSection,
          questions: [
            {
              question,
              answer: value,
            },
          ],
        },
      ]);
      setEnableButton?.(true);
    },
    [question, setEnableButton, setSectionQuestions]
  );

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      const answer = String(previousData?.questions?.[0]?.answer) ?? undefined;
      setAnswer(answer ? parseBool(answer) : undefined);
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
    if (isViewAnswers) {
      setEnableButton?.(true);
    }
  }, [isViewAnswers, setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="Additional concerns or observations"
        color="textDark"
      />
      {isViewAnswers && (
        <Alert
          className="mt-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Typography
        type="h4"
        text={question}
        color="textDark"
        className="mt-4 mb-2"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        selectedOptions={answer}
        onOptionSelected={onOptionSelected}
      />
      {!!answer && (
        <Alert
          className="mt-4"
          type="info"
          title="You will be asked to complete the SmartSpace checklist."
        />
      )}
    </div>
  );
};
