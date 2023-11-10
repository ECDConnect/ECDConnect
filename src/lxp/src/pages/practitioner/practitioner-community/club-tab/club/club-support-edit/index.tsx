import {
  Alert,
  BannerWrapper,
  Button,
  Checkbox,
  Radio,
  Typography,
  UserAvatar,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getClubForPractitionerSelector } from '@/store/club/club.selectors';
import { useAppDispatch } from '@/store';
import { ClubActions, changeClubSupportRole } from '@/store/club/club.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useSnackbar } from '@ecdlink/core';
import ROUTES from '@/routes/routes';
import { ClubDto } from '@/models/club/club.dto';
import { clubActions } from '@/store/club';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const SupportRoleEdit: React.FC = () => {
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>();

  const location = useLocation();
  const lastPathSegment = location.pathname.split('/').pop();

  const isToChange = lastPathSegment?.includes('edit');

  const history = useHistory();

  const appDispatch = useAppDispatch();

  const { isOnline } = useOnlineStatus();

  const club = useSelector(getClubForPractitionerSelector);

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.CHANGE_CLUB_SUPPORT_ROLE
  );
  const { showMessage } = useSnackbar();

  const selectedMember = club?.clubMembers?.find(
    (member) => member?.practitionerId === selectedMemberId
  );

  const onSubmit = async () => {
    const payload: ClubDto['clubSupport'] = {
      practitionerId: selectedMemberId ?? '',
      firstName: selectedMember?.firstName ?? '',
      surname: selectedMember?.surname ?? '',
      phoneNumber: selectedMember?.phoneNumber ?? '',
      profileImageUrl: selectedMember?.profileImageUrl ?? '',
      userId: selectedMember?.userId ?? '',
      dateAssigned: new Date().toISOString(),
    };

    appDispatch(clubActions.changeClubSupportRole(payload));

    if (isOnline) {
      await appDispatch(
        changeClubSupportRole({
          clubId: club?.id ?? '',
          practitionerId: selectedMemberId ?? '',
        })
      );
    }
  };

  useEffect(() => {
    if (wasLoading && !isLoading) {
      if (isRejected) {
        showMessage({
          message: error?.message ?? '',
          type: 'error',
        });
      } else {
        showMessage({
          message: 'Club support role updated!',
          type: 'success',
        });
        history.push(ROUTES.PRACTITIONER.COMMUNITY.ROOT);
      }
    }
  }, [error?.message, history, isLoading, isRejected, showMessage, wasLoading]);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={`${isToChange ? 'Change' : 'Assign'} club support`}
      subTitle="step 1 of 1"
      onBack={() => history.goBack()}
      displayOffline={!isOnline}
    >
      <Typography
        type="h2"
        text="Choose a new club member for the support role"
        className="mb-4"
      />
      <Alert
        className="my-4"
        type="info"
        title="This should be someone who can support you by taking attendance and adding events when you can’t."
      />
      <fieldset className="mb-4 flex flex-col gap-2">
        {club?.clubMembers
          ?.filter((member) => member?.userId !== club?.clubSupport?.userId)
          ?.map((member) => (
            <Radio
              key={member?.userId}
              description={`${member?.firstName} ${member?.surname}`}
              value={member?.practitionerId}
              checked={selectedMemberId === member?.practitionerId}
              onChange={(event) => setSelectedMemberId(event.target.value)}
              className="mb-4"
              variant="slim"
              customIcon={
                <UserAvatar
                  className="mr-4"
                  size="md"
                  avatarColor="var(--primaryAccent2)"
                  text={member?.firstName[0] + member?.surname[0]}
                  displayBorder
                />
              }
            />
          ))}
      </fieldset>
      {selectedMemberId && (
        <>
          <Checkbox
            description={`I confirm that I have discussed this with ${selectedMember?.firstName}.`}
            descriptionColor="textMid"
            checked={checkboxValue}
            onCheckboxChange={() => setCheckboxValue(!checkboxValue)}
          />
          <Alert
            className="my-4"
            type="info"
            title={`${selectedMember?.firstName} will be notified immediately.`}
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
        disabled={isLoading || !selectedMemberId || !checkboxValue}
        onClick={onSubmit}
      />
    </BannerWrapper>
  );
};
