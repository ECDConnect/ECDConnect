import { PractitionerDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PractitionerService } from '@services/PractitionerService';
import { RootState, ThunkApiType } from '../types';

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

export const getAllPractitioners = createAsyncThunk<
  PractitionerDto[],
  {},
  ThunkApiType<RootState>
>(
  'getAllPractitioners',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let practitioners: PractitionerDto[] | undefined;

      if (userAuth?.auth_token) {
        practitioners = await new PractitionerService(
          userAuth?.auth_token
        ).getAllPractitioners();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!practitioners) {
        return rejectWithValue('Error getting practitioner');
      }

      return practitioners;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
