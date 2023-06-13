import { Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useEffect, useState } from 'react';

export const Step19 = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const question = 'Observation notes';
  const visitSection = 'Step 19';

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="Child attendance & registration"
        color="textDark"
      />
    </div>
  );
};
