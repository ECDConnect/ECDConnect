import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ThunkActionStatuses, ThunkStateStatus } from './types';

export const setThunkActionStatus = (
  builder: ActionReducerMapBuilder<any & ThunkStateStatus>,
  action: any
) =>
  builder
    .addCase(action.pending, (state) => {
      state.status = ThunkActionStatuses.Pending;
    })
    .addCase(action.rejected, (state) => {
      state.status = ThunkActionStatuses.Rejected;
    });
