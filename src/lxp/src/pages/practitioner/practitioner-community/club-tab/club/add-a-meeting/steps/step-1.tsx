import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { AddMeetingProps } from '../index.types';
import { useEffect, useState } from 'react';

export const Step1 = ({ setIsEnabledButton, setStep1 }: AddMeetingProps) => {
  const [hasMeetingHappened, setHasMeetingHappened] = useState<
    boolean | undefined
  >();

  const yesNoOptions = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  useEffect(() => {
    // TODO: add integration
    setIsEnabledButton(true);
  }, [setIsEnabledButton]);

  useEffect(() => {
    if (hasMeetingHappened !== undefined) {
      setStep1?.({
        hasMeetingHappened,
        date: '',
      });
    }
  }, [hasMeetingHappened, setStep1]);

  return (
    <>
      <Typography className="mb-5" type="h2" text="Add a meeting" />
      <Typography
        type="h4"
        color="textDark"
        className="mb-2"
        text="Has the meeting already happened?"
      />
      <ButtonGroup<boolean>
        options={yesNoOptions}
        onOptionSelected={(value) => setHasMeetingHappened(value as boolean)}
        color="secondary"
        type={ButtonGroupTypes.Button}
        className="mb-4"
      />
      {hasMeetingHappened && (
        <Alert
          className="mb-4"
          type="warning"
          title="You can only add meetings that happend in {month}."
          list={[
            'The deadline for adding meeting attendance registers & notes is the last day of every month.',
          ]}
        />
      )}
      {hasMeetingHappened !== undefined && (
        <FormInput
          label={
            hasMeetingHappened
              ? 'What day did the meeting happen?'
              : 'What day will the meeting happen?'
          }
        />
      )}
    </>
  );
};
