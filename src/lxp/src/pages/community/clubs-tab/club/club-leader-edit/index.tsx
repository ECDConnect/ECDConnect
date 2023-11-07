import {
  Alert,
  Avatar,
  BannerWrapper,
  Button,
  Checkbox,
  Radio,
  Typography,
  UserAvatar,
} from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import ROUTES from '@/routes/routes';
import { useSnackbar } from '@ecdlink/core';
import { ClubsRouteState } from '../../index.types';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store';
import { NewClubLeaderInput } from '@/services/ClubService/types';
import {
  ClubActions,
  addNewClubLeader,
  getClubById,
} from '@/store/club/club.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { userSelectors } from '@/store/user';

export const ClubLeaderEdit: React.FC = () => {
  const [newLeaderId, setNewLeaderId] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);

  const appDispatch = useAppDispatch();
  const { clubId } = useParams<ClubsRouteState>();
  const location = useLocation();
  const lastPathSegment = location.pathname.split('/').pop();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const user = useSelector(userSelectors.getUser);

  const isToChange = lastPathSegment?.includes('edit');

  const previousClubLeader = club.clubLeader;

  const newLeader = club.clubMembers.find(
    (member) => member.practitionerId === newLeaderId
  );
  const newLeaderFirstName = newLeader?.firstName;
  const availableMembers = club?.clubMembers?.filter(
    (member) =>
      member.practitionerId !== previousClubLeader?.practitionerId &&
      member.practitionerId !== club.incomingClubLeader?.practitionerId
  );

  const {
    isLoading: isLoadingAddLeader,
    isRejected: isRejectedAddLeader,
    error: errorAddLeader,
  } = useThunkFetchCall('clubs', ClubActions.ADD_NEW_CLUB_LEADER);
  const {
    isLoading: isLoadingClub,
    wasLoading: wasLoadingClub,
    isRejected: isRejectedGetClub,
    error: errorGetClub,
  } = useThunkFetchCall('clubs', ClubActions.GET_CLUB_BY_ID);

  const isLoading = isLoadingAddLeader || isLoadingClub;
  const isRejected = isRejectedAddLeader || isRejectedGetClub;
  const error = errorAddLeader || errorGetClub;

  const history = useHistory();

  const { showMessage } = useSnackbar();

  const onSubmit = async () => {
    const payload: NewClubLeaderInput = {
      clubId,
      practitionerId: newLeaderId,
    };

    // TODO update this call to return the new club leader and set it in state
    await appDispatch(addNewClubLeader(payload));

    await appDispatch(getClubById({ clubId: clubId }));
  };

  useEffect(() => {
    if (wasLoadingClub && !isLoadingClub) {
      if (isRejected) {
        showMessage({ message: error, type: 'error' });
      }

      if (!isRejectedAddLeader) {
        showMessage({ message: 'Club leader request sent!' });
        history.push(
          ROUTES.COMMUNITY.CLUB.MEMBERS.ROOT.replace(':clubId', clubId)
        );
      }
    }
  }, [
    clubId,
    error,
    history,
    isLoadingClub,
    isRejected,
    isRejectedAddLeader,
    showMessage,
    wasLoadingClub,
  ]);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={`${isToChange ? 'Change' : 'Assign'} club leader`}
      subTitle="step 1 of 1"
      onBack={() => history.goBack()}
    >
      <Typography
        type="h2"
        text={isToChange ? 'Choose a new club leader' : 'Assign club leader'}
        className="mb-4"
      />
      <fieldset className="mb-4 flex flex-col gap-2">
        {availableMembers?.map((member) => (
          <Radio
            key={member.practitionerId}
            description={`${member.firstName} ${member.surname}`}
            value={member.practitionerId}
            checked={newLeaderId === member.practitionerId}
            onChange={() => setNewLeaderId(member.practitionerId)}
            className="mb-4"
            variant="slim"
            customIcon={
              <div className="mx-2">
                {!!member.profileImageUrl ? (
                  <Avatar dataUrl={member.profileImageUrl} />
                ) : (
                  <UserAvatar
                    className="mr-4"
                    size="md"
                    avatarColor="var(--primaryAccent2)"
                    text={`${member.firstName.charAt(0)}${member.surname.charAt(
                      0
                    )}`}
                    displayBorder
                  />
                )}
              </div>
            }
          />
        ))}
      </fieldset>
      {!!newLeaderId && (
        <>
          <Checkbox
            description={`I confirm that all club members have agreed to have ${newLeaderFirstName} as their next club leader.`}
            descriptionColor="textMid"
            checked={checkboxValue}
            onCheckboxChange={() => setCheckboxValue(!checkboxValue)}
          />
          <Alert
            className="my-4"
            type="info"
            title={
              isToChange
                ? `The previous club leader (${previousClubLeader.firstName}) and the new club leader (${newLeaderFirstName}) chosen above will be notified immediately.`
                : `${newLeaderFirstName} will be notified immediately and asked to complete the club leader agreement.`
            }
            list={
              isToChange
                ? [
                    `${newLeaderFirstName} will be asked to accept the club leader agreement.`,
                  ]
                : []
            }
          />
        </>
      )}
      <Button
        className="mt-auto"
        icon="SaveIcon"
        type="filled"
        color="primary"
        textColor="white"
        text="Save"
        isLoading={isLoading}
        disabled={!newLeaderId || !checkboxValue || isLoading}
        onClick={onSubmit}
      />
    </BannerWrapper>
  );
};
