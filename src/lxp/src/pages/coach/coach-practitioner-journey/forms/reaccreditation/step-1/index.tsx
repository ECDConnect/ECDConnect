import { FormInput, Typography } from '@ecdlink/ui';
import { ChangeEvent, useEffect, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';

export const Step1ReAccreditation = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const question = 'Observation notes';
  const visitSection = 'Step 1';

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setAnswer(value);
    setSectionQuestions?.([
      { visitSection, questions: [{ answer: value, question }] },
    ]);
  };

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography type="h2" text="Observe the programme" color="textDark" />
      <Typography
        type="h4"
        text={new Date().toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })}
        color="textMid"
      />
      <ul className="ml-5 mb-4 mt-4 list-disc">
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
      <FormInput
        className="mt-4"
        textInputType="textarea"
        label={question}
        subLabel="Optional"
        placeholder="e.g. The space has improved since last year."
        value={answer}
        onChange={onChange}
      />
    </div>
  );
};
