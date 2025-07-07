import { Alert, FormInput, Typography } from '@ecdlink/ui';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { DynamicFormProps, SectionQuestions } from '../../dynamic-form';
import { useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';
import { usePrevious } from 'react-use';
import { step3ReAccreditationVisitSection } from '../step-3';
import { options as step3Options } from '../step-3/options';
import { step2ReAccreditationVisitSection } from '../step-2';
import { options } from '../step-2/options';
import { ReactComponent as Emoji3 } from '@/assets/ECD_Connect_emoji3.svg';

export const Step4ReAccreditation = ({
  smartStarter,
  isView,
  sectionQuestions,
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

  const step2PreviousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'reAccreditationPreviousFormData',
      step2ReAccreditationVisitSection
    )
  );
  const step3PreviousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'reAccreditationPreviousFormData',
      step3ReAccreditationVisitSection
    )
  );

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

  const step2QuestionAnswers = (
    isView
      ? step2PreviousData
      : sectionQuestions?.find(
          (item) => item.visitSection === step2ReAccreditationVisitSection
        )
  )?.questions?.[0]?.answer;
  const step2FormattedAnswers = isView
    ? String(step2QuestionAnswers)?.split('.,')
    : (step2QuestionAnswers as string[] | undefined);
  const isStep2AllCompleted = step2FormattedAnswers?.length === options.length;
  const step2RestOptions = options.filter(
    (item) => !step2FormattedAnswers?.some((answer) => answer === item)
  );
  const step3QuestionAnswers = (
    isView
      ? step3PreviousData
      : sectionQuestions?.find(
          (item) => item.visitSection === step3ReAccreditationVisitSection
        )
  )?.questions?.[0]?.answer as string[] | undefined;
  const step3FormattedAnswers = isView
    ? String(step3QuestionAnswers)?.split('.,')
    : (step3QuestionAnswers as string[] | undefined);
  const isStep3AllCompleted =
    step3FormattedAnswers?.length === step3Options.question1?.length;
  const step3RestOptions = step3Options.question1?.filter(
    (item) => !step3FormattedAnswers?.some((answer) => answer === item)
  );

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setAnswer(value);
    setSectionQuestions?.([
      { visitSection, questions: [{ answer, question }] },
    ]);

    setEnableButton?.(!!value);
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
    if (isViewAnswers) {
      setEnableButton?.(true);
    }
  }, [isViewAnswers, setEnableButton]);

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
      {isStep2AllCompleted && isStep3AllCompleted && (
        <Alert
          className="mt-4"
          variant="outlined"
          type="success"
          title={`${name}’s venue meets all the basic SmartSpace standards as well as the additional standards!`}
          customIcon={<Emoji3 className="h-12 w-12" />}
        />
      )}
      {isStep2AllCompleted && !isStep3AllCompleted && (
        <div className="bg-uiBg rounded-15 my-4 p-4">
          <Typography
            type="h4"
            text={`${name}’s venue meets all the basic SmartSpace standards. She is working towards these additional standards:`}
            color="textDark"
          />
          <ul className="ml-5 mt-2 list-disc">
            {step3RestOptions?.map((item) => (
              <li className="text-textMid" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isStep2AllCompleted && (
        <Alert
          className="mt-4"
          variant="outlined"
          type="warning"
          title={`${name}’s venue does not meet the basic SmartSpace standards. She is still working on:`}
          list={step2RestOptions}
        />
      )}
      <FormInput
        className="mt-4"
        textInputType="textarea"
        label={question}
        placeholder="e.g. create a list of emergency numbers"
        value={answer}
        disabled={isViewAnswers}
        onChange={onChange}
      />
      {!isStep2AllCompleted && (
        <Alert
          className="mt-4"
          variant="outlined"
          type="error"
          title={`You cannot issue ${name}’s SmartSpace Licence.`}
          list={[
            `Discuss ways that ${name} can prepare for the next SmartSpace visit.`,
            `Schedule a follow-up visit with ${name}.`,
          ]}
        />
      )}
    </div>
  );
};
