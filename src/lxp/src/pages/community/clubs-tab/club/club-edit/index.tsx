import { BannerWrapper, Button, FormInput, Typography } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import ROUTES from '@/routes/routes';
import { useEffect, useState } from 'react';
import { ClubsRouteState } from '../../index.types';
import { useAppDispatch } from '@/store';
import { ClubActions, changeClubName } from '@/store/club/club.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useSnackbar } from '@ecdlink/core';

export const ClubEdit: React.FC = () => {
  const [value, setValue] = useState('');

  const history = useHistory();
  const { clubId } = useParams<ClubsRouteState>();

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.CHANGE_CLUB_NAME
  );

  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();

  const onSubmit = async () => {
    await appDispatch(changeClubName({ clubId: clubId, clubName: value }));
  };

  useEffect(() => {
    if (wasLoading && !isLoading) {
      if (isRejected) {
        showMessage({ message: error, type: 'error' });
      } else {
        showMessage({
          message: 'Club name changed successfully',
        });
        history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId));
      }
    }
  }, [clubId, error, history, isLoading, isRejected, showMessage, wasLoading]);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Change club name"
      subTitle="step 1 of 1"
      onBack={() =>
        history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId))
      }
    >
      <Typography type="h2" text="Change club name" className="mb-4" />
      <FormInput
        label="Club name"
        placeholder="Add club name..."
        hint="Do not include the word “Club” in the name."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button
        className="mt-auto"
        icon="SaveIcon"
        type="filled"
        color="primary"
        textColor="white"
        text="Save"
        isLoading={isLoading}
        disabled={!value || isLoading}
        onClick={onSubmit}
      />
    </BannerWrapper>
  );
};
