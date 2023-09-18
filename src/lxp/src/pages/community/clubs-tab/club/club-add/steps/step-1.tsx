import { Avatar, CheckboxGroup, FormInput, Typography } from '@ecdlink/ui';
import { mockedClub } from '../../individual-club-view';
import { ClubAddProps } from '..';
import { useEffect } from 'react';

export const Step1 = ({ setIsEnabledButton }: ClubAddProps) => {
  // TODO: replace mockedClub with the real data
  const isSmartStartersWithoutClub = mockedClub.members.length > 0;

  useEffect(() => {
    // TODO: put it in an onChange
    setIsEnabledButton(true);
  }, [setIsEnabledButton]);

  return (
    <>
      <Typography className="mb-5" type="h2" text="Add a club" />
      <FormInput
        label="Club name"
        hint='Do not include the word "club" in the name.'
        placeholder="Add club name..."
        className="mb-5"
      />
      <Typography type="h4" text="Add club members" />
      <Typography
        type="help"
        text="These are all the SmartStarters who are not in a club yet."
        color="textMid"
        className="mb-5"
      />
      {isSmartStartersWithoutClub &&
        mockedClub.members.map((member) => (
          <CheckboxGroup
            className="mb-2"
            key={member.name}
            title={member.name}
            titleWeight="semibold"
            icon={
              <div className="ml-4 mr-2">
                <Avatar dataUrl={mockedClub.iconUrl} />
              </div>
            }
            isIconFullWidth
          />
        ))}
    </>
  );
};
