import {
  Avatar,
  CheckboxChange,
  CheckboxGroup,
  Typography,
  UserAvatar,
} from '@ecdlink/ui';
import { ClubMembersEditProps } from '..';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { ClubsRouteState } from '../../../index.types';
import { clubSelectors } from '@/store/club';
import { ClubMember } from '@ecdlink/graphql';
import { ClubMemberDto } from '@/models/club/club.dto';

export const Step1 = ({
  setIsEnabledButton,
  selectedMembers,
  setSelectedMembers,
}: ClubMembersEditProps) => {
  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const currentLeader = useSelector(
    clubSelectors.getCurrentClubLeaderByClubIdSelector(clubId)
  );
  const nextLeader = useSelector(
    clubSelectors.getNextClubLeaderByClubIdSelector(clubId)
  );

  const onChange = (event: CheckboxChange) => {
    const value = event.value as any as ClubMemberDto;
    if (event.checked) {
      const currentPractitioners = selectedMembers
        ? [...selectedMembers, value]
        : [value];

      return setSelectedMembers?.(currentPractitioners);
    }
    const currentPractitioners = selectedMembers?.filter(
      (item) => item.practitionerId !== value?.practitionerId
    );

    return setSelectedMembers?.(currentPractitioners || []);
  };

  useEffect(() => {
    setIsEnabledButton(!!selectedMembers?.length);
  }, [selectedMembers?.length, setIsEnabledButton]);

  return (
    <>
      <Typography
        className="mb-5"
        type="h2"
        text={`Which ${club?.name} members would you like to move?`}
      />
      <div className="mb-4">
        {club?.clubMembers
          ?.filter(
            (item) =>
              item.practitionerId !== currentLeader?.practitionerId &&
              item.practitionerId !== nextLeader?.practitionerId
          )
          ?.map((member) => (
            <CheckboxGroup<ClubMemberDto>
              className="mb-2"
              key={member.practitionerId}
              title={`${member.firstName} ${member.surname}`}
              titleWeight="semibold"
              icon={
                <div className="ml-4 mr-2">
                  {member.profileImageUrl ? (
                    <Avatar dataUrl={member.profileImageUrl} />
                  ) : (
                    <UserAvatar
                      className="mr-4"
                      size="md"
                      avatarColor="var(--primaryAccent2)"
                      text={`${member.firstName?.charAt(
                        0
                      )}${member.surname.charAt(0)}`}
                      displayBorder
                    />
                  )}
                </div>
              }
              isIconFullWidth
              value={member}
              checked={selectedMembers?.some(
                (option) => member.practitionerId === option?.practitionerId
              )}
              onChange={onChange}
            />
          ))}
      </div>
    </>
  );
};
