import { InfantDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus, ThunkActionStatuses } from '../types';
import { setThunkActionStatus } from '../utils';
import { getInfants, addInfant } from './infant.actions';
import { InfantState } from './infant.types';

const initialState: InfantState & ThunkStateStatus = {
  status: ThunkActionStatuses.Unset,
};

const infantSlice = createSlice({
  name: 'infant',
  initialState,
  reducers: {
    resetInfantState: (state) => {
      state.infants = initialState.infants;
    },
    addInfant: (state, action: PayloadAction<InfantDto>) => {
      if (!state.infants) state.infants = [];
      state.infants?.push(action.payload);
    },
    updateInfant: (state, action: PayloadAction<InfantDto>) => {
      if (state.infants) {
        for (let i = 0; i < state.infants.length; i++) {
          if (state.infants[i].id === action.payload.id)
            state.infants[i] = action.payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, addInfant);
    builder.addCase(addInfant.fulfilled, (state) => {
      state.status = ThunkActionStatuses.Fulfilled;
    });
    builder.addCase(getInfants.fulfilled, (state, action) => {
      if (!state.infants) {
        const infants = Object.assign([], action.payload) as InfantDto[];

        for (let i = 0; i < infants.length; i++) {
          infants[i].isActive = true;
        }

        state.infants = infants;
      }
    });
  },
});

const { reducer: infantReducer, actions: infantActions } = infantSlice;

const infantPersistConfig = {
  key: 'infant',
  storage: localForage,
  blacklist: [],
};

export { infantPersistConfig, infantReducer, infantActions };
