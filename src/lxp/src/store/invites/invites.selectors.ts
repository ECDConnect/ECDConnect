import { InviteDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';

export const getInvites = (state: RootState): InviteDto[] | undefined =>
  state.invitesData.invites?.filter(
    (invite: InviteDto) => invite.isAccepted !== true
  );

export const getInvitesByPrincipalId = (principalId?: string) =>
  createSelector(
    (state: RootState) => state.invitesData.invites || [],
    (invites: InviteDto[]) => {
      if (!invites || !principalId) return [];
      return invites
        .filter(
          (invite) =>
            invite.principalId === principalId && invite.isAccepted !== true
        )
        .sort((a, b) => (a.insertedDate! > b.insertedDate! ? -1 : 1));
    }
  );
