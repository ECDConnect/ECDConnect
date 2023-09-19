import {
  Avatar,
  CheckboxChange,
  CheckboxGroup,
  Typography,
  UserAvatar,
} from '@ecdlink/ui';
import { mockedClub } from '../../individual-club-view';
import { ClubMembersEditProps } from '..';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { ClubsRouteState } from '../../../index.types';
import { clubSelectors } from '@/store/club';
import { ClubMember } from '@ecdlink/graphql';

export const Step1 = ({
  setIsEnabledButton,
  selectedMembers,
  setSelectedMembers,
}: ClubMembersEditProps) => {
  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));

  const onChange = (event: CheckboxChange) => {
    const value = event.value as ClubMember | undefined;
    if (event.checked) {
      const currentPractitioners = selectedMembers
        ? [...selectedMembers, value]
        : [value];

      return setSelectedMembers?.(currentPractitioners);
    }
    const currentPractitioners = selectedMembers?.filter(
      (item) => item?.practitioner?.id !== value?.practitioner?.id
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
        text={`Which ${mockedClub.name} members would you like to move?`}
      />
      <div className="mb-4">
        {club?.clubMembers?.map((member) => (
          <CheckboxGroup<ClubMember>
            className="mb-2"
            key={member?.practitioner?.id}
            title={`${member?.practitioner?.user?.firstName} ${member?.practitioner?.user?.surname}`}
            titleWeight="semibold"
            icon={
              <div className="ml-4 mr-2">
                {member?.practitioner?.user?.profileImageUrl ? (
                  <Avatar
                    dataUrl={member?.practitioner?.user?.profileImageUrl}
                  />
                ) : (
                  <UserAvatar
                    className="mr-4"
                    size="md"
                    avatarColor="var(--primaryAccent2)"
                    text={`${member?.practitioner?.user?.firstName?.charAt(
                      0
                    )}${member?.practitioner?.user?.surname?.charAt(0)}`}
                    displayBorder
                  />
                )}
              </div>
            }
            isIconFullWidth
            value={member as ClubMember}
            checked={selectedMembers?.some(
              (option) => member?.practitioner?.id === option?.practitioner?.id
            )}
            onChange={onChange}
          />
        ))}
      </div>
    </>
  );
};
