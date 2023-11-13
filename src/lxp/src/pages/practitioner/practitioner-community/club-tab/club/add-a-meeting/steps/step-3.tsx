import {
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { AddMeetingProps } from '../index.types';
import { useEffect } from 'react';

export const Step3 = ({ setIsEnabledButton }: AddMeetingProps) => {
  const yesNoOptions = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  useEffect(() => {
    // TODO: add integration
    setIsEnabledButton(true);
  }, [setIsEnabledButton]);

  return (
    <>
      <Typography className="mb-5" type="h2" text="Add a meeting" />
      <Typography
        type="h4"
        color="textDark"
        className="mb-2"
        text="Did your coach ({coachFirstName}) attend this meeting?"
      />
      <ButtonGroup<boolean>
        options={yesNoOptions}
        onOptionSelected={() => {}}
        color="secondary"
        type={ButtonGroupTypes.Button}
        className="mb-4"
      />
      <FormInput
        label="Meeting notes"
        hint="Optional"
        placeholder="e.g. We discussed our next caregiver event."
        className="mb-4"
        textInputType="textarea"
      />
      <Typography
        type="h4"
        color="textDark"
        className="mb-2"
        text="Did you create a resource during this meeting as part of a “Be creative” activity?"
      />
      <ButtonGroup<boolean>
        options={yesNoOptions}
        onOptionSelected={() => {}}
        color="secondary"
        type={ButtonGroupTypes.Button}
        className="mb-4"
      />
    </>
  );
};
