import { MotherDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  // addMother,
  getMothers,
  // updateMother
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
    builder.addCase(getMothers.fulfilled, (state, action) => {
      if (!state.mothers) {
        const mothers = Object.assign([], action.payload) as MotherDto[];

        for (let i = 0; i < mothers.length; i++) {
          mothers[i].isActive = true;
        }
        state.mothers = mothers;
      }
    });
    //   builder.addCase(
    //     updateMother.fulfilled,
    //     (state, action: PayloadAction<MotherDto>) => {
    //       if (state.mothers) {
    //         const motherIndex = state.mothers.findIndex(
    //           (mother) => mother.id === action.payload.id
    //         );

    //         if (motherIndex < 0) return;

    //         state.mothers[motherIndex] = action.payload;
    //       }
    //     }
    //   );
    //   builder.addCase(
    //     createMother.fulfilled,
    //     (state, action: PayloadAction<MotherDto>) => {
    //       if (!state.mothers) state.mothers = [];
    //       state.mothers?.push(action.payload);
    //     }
    //   );
  },
});

const { reducer: motherReducer, actions: motherActions } = motherSlice;

const motherPersistConfig = {
  key: 'mother',
  storage: localForage,
  blacklist: [],
};

export { motherPersistConfig, motherReducer, motherActions };
