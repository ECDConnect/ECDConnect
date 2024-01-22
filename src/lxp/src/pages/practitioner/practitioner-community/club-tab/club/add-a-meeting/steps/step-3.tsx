import {
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { AddMeetingProps } from '../index.types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { coachSelectors } from '@/store/coach';
import { clubSelectors } from '@/store/club';
import { LeagueType } from '@/constants/club';

export const Step3 = ({
  setIsEnabledButton,
  setStep3,
  clubId,
}: AddMeetingProps) => {
  const [coachAttend, setCoachAttend] = useState<boolean | boolean[]>();
  const [meetingNotes, setMeetingNotes] = useState<string>();
  const [createdResource, setCreatedResource] = useState<boolean | boolean[]>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const isPurpleLeagueClub = club?.league.leagueTypeName === LeagueType.Purple;

  const yesNoOptions = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const coach = useSelector(coachSelectors.getCoach);

  useEffect(() => {
    setIsEnabledButton(
      coachAttend !== undefined &&
        (isPurpleLeagueClub || createdResource !== undefined)
    );
  }, [coachAttend, createdResource, isPurpleLeagueClub, setIsEnabledButton]);

  useEffect(() => {
    setStep3?.({
      coachAttend: coachAttend as boolean,
      meetingNotes,
      createdResource: createdResource as boolean,
    });
  }, [coachAttend, createdResource, meetingNotes, setStep3]);

  return (
    <>
      <Typography className="mb-5" type="h2" text="Add a meeting" />
      <Typography
        type="h4"
        color="textDark"
        className="mb-2"
        text={`Did your coach (${coach?.user?.firstName}) attend this meeting?`}
      />
      <ButtonGroup<boolean>
        options={yesNoOptions}
        onOptionSelected={setCoachAttend}
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
        value={meetingNotes}
        onChange={(event) => setMeetingNotes(event.target.value)}
      />
      {!isPurpleLeagueClub && (
        <>
          <Typography
            type="h4"
            color="textDark"
            className="mb-2"
            text="Did you create a resource during this meeting as part of a “Be creative” activity?"
          />
          <ButtonGroup<boolean>
            options={yesNoOptions}
            onOptionSelected={setCreatedResource}
            color="secondary"
            type={ButtonGroupTypes.Button}
            className="mb-4"
          />
        </>
      )}
    </>
  );
};
