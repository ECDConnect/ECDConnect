import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { syncActions } from '.';
import { analyticsThunkActions } from '../analytics';
import { caregiverThunkActions } from '../caregiver';
import { documentThunkActions } from '../document';
import { notesThunkActions } from '../notes';
import { RootState, ThunkApiType } from '../types';
import { userThunkActions } from '../user';

import { SyncOfflineDataProps, SyncOfflineDataReturnType } from './sync.types';

type SyncStep = {
  title: string;
  action: AsyncThunk<boolean[], any, any>;
};
export const syncOfflineData = createAsyncThunk<
  SyncOfflineDataProps,
  SyncOfflineDataReturnType,
  ThunkApiType<RootState>
>('sync/offlineData', async (any, { rejectWithValue, dispatch }) => {
  const syncSteps: SyncStep[] = [
    {
      title: 'Practitioner',
      action: userThunkActions.updateUser,
    },
    {
      title: 'Care givers',
      action: caregiverThunkActions.upsertCareGivers,
    },
    {
      title: 'Notes',
      action: notesThunkActions.upsertNotes,
    },
    {
      title: 'Documents',
      action: documentThunkActions.createDocument,
    },
    {
      title: 'User Consent',
      action: userThunkActions.upsertUserConsents,
    },
    {
      title: 'Analytics',
      action: analyticsThunkActions.pushAnalytics,
    },
  ];

  let error: Error | null = null;

  for (let i = 0; i < syncSteps.length; i++) {
    const step = syncSteps[i];

    dispatch(
      syncActions.setCurrentActionState({
        title: step.title,
        step: i + 1,
        stepTotal: syncSteps.length,
      })
    );

    try {
      await dispatch(step.action({})).unwrap();
    } catch (err) {
      console.error(err);
      dispatch(syncActions.setError((err as Error).message));
      error = err as Error;
      break;
    }
  }

  if (error) {
    return rejectWithValue(error.message);
  }
});
