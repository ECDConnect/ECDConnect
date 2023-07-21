import { Alert, FormInput, Typography } from '@ecdlink/ui';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { DynamicFormProps, SectionQuestions } from '../../dynamic-form';
import { useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';
import { usePrevious } from 'react-use';

export const Step4ReAccreditation = ({
  smartStarter,
  isView,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const question =
    'Together with the SmartStarter, agree on what next steps can be taken and note them here:';
  const visitSection = 'Step 4';
  const name =
    smartStarter?.user?.firstName ||
    smartStarter?.firstName ||
    'the SmartStarter';

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;

  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'reAccreditationPreviousFormData',
      visitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setAnswer(value);
    setSectionQuestions?.([
      { visitSection, questions: [{ answer, question }] },
    ]);
  };

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      setAnswer(String(previousData?.questions?.[0]?.answer));
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
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography type="h2" text="Discuss next steps" color="textDark" />
      {isViewAnswers && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <div className="bg-uiBg rounded-15 my-4 p-4">
        <Typography
          type="h4"
          text={`${name}’s venue meets all the basic SmartSpace standards. She is working towards these additional standards:`}
          color="textDark"
        />
        <ul className="ml-5 mt-2 list-disc">
          <li className="text-textMid">
            Spend at least 30 minutes observing the programme (preferably across
            more than one activity)
          </li>
          <li className="text-textMid">
            {' '}
            At least 20 minutes talking with the SmartStarter (either before the
            programme starts, or after children have left)
          </li>
        </ul>
      </div>
      <FormInput
        className="mt-4"
        textInputType="textarea"
        label={question}
        placeholder="e.g. create a list of emergency numbers"
        value={answer}
        disabled={isViewAnswers}
        onChange={onChange}
      />
    </div>
  );
};
