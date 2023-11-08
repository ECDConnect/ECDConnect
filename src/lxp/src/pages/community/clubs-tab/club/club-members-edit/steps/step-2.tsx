import { Alert, Checkbox, Dropdown, Typography } from '@ecdlink/ui';
import { ClubMembersEditProps } from '..';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { useParams } from 'react-router';
import { ClubsRouteState } from '../../../index.types';
import { DetailClubDto } from '@/models/club/club.dto';

export const Step2 = ({
  setIsEnabledButton,
  selectedMembers,
  selectedClub,
  setSelectedClub,
}: ClubMembersEditProps) => {
  const [checkboxValue, setCheckboxValue] = useState<boolean>(false);

  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const allClubs = useSelector(clubSelectors.getAllClubsForCoachSelector);

  const filteredClubs = allClubs?.filter((item) => item?.id !== club?.id);

  useEffect(() => {
    setIsEnabledButton(!!selectedClub && checkboxValue);
  }, [checkboxValue, selectedClub, setIsEnabledButton]);

  return (
    <>
      <Typography type="h2" text="Choose a club" />
      <Typography
        className="mb-5"
        type="h4"
        text="You can only move SmartStarters to an existing club."
      />
      <Dropdown<DetailClubDto>
        label="Choose a club"
        placeholder="Tap to choose a club"
        list={
          filteredClubs?.map((item) => ({
            label: item?.name ?? '',
            value: item,
          })) ?? []
        }
        selectedValue={selectedClub}
        onChange={(club) => setSelectedClub?.(club)}
        className="mb-4"
      />
      <Checkbox
        descriptionColor="textDark"
        description="I confirm that all SmartStarters selected have agreed to move to a new club."
        checked={checkboxValue}
        onCheckboxChange={(event) => setCheckboxValue(event.checked)}
      />
      <Alert
        className="mt-4"
        type="info"
        title={`The SmartStarter${
          selectedMembers?.length > 1 ? 's' : ''
        } (${selectedMembers
          .map((item) => item.firstName)
          .join(', ')}) will be moved to the new club immediately.`}
        list={['They will receive a notification about their new club.']}
      />
    </>
  );
};
