import {
  Alert,
  BannerWrapper,
  Button,
  Dropdown,
  Typography,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { useHistory, useParams } from 'react-router';
import { ClubsRouteState } from '../../index.types';
import { practitionerSelectors } from '@/store/practitioner';
import { DetailClubDto } from '@/models/club/club.dto';

export const ClubMemberAdd: React.FC = () => {
  const [selectedClub, setSelectedClub] = useState<DetailClubDto>();

  const allClubs = useSelector(clubSelectors.getAllClubsForCoachSelector);

  const history = useHistory();

  const { practitionerId } = useParams<ClubsRouteState>();

  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerId ?? '')
  );
  const firstName = practitioner?.user?.firstName ?? '';

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Add SmartStarter to a club"
      subTitle="1 of 1"
      onBack={() => history.goBack()}
    >
      <Typography type="h2" text={`Add ${firstName} to a club`} />
      <Dropdown<DetailClubDto>
        label="Which club would you like to add Bulelwa Mahlangu to?"
        placeholder="Tap to select club..."
        list={allClubs.map((item) => ({
          label: item.name,
          value: item,
        }))}
        selectedValue={selectedClub}
        onChange={(club) => setSelectedClub?.(club)}
        className="my-4"
      />
      <Alert
        type="info"
        title={`${firstName} will be added & notified immediately.`}
      />
      {/* TODO: add backend integration */}
      <Button
        className="mt-auto"
        icon="SaveIcon"
        type="filled"
        color="primary"
        textColor="white"
        text="Save"
        disabled
        onClick={() => {}}
      />
    </BannerWrapper>
  );
};
