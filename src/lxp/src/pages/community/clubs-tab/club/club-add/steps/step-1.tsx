import {
  Avatar,
  CheckboxChange,
  CheckboxGroup,
  FormInput,
  Typography,
  UserAvatar,
} from '@ecdlink/ui';
import { ClubAddProps, Member } from '..';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { practitionerSelectors } from '@/store/practitioner';
import { clubSelectors } from '@/store/club';
import { PractitionerDto } from '@ecdlink/core';
import { maxCharactersInClubName } from '@/constants/club';

export const Step1 = ({ setIsEnabledButton, setStep1 }: ClubAddProps) => {
  const [clubName, setClubName] = useState('');
  const [selectedPractitioners, setSelectedPractitioners] = useState<Member[]>(
    []
  );

  const clubs = useSelector(clubSelectors.getAllClubsForCoachSelector);

  const practitionersForCoach = useSelector(
    practitionerForCoachSelectors.getPractitionersForCoach
  );
  const allPractitioners = useSelector(practitionerSelectors.getPractitioners);
  const filteredPractitioners = allPractitioners?.filter((practitioner) =>
    practitionersForCoach?.find(
      (practitionerForCoach) => practitioner.id === practitionerForCoach.id
    )
  );

  const mergedMembers = clubs?.map((club) => club.clubMembers).flat();

  const practitionersNotInClub = filteredPractitioners?.filter(
    (practitioner) =>
      !mergedMembers?.find(
        (member) => practitioner.id === member?.practitionerId
      )
  );

  const isSmartStartersWithoutClub = !!practitionersNotInClub?.length;

  const onCheckboxChange = (event: CheckboxChange) => {
    const value = event.value as PractitionerDto;
    if (event.checked && !!event.value) {
      const currentPractitioners = selectedPractitioners
        ? [
            ...selectedPractitioners,
            {
              practitionerId: value.id!,
              name: `${value.user?.firstName} ${value.user?.surname}`,
            },
          ]
        : [
            {
              practitionerId: value.id!,
              name: `${value.user?.firstName} ${value.user?.surname}`,
            },
          ];

      return setSelectedPractitioners(currentPractitioners);
    }

    const currentPractitioners = selectedPractitioners?.filter(
      (item) => item !== value
    );

    return setSelectedPractitioners(currentPractitioners);
  };

  useEffect(() => {
    if (clubName || selectedPractitioners?.length) {
      setStep1?.({ clubName, members: selectedPractitioners });
    }

    setIsEnabledButton(
      !!clubName && clubName.length <= maxCharactersInClubName
    );
  }, [clubName, selectedPractitioners, setIsEnabledButton, setStep1]);

  return (
    <>
      <Typography className="mb-5" type="h2" text="Add a club" />
      <FormInput
        label="Club name"
        hint='Do not include the word "club" in the name.'
        placeholder="Add club name..."
        className="mb-5"
        value={clubName}
        onChange={(event) => setClubName(event.target.value)}
        maxCharacters={maxCharactersInClubName}
      />
      {isSmartStartersWithoutClub && (
        <div className="mb-4">
          <Typography type="h4" text="Add club members" />
          <Typography
            type="help"
            text="These are all the SmartStarters who are not in a club yet."
            color="textMid"
            className="mb-5"
          />
          {practitionersNotInClub?.map((practitioner) => (
            <CheckboxGroup<PractitionerDto>
              className="mb-2"
              key={practitioner.id}
              title={`${practitioner.user?.firstName} ${practitioner.user?.surname}`}
              titleWeight="semibold"
              checked={selectedPractitioners?.some(
                (option) => practitioner.id === option.practitionerId
              )}
              value={practitioner}
              icon={
                <div className="ml-4 mr-2">
                  {practitioner.user?.profileImageUrl ? (
                    <Avatar dataUrl={practitioner.user?.profileImageUrl} />
                  ) : (
                    <UserAvatar
                      className="mr-4"
                      size="md"
                      avatarColor="var(--primaryAccent2)"
                      text={`${practitioner?.user?.firstName?.charAt(
                        0
                      )}${practitioner?.user?.surname?.charAt(0)}`}
                      displayBorder
                    />
                  )}
                </div>
              }
              isIconFullWidth
              onChange={onCheckboxChange}
            />
          ))}
        </div>
      )}
    </>
  );
};
