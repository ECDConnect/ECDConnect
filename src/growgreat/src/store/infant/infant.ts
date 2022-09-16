import { InfantDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
// import { createMother, getMothers, updateMother } from './mother.actions';
import { InfantState } from './infant.types';

const initialState: InfantState = {};

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
  // extraReducers: (builder) => {
  //   builder.addCase(getMothers.fulfilled, (state, action) => {
  //     if (!state.mothers) {
  //       const mothers = Object.assign([], action.payload) as MotherDto[];

  //       for (let i = 0; i < mothers.length; i++) {
  //         mothers[i].isActive = true;
  //       }

  //       state.mothers = mothers;
  //     }
  //   });
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
  // },
});

const { reducer: infantReducer, actions: infantActions } = infantSlice;

const infantPersistConfig = {
  key: 'infant',
  storage: localForage,
  blacklist: [],
};

export { infantPersistConfig, infantReducer, infantActions };
