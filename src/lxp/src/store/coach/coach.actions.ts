import { createAsyncThunk } from '@reduxjs/toolkit';
import { CoachInput, SiteAddressInput } from '@ecdlink/graphql';

import { SiteAddressService } from '@/services/SiteAddressService';
import { CoachDto, SiteAddressDto } from '@ecdlink/core';
import { CoachService } from '@/services/CoachService';
import { RootState, ThunkApiType } from '../types';

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
          coach = await new CoachService(userAuth?.auth_token).getCoachByUserId(
            userAuth.id
          );
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!coach) {
          return rejectWithValue('Error getting coach');
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

        if (coach.siteAddress) {
          const addressInput = mapSiteAddress(coach.siteAddress);

          await new SiteAddressService(userAuth?.auth_token).updateSiteAddress(
            coach.siteAddress.id ?? '',
            addressInput
          );

          coachModelInput.SiteAddressId = addressInput.Id;
        }

        update = await new CoachService(userAuth?.auth_token).updateCoach(
          userAuth.id,
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
      return rejectWithValue(err);
    }
  }
);

const mapCoach = (coach: Partial<CoachDto>): CoachInput => ({
  SigningSignature: coach.signingSignature || undefined,
  SiteAddressId: coach.siteAddressId || undefined,
  IsActive: coach.isActive || false,
  FranchisorId: coach.franchisorId,
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
