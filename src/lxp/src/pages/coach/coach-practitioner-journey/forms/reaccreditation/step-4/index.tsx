import { FormInput, Typography } from '@ecdlink/ui';
import { ChangeEvent, useEffect, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';

export const Step4ReAccreditation = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const question =
    'Together with the SmartStarter, agree on what next steps can be taken and note them here:';
  const visitSection = 'Step 4';
  const name = smartStarter?.user?.firstName || 'the SmartStarter';

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
      <Typography type="h2" text="Discuss next steps" color="textDark" />
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
        onChange={onChange}
      />
    </div>
  );
};
