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
import { useAppDispatch } from '@/store';
import { NewClubMemberInput } from '@ecdlink/graphql';
import { addNewClubMembers } from '@/store/club/club.actions';

export const ClubMemberAdd: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();

  const [selectedClubId, setSelectedClubId] = useState<string | undefined>(
    undefined
  );

  const allClubs = useSelector(clubSelectors.getAllClubsForCoachSelector);

  const { practitionerId } = useParams<ClubsRouteState>();

  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerId ?? '')
  );
  const firstName = practitioner?.user?.firstName ?? '';

  const onSubmit = async () => {
    if (!!selectedClubId) {
      const payload: NewClubMemberInput = {
        clubId: selectedClubId,
        practitionerIds: [practitioner?.id],
      };

      await appDispatch(addNewClubMembers({ input: payload }));
      // TODO need to refresh practitioner and club ???

      history.goBack();
    }
  };

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
      <Dropdown<string>
        label={`Which club would you like to add ${firstName} to?`}
        placeholder="Tap to select club..."
        list={allClubs.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        selectedValue={selectedClubId}
        onChange={(club) => setSelectedClubId(club)}
        className="my-4"
      />
      <Alert
        type="info"
        title={`${firstName} will be added & notified immediately.`}
      />
      <Button
        className="mt-auto"
        icon="SaveIcon"
        type="filled"
        color="primary"
        textColor="white"
        text="Save"
        disabled={!selectedClubId}
        onClick={onSubmit}
      />
    </BannerWrapper>
  );
};
