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
import {
  practitionerActions,
  practitionerSelectors,
} from '@/store/practitioner';
import { useAppDispatch } from '@/store';
import { NewClubMemberInput } from '@ecdlink/graphql';
import { ClubActions, addNewClubMembers } from '@/store/club/club.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useSnackbar } from '@ecdlink/core';

export const ClubMemberAdd: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();

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
    if (!!selectedClubId && !!practitioner) {
      const payload: NewClubMemberInput = {
        clubId: selectedClubId,
        practitionerIds: [practitioner.id],
      };

      appDispatch(addNewClubMembers({ input: payload })).then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          showMessage({
            message: `Error adding ${firstName} to club`,
            type: 'error',
          });
        } else {
          showMessage({
            message: `${firstName} added to club`,
            type: 'success',
          });

          appDispatch(
            practitionerActions.updateClubForPractitioner({
              practitionerId: practitioner.id!,
              clubId: selectedClubId,
            })
          );

          history.goBack();
        }
      });
    }
  };

  const { isLoading: isLoadingAddMember } = useThunkFetchCall(
    'clubs',
    ClubActions.ADD_NEW_CLUB_MEMBERS
  );

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
        disabled={!selectedClubId || isLoadingAddMember}
        onClick={onSubmit}
      />
    </BannerWrapper>
  );
};
