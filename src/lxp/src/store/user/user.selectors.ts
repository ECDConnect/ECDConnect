import { ContentConsentTypeEnum, UserConsentDto, UserDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';

export const getUser = (state: RootState): UserDto | undefined =>
  state.user.user;

export const getUserUnstableConnection = (state: RootState): boolean =>
  state.user.unstableConnection;

// YOU CAN USE THIS TO FETCH IF THE USER HAS CONSENTED TO A PIECE OF CONTENT (EXAMPLE FOR CHILD PHOTO)
export const getUserConsentByType = (
  userId?: string,
  consentType?: ContentConsentTypeEnum
) =>
  createSelector(
    (state: RootState) => ({
      userConsent: state.user.userConsent,
      consentList: state.contentConsentData.consent,
    }),
    ({ userConsent, consentList }) => {
      if (!userConsent || !userId || !consentType || !consentList?.length)
        return;

      const consentData = consentList.find((cc) => cc.name === consentType);

      return userConsent.find(
        (uc) => uc.userId === userId && uc.consentId === consentData?.id
      );
    }
  );

export const getUserConsent = (userId?: string) =>
  createSelector(
    (state: RootState) => state.user.userConsent,
    (userConsent: UserConsentDto[] | undefined) => {
      if (!userConsent || !userId) return;

      return userConsent.find((uc) => uc.userId === userId);
    }
  );
