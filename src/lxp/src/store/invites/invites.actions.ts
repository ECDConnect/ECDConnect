import { InviteDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { InviteService } from '@/services/InviteService';
import { RootState, ThunkApiType } from '../types';

export const getInvitesByPrincipalId = createAsyncThunk<
  InviteDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getInvitesByPrincipalId', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    invitesData: { invites: invitesCache },
  } = getState();

  try {
    let invites: InviteDto[] | undefined;

    if (userAuth?.auth_token) {
      const response = await new InviteService(
        userAuth?.auth_token
      ).getInvitesByPrincipalId(userAuth.id);

      invites = response.filter((invite) => invite.isAccepted !== true);
    } else {
      return rejectWithValue('no access token, profile check required');
    }

    if (!invites) {
      return rejectWithValue('Error getting invites');
    }

    return invites;
  } catch (err) {
    return rejectWithValue(err);
  }
});
