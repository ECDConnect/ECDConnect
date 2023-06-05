import { FormInput, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { ChangeEvent, useEffect, useState } from 'react';

export const Step18 = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const question = 'Observation notes';
  const visitSection = 'Step 18';

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography type="h2" text="Programme details" color="textDark" />
    </div>
  );
};
