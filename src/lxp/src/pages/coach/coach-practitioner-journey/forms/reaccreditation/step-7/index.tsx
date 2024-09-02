import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DynamicFormProps, SectionQuestions } from '../../dynamic-form';
import { Step7Map } from './map';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { parseBool, usePrevious, useSessionStorage } from '@ecdlink/core';
import { ReactComponent as OfflineIcon } from '@/assets/offline.svg';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';

const question1 = 'Is this address correct?';

interface State {
  question: string;
  answer: string;
}

export const Step7ReAccreditation = ({
  smartStarter,
  isTipPage,
  isView,
  setIsTip,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: question1,
      answer: '',
    },
    {
      question: 'Where is the programme site located?',
      answer: '',
    },
  ]);

  const { isOnline } = useOnlineStatus();
  const visitSection = 'Step 7';

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

  const options = [
    { text: 'Yes', value: true, disabled: isViewAnswers },
    { text: 'No', value: false, disabled: isViewAnswers },
  ];

  const location = useMemo(() => {
    const address = [
      smartStarter?.siteAddress?.addressLine1,
      smartStarter?.siteAddress?.addressLine2,
      smartStarter?.siteAddress?.addressLine3,
      //smartStarter?.siteAddress?.province?.description,
    ];

    if (questions[1].answer) {
      return questions[1].answer;
    }

    if (address.every((item) => item === null || item === undefined)) {
      return 'No address available';
    }

    return `${address[0] || ''} ${address[1] || ''} ${address[2] || ''} ${
      address[3]
    }`;
  }, [questions, smartStarter]);

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question, currentIndex) => {
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

      const isAllCompleted = updatedQuestions.every(
        (item) => String(item.answer).length > 1
      );
      const isFirstCompleted = updatedQuestions[0].answer !== '';
      const isCompleted =
        updatedQuestions[0].answer === false
          ? isAllCompleted
          : isFirstCompleted;
      setEnableButton?.(isCompleted);
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      const updatedQuestions = questions.map((question) => {
        const correspondingQuestion = previousData?.questions.find(
          (secondQuestion) => secondQuestion?.question === question.question
        );

        if (correspondingQuestion) {
          const isQuestion1 =
            correspondingQuestion.question.includes(question1);

          return {
            ...question,
            answer:
              isQuestion1 && correspondingQuestion.answer
                ? parseBool(String(correspondingQuestion.answer))
                : correspondingQuestion.answer,
          };
        }

        return question;
      });

      setAnswers(updatedQuestions as State[]);
    }
  }, [
    isViewAnswers,
    previousData?.questions,
    previousStatePreviousData?.questions.length,
    questions,
  ]);

  useEffect(() => {
    handleViewMode();
  }, [handleViewMode]);

  useEffect(() => {
    if (isViewAnswers) {
      setEnableButton?.(true);
    }
  }, [isViewAnswers, setEnableButton]);

  if (isTipPage) {
    return (
      <Step7Map
        onClose={() => setIsTip?.(false)}
        onSubmit={(address) => onOptionSelected(address, 1)}
      />
    );
  }

  return (
    <div className="p-4">
      <Typography type="h2" text="Property details" color="textDark" />
      {isViewAnswers && (
        <Alert
          className="mt-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Typography
        type="h4"
        text="Property address:"
        color="textDark"
        className="mt-4"
      />
      <Typography type="h4" text={location} color="textMid" className="my-4" />
      <Typography
        type="h4"
        text={questions[0].question}
        color="textDark"
        className="mt-4 mb-2"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        selectedOptions={
          questions[0].answer !== '' ? Boolean(questions[0].answer) : undefined
        }
        onOptionSelected={(value) => onOptionSelected(value, 0)}
      />
      {typeof questions[0].answer === 'boolean' &&
        questions[0].answer === false && (
          <>
            {isOnline ? (
              <FormInput
                label={questions[1].question}
                value={questions[1].answer}
                placeholder="Tap to add"
                type="text"
                className="mt-4"
                onClick={() => setIsTip?.(true)}
                disabled={isViewAnswers}
                suffixIcon="LocationMarkerIcon"
                sufficIconColor="primary"
              />
            ) : (
              <div className="mt-4 flex flex-col items-center justify-center px-10 text-center">
                <OfflineIcon />
                <Typography
                  type="h3"
                  text="Information not available when offline"
                  color="textDark"
                  className="mt-4 mb-2"
                />
                <Typography
                  type="body"
                  text="Please go online and refresh the page to see this information."
                  color="textDark"
                />
              </div>
            )}
          </>
        )}
      <Alert
        className="my-4"
        type="info"
        title="You must be online to update the address."
        list={[
          'If you are offline, please select “Yes” above & explain how the trainee can update their address through Funda App.',
        ]}
      />
    </div>
  );
};
