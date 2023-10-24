import { Alert, Dropdown, FormInput, Typography } from '@ecdlink/ui';
import { AddMeetingProps } from '../index.types';
import { useEffect } from 'react';

export const Step1 = ({ setIsEnabledButton }: AddMeetingProps) => {
  useEffect(() => {
    // TODO: add integration
    setIsEnabledButton(true);
  }, [setIsEnabledButton]);

  return (
    <>
      <Typography type="h2" text="Add a family day event for term 3" />
      <Typography
        className="mb-5"
        type="body"
        color="textMid"
        text={`August to October ${new Date().getFullYear()}`}
      />
      <Alert
        className="mb-4"
        type="info"
        title="You can submit one event per term."
      />
      <Dropdown
        className="mb-4"
        label="What type of event did you hold?"
        list={[]}
        placeholder="Tap to choose event type"
        onChange={() => {}}
      />
      <FormInput
        label="Add a short description of the event"
        placeholder="e.g. Sharing activity information with caregivers."
        textInputType="textarea"
      />
    </>
  );
};
