import { Divider, FormInput, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../dynamic-form';
import { ChangeEvent, useState } from 'react';

export const Step6 = ({
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const question =
    'What are some of the things you would like to do differently or get better at?';
  const visitSection = 'Step 6';

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setEnableButton?.(!!value);
    setAnswer(value);
    setSectionQuestions?.([
      { visitSection, questions: [{ answer, question }] },
    ]);
  };

  return (
    <div className="p-4">
      <Typography type="h2" text="Reflections" color="textDark" />
      <Divider dividerType="dashed" className="my-4" />
      <FormInput
        className="mt-4"
        textInputType="textarea"
        label={question}
        placeholder="e.g. always include recall time in my daily routine"
        value={answer}
        onChange={onChange}
      />
    </div>
  );
};
