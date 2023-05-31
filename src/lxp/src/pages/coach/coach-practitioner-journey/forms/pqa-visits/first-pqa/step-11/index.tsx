import { Alert, ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useCallback, useState } from 'react';

export const step11VisitSection = 'Step 11';

export const Step11 = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState<boolean | boolean[]>();
  const question = 'Do you have concerns about health & safety at this venue?';

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
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

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="Additional concerns or observations"
        color="textDark"
      />
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
