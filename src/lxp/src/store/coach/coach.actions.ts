import {
  ApplicationUserInput,
  CoachInput,
  SiteAddressInput,
} from '@ecdlink/graphql';
import { CoachDto, SiteAddressDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { SiteAddressService } from '@/services/SiteAddressService';
import { CoachService } from '@/services/CoachService';
import { RootState, ThunkApiType } from '../types';

export const CoachActions = {
  GET_COACH_BY_COACH_ID: 'getCoachByCoachId',
};

export const getCoachByUserId = createAsyncThunk<
  CoachDto,
  {},
  ThunkApiType<RootState>
>(
  'getCoachByUserId',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      coach: { coach: coachCache },
    } = getState();

    if (!coachCache) {
      try {
        let coach: CoachDto | undefined;

        if (userAuth?.auth_token) {
          coach = await new CoachService(
            userAuth?.auth_token
          ).getCoachByCoachId(userAuth.id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!coach) {
          return rejectWithValue('getCoachByUserId: Error getting coach');
        }
        return coach;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return coachCache;
    }
  }
);

export const getCoachByCoachId = createAsyncThunk<
  CoachDto,
  { coachId: string; forceUpdate?: boolean },
  ThunkApiType<RootState>
>(
  CoachActions.GET_COACH_BY_COACH_ID,
  async ({ coachId, forceUpdate }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      coach: { coach: coachCache },
    } = getState();

    if (!coachCache || forceUpdate) {
      try {
        let coach: CoachDto | undefined;

        if (userAuth?.auth_token) {
          coach = await new CoachService(
            userAuth?.auth_token
          ).getCoachByCoachId(coachId);
        } else {
          return rejectWithValue('no access token, profile check required');
        }
        if (!coach) {
          return rejectWithValue('getCoachByCoachId: Error getting coach');
        }
        return coach;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return coachCache;
    }
  }
);

export const coachNameByUserId = createAsyncThunk<
  CoachDto,
  { coachId: string },
  ThunkApiType<RootState>
>(
  'coachNameByUserId',
  // eslint-disable-next-line no-empty-pattern
  async ({ coachId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      coach: { coach: coachCache },
    } = getState();

    if (!coachCache) {
      try {
        let coach: CoachDto | undefined;

        if (userAuth?.auth_token) {
          coach = await new CoachService(
            userAuth?.auth_token
          ).getCoachByCoachId(coachId);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!coach) {
          return rejectWithValue('Error getting coach name');
        }
        return coach;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return coachCache;
    }
  }
);

export const updateCoach = createAsyncThunk<
  boolean[],
  {},
  ThunkApiType<RootState>
>(
  'updateCoach',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      coach: { coach },
    } = getState();

    try {
      let update: boolean | undefined;

      if (userAuth?.auth_token && coach) {
        const coachModelInput: CoachInput = mapCoach(coach);

        if (coach.siteAddress?.id) {
          const addressInput = mapSiteAddress(coach.siteAddress);

          await new SiteAddressService(userAuth?.auth_token).updateSiteAddress(
            coach.siteAddress.id ?? '',
            addressInput
          );

          coachModelInput.SiteAddressId = addressInput.Id;
        }

        coachModelInput.UserId = userAuth.id;
        coachModelInput.SiteAddressId = null;
        coachModelInput.User = {
          id: coach.user?.id,
          email: coach.user?.email,
          emailConfirmed: false,
          phoneNumberConfirmed: false,
          twoFactorEnabled: false,
          dateOfBirth: new Date(),
          isSouthAfricanCitizen: coach.user?.isSouthAfricanCitizen,
          isActive: true,
          lastSeen: new Date(),
          verifiedByHomeAffairs: coach.user?.verifiedByHomeAffairs,
        } as unknown as ApplicationUserInput;

        update = await new CoachService(userAuth?.auth_token).updateCoach(
          coachModelInput.Id,
          coachModelInput
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!update) {
        return rejectWithValue('Error updating user');
      }

      return [update];
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(err);
    }
  }
);

const mapCoach = (coach: Partial<CoachDto>): CoachInput => ({
  SecondaryAreaOfOperation: coach.secondaryAreaOfOperation,
  SigningSignature: coach.signingSignature || undefined,
  SiteAddressId: coach.siteAddressId || undefined,
  SiteAddress: coach.siteAddress ? mapSiteAddress(coach.siteAddress!) : null,
  StartDate: coach.startDate || undefined,
  AreaOfOperation: coach.areaOfOperation,
  IsActive: coach.isActive || false,
  UserId: coach.userId,
  Id: coach.id,
});

const mapSiteAddress = (
  address: Partial<SiteAddressDto>
): SiteAddressInput => ({
  Id: address.id,
  AddressLine1: address.addressLine1,
  AddressLine2: address.addressLine2,
  AddressLine3: address.addressLine3,
  Name: address.name,
  PostalCode: address.postalCode,
  ProvinceId: address.provinceId,
  Ward: address.ward,
  IsActive: address.isActive === false ? false : true,
});
