import { createSlice } from '@reduxjs/toolkit';
import { ThunkActionStatuses } from '../types';
import {
  syncOfflineData,
  syncOfflineDataForPractitioner,
} from './sync.actions';
import { SyncStates } from './sync.types';

const initialState: SyncStates = {
  status: ThunkActionStatuses.Unset,
  currentAction: '',
  currentStep: 0,
  stepTotal: 0,
  error: '',
};

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setCurrentActionState: (state, action) => {
      const { title, step, stepTotal } = action.payload;
      state.currentAction = title;
      state.currentStep = step;
      state.stepTotal = stepTotal;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetSyncState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(syncOfflineData.fulfilled, (state, action) => {
      state.status = ThunkActionStatuses.Fulfilled;
    });
    builder.addCase(syncOfflineData.pending, (state, action) => {
      state.status = ThunkActionStatuses.Pending;
    });
    builder.addCase(syncOfflineData.rejected, (state, action) => {
      state.status = ThunkActionStatuses.Rejected;
    });

    builder.addCase(
      syncOfflineDataForPractitioner.fulfilled,
      (state, action) => {
        state.status = ThunkActionStatuses.Fulfilled;
      }
    );
    builder.addCase(syncOfflineDataForPractitioner.pending, (state, action) => {
      state.status = ThunkActionStatuses.Pending;
    });
    builder.addCase(
      syncOfflineDataForPractitioner.rejected,
      (state, action) => {
        state.status = ThunkActionStatuses.Rejected;
      }
    );
  },
});

const { reducer: syncReducer, actions: syncActions } = syncSlice;

export { syncReducer, syncActions };
