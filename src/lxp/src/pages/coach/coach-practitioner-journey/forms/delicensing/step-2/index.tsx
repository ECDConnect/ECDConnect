import { Alert, FormInput, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect } from 'react';

export const Step2Delicensing = ({
  smartStarter,
  setEnableButton,
}: DynamicFormProps) => {
  const firstName = smartStarter?.user?.firstName || 'The smartStarter';

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Alert
        type="error"
        title={`${firstName} will be removed from the programme immediately`}
        list={[
          `If you remove ${firstName} now, they will no longer be able to see child information or perform any actions in the classroom section.`,
        ]}
      />
      <Typography
        type="h2"
        text={`Why is ${firstName} leaving SmartStart?`}
        color="textDark"
      />
      <FormInput label="Reason for leaving" value="Delicensed" disabled />
      <Alert
        type="info"
        title="You cannot change the reason for leaving because the SmartStarter has been delicensed."
      />
    </div>
  );
};
