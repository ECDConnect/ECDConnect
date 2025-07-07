import { FormInput, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { ChangeEvent, useEffect, useState } from 'react';

export const Step1 = ({
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
      { visitSection, questions: [{ answer, question }] },
    ]);
  };

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="Observe full SmartStart routine"
        color="textDark"
      />
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
      <Typography
        className="mt-4 mb-6"
        type="h4"
        text="Spend the next few hours observing the programme."
        color="textDark"
      />
      <Typography
        type="h4"
        text="Sit out of the way and use form Q2 to assess the SmartStarter. When the programme is done, tap the Next button below."
        color="textLight"
      />
      <FormInput
        className="mt-4"
        textInputType="textarea"
        label={question}
        subLabel="Optional"
        placeholder="e.g. Children unsupervised for 5 minutes."
        value={answer}
        onChange={onChange}
      />
    </div>
  );
};
