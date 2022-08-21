import { PractitionerDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PractitionerService } from '@services/PractitionerService';
import { RootState, ThunkApiType } from '../types';

export const getAllPractitioner = createAsyncThunk<
  PractitionerDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getAllPractitioner',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      practitioner: { practitioners: practitionersCache },
    } = getState();

    if (!practitionersCache) {
      try {
        let practitioners: PractitionerDto[] | undefined;

        if (userAuth?.auth_token) {
          practitioners = await new PractitionerService(
            userAuth?.auth_token
          ).getAllPractitioner();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        return practitioners;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return practitionersCache;
    }
  }
);

export const getPractitionersForCoach = createAsyncThunk<
  PractitionerDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getPractitionersForCoach',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      practitioner: { practitioners: practitionersCache },
    } = getState();

    if (!practitionersCache) {
      try {
        let practitioners: PractitionerDto[] | undefined;

        if (userAuth?.auth_token) {
          practitioners = await new PractitionerService(
            userAuth?.auth_token
          ).getPractitionersForCoach(userAuth?.id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        return practitioners;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return practitionersCache;
    }
  }
);

export const getPractitionerById = createAsyncThunk<
  PractitionerDto,
  { id: number },
  ThunkApiType<RootState>
>(
  'getPractitionerById',
  // eslint-disable-next-line no-empty-pattern
  async ({ id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      practitioner: { practitioner: practitionerCache },
    } = getState();

    if (!practitionerCache) {
      try {
        let practitioner: PractitionerDto | undefined;

        if (userAuth?.auth_token) {
          practitioner = await new PractitionerService(
            userAuth?.auth_token
          ).getPractitionerById(id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!practitioner) {
          return rejectWithValue('Error getting practitioner');
        }

        return practitioner;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return practitionerCache;
    }
  }
);
