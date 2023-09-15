import { Avatar, CheckboxGroup, Typography } from '@ecdlink/ui';
import { mockedClub } from '../../individual-club-view';
import { ClubMembersEditProps } from '..';
import { useEffect } from 'react';

export const Step1 = ({ setIsEnabledButton }: ClubMembersEditProps) => {
  useEffect(() => {
    // TODO: put it in an onChange
    setIsEnabledButton(true);
  }, [setIsEnabledButton]);

  return (
    <>
      <Typography
        className="mb-5"
        type="h2"
        text={`Add SmartStarters to ${mockedClub.name} club`}
      />
      <Typography className="mb-1" type="h4" text="Add club members" />
      <Typography
        className="mb-4"
        type="help"
        text="These are all the SmartStarters who are not in a club yet."
        color="textMid"
      />
      {mockedClub.members.map((member) => (
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
