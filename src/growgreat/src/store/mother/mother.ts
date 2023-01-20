import { MotherDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getInfantCountForMonth } from '../infant/infant.actions';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import {
  addMother,
  getMotherCountForMonth,
  getMothers,
  getMotherVisits,
} from './mother.actions';
import { MotherState } from './mother.types';

const initialState: MotherState = {};

const motherSlice = createSlice({
  name: 'mother',
  initialState,
  reducers: {
    resetMotherState: (state) => {
      state.mothers = initialState.mothers;
    },
    addMother: (state, action: PayloadAction<MotherDto>) => {
      if (!state.mothers) state.mothers = [];
      state.mothers?.push(action.payload);
    },
    updateMother: (state, action: PayloadAction<MotherDto>) => {
      if (state.mothers) {
        for (let i = 0; i < state.mothers.length; i++) {
          if (state.mothers[i].id === action.payload.id)
            state.mothers[i] = action.payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, addMother);
    setThunkActionStatus(builder, getMotherCountForMonth);
    builder.addCase(getInfantCountForMonth.fulfilled, (state, action) => {
      state.motherCountForMonth = action.payload;

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addMother.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getMothers.fulfilled, (state, action) => {
      const mothers = Object.assign([], action.payload) as MotherDto[];

      for (let i = 0; i < mothers.length; i++) {
        mothers[i].isActive = true;
      }

      state.mothers = mothers;
    });
    builder.addCase(getMotherVisits.fulfilled, (state, action) => {
      state.visits = action.payload;
    });
  },
});

const { reducer: motherReducer, actions: motherActions } = motherSlice;

const motherPersistConfig = {
  key: 'mother',
  storage: localForage,
  blacklist: [],
};

export { motherPersistConfig, motherReducer, motherActions };
