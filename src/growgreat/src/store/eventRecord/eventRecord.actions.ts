import { EventRecord } from '@/services/EventRecordService';
import { EventRecordModelInput } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';

export const EventRecordActions = {
  ADD_EVENT_RECORD: 'addEventRecord',
};

export const addEventRecord = createAsyncThunk<
  any,
  {
    input: EventRecordModelInput;
    isCloseFolder?: boolean;
  },
  ThunkApiType<RootState>
>(
  EventRecordActions.ADD_EVENT_RECORD,
  async ({ input, isCloseFolder }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        await new EventRecord(userAuth?.auth_token).addEventRecord(input);

        if (isCloseFolder) {
          return { isCloseFolder, input };
        }

        return;
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
