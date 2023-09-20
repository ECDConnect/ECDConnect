import { Alert, Checkbox, Dropdown, Typography } from '@ecdlink/ui';
import { ClubMembersEditProps } from '..';
import { useEffect } from 'react';

export const Step2 = ({ setIsEnabledButton }: ClubMembersEditProps) => {
  useEffect(() => {
    // TODO: put it in an onChange
    setIsEnabledButton(true);
  }, [setIsEnabledButton]);

  return (
    <>
      <Typography type="h2" text="Choose a club" />
      <Typography
        className="mb-5"
        type="h4"
        text="You can only move SmartStarters to an existing club."
      />
      {/* TODO: add integration */}
      <Dropdown
        label="Choose a club"
        placeholder=".."
        list={[]}
        onChange={() => {}}
        className="mb-4"
      />
      {/* TODO: add integration */}
      <Checkbox
        descriptionColor="textDark"
        description="I confirm that all SmartStarters selected have agreed to move to a new club."
      />
      {/* TODO: add integration */}
      <Alert
        className="mt-4"
        type="info"
        title="The SmartStarters ({member1}, {member2}) will be moved to the new club immediately."
        list={['They will receive a notification about their new club.']}
      />
    </>
  );
};
