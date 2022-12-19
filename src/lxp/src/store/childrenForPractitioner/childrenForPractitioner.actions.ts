import { ChildDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChildService } from '@services/ChildService';
import { RootState, ThunkApiType } from '../types';

export const getChildrenForPractitioner = createAsyncThunk<
  ChildDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { id: string },
  ThunkApiType<RootState>
>(
  'getChildrenForPractitioner',
  // eslint-disable-next-line no-empty-pattern
  async ({ id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      children: { children: childrenCache },
    } = getState();

    let children: ChildDto[] | undefined;

    if (userAuth?.auth_token) {
      children = await new ChildService(
        userAuth?.auth_token
      ).getChildrenForPractitioner(id);
    } else {
      return rejectWithValue('no access token, profile check required');
    }

    return children;
  }
);
