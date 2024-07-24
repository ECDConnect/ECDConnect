import {
  Avatar,
  CheckboxChange,
  CheckboxGroup,
  Typography,
  UserAvatar,
} from '@ecdlink/ui';
import { ClubMembersAddProps, Member } from '..';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { practitionerSelectors } from '@/store/practitioner';
import { PractitionerDto } from '@ecdlink/core';
import { useParams } from 'react-router';
import { ClubsRouteState } from '../../../index.types';

export const Step1 = ({
  setIsEnabledButton,
  setSelectedMembers,
}: ClubMembersAddProps) => {
  const [selectedPractitioners, setSelectedPractitioners] =
    useState<Member[]>();

  const { clubId } = useParams<ClubsRouteState>();
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
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
        (member) => practitioner.id === member.practitionerId
      )
  );

  const onCheckboxChange = (event: CheckboxChange) => {
    const value = event.value as PractitionerDto;
    if (event.checked) {
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

      setSelectedMembers?.(currentPractitioners);
      return setSelectedPractitioners(currentPractitioners);
    }

    const currentPractitioners = selectedPractitioners?.filter(
      (item) => item.practitionerId !== value?.id
    );

    setSelectedMembers?.(currentPractitioners || []);
    return setSelectedPractitioners(currentPractitioners);
  };

  useEffect(() => {
    setIsEnabledButton(true);
  }, [setIsEnabledButton]);

  return (
    <>
      <Typography
        className="mb-5"
        type="h2"
        text={`Add SmartStarters to ${club?.name} club`}
      />
      <Typography className="mb-1" type="h4" text="Add club members" />
      <Typography
        className="mb-4"
        type="help"
        text="These are all the SmartStarters who are not in a club yet."
        color="textMid"
      />
      <div className="mb-4">
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
    </>
  );
};
