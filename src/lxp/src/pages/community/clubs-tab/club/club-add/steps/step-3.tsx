import { Alert, Dropdown, Typography } from '@ecdlink/ui';
import { ClubAddProps } from '..';
import { useEffect } from 'react';

export const Step3 = ({ setIsEnabledButton }: ClubAddProps) => {
  useEffect(() => {
    // TODO: put it in an onChange
    setIsEnabledButton(true);
  }, [setIsEnabledButton]);

  return (
    <>
      <Typography type="h2" text="Add a club" />
      <Dropdown
        label="Choose a club"
        placeholder="Tap to choose"
        list={[]}
        onChange={() => {}}
        className="my-4"
      />
      <Alert
        type="info"
        title="All club members will be notified immediately."
      />
    </>
  );
};
