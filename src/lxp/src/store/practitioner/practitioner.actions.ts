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
