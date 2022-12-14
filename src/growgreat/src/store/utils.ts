import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ThunkActionStatuses } from './types';

export const setThunkActionStatus = (
  builder: ActionReducerMapBuilder<any>,
  action: any
) =>
  builder
    .addCase(action.pending, (state) => {
      state.status = ThunkActionStatuses.Pending;
    })
    .addCase(action.rejected, (state) => {
      state.status = ThunkActionStatuses.Rejected;
    });
