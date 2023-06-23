import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { Step7Map } from './map';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { replaceBraces } from '@ecdlink/core';
import { ReactComponent as OfflineIcon } from '@/assets/offline.svg';

export const Step7ReAccreditation = ({
  smartStarter,
  isTipPage,
  setIsTip,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'Is this address correct?',
      answer: '',
    },
    {
      question: 'Where is the programme site located?',
      answer: '',
    },
    {
      question:
        'Please confirm {client}’s proof of ownership, lease or permission ',
      answer: '',
    },
  ]);

  const { isOnline } = useOnlineStatus();
  const visitSection = 'Step 7';
  const firstName = smartStarter?.user?.firstName || 'the SmartStarter';
  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

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
      const isFirstAndLastCompleted =
        updatedQuestions[0].answer !== '' &&
        updatedQuestions[2].answer === true;
      const isCompleted =
        updatedQuestions[0].answer === false
          ? isAllCompleted
          : isFirstAndLastCompleted;
      setEnableButton?.(isCompleted);
    },
    [questions, setEnableButton, setSectionQuestions]
  );

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
      <Typography
        type="h4"
        text="Property address:"
        color="textDark"
        className="mt-4"
      />
      <Typography
        type="h4"
        text={`${smartStarter?.siteAddress?.addressLine1} ${smartStarter?.siteAddress?.addressLine2} ${smartStarter?.siteAddress?.addressLine3}, ${smartStarter?.siteAddress?.province?.description}`}
        color="textMid"
        className="my-4"
      />
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
      <Typography
        type="h4"
        text={replaceBraces(questions[2].question, firstName)}
        color="textDark"
      />
      <Typography
        type="body"
        text={`${firstName} does not own the property and lives at the property.`}
        color="textMid"
        className="my-4"
      />
      <Checkbox
        description={`I have checked that ${firstName} has the required forms proving ownership/lease agreement/permission to use premises.`}
        checked={Boolean(questions[2].answer)}
        onCheckboxChange={(event) => onOptionSelected(event.checked, 2)}
      />
    </div>
  );
};
