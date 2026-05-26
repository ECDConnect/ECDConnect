import { InviteDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { InvitesState } from './invites.types';
import { getInvitesByPrincipalId } from './invites.actions';

const initialState: InvitesState = {};

const invitesSlice = createSlice({
  name: 'invites',
  initialState,
  reducers: {
    resetInvitesState: (state) => {
      state.invites = initialState.invites;
    },
    createInvite: (state, action: PayloadAction<InviteDto>) => {
      if (!state.invites) state.invites = [];
      state.invites?.push({ ...action.payload, synced: false });
    },
    updateInvite: (state, action: PayloadAction<InviteDto>) => {
      if (state.invites) {
        for (let i = 0; i < state.invites.length; i++) {
          if (state.invites[i].id === action.payload.id)
            state.invites[i] = { ...action.payload, synced: false };
        }
      }
    },
    deleteInvite: (state, action: PayloadAction<InviteDto>) => {
      if (state.invites) {
        const inviteIndex = state.invites.findIndex(
          (x) => x.id === action.payload.id
        );

        if (inviteIndex < 0) return;

        state.invites[inviteIndex].isActive = false;
        state.invites[inviteIndex].synced = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInvitesByPrincipalId.fulfilled, (state, action) => {
      state.invites = action.payload.map((invite) => ({
        ...invite,
        synced: true,
      }));
    });
  },
});

const { reducer: invitesReducer, actions: invitesActions } = invitesSlice;

const invitesPersistConfig = {
  key: 'invites',
  storage: localForage,
  blacklist: [],
};

export { invitesPersistConfig, invitesReducer, invitesActions };
