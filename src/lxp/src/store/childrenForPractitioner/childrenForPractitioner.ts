import { ChildDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { childrenForPractitioner } from './childrenForPractitioner.types';
import { getChildrenForPractitioner } from './childrenForPractitioner.actions';

const initialState: childrenForPractitioner = {
  childForPractitioner: undefined,
  childrenForPractitioner: undefined,
};

const childrenForPractitionerSlice = createSlice({
  name: 'childrenForPractitioner',
  initialState,
  reducers: {
    resetPractitionerState: (state) => {
      state.childForPractitioner = initialState.childForPractitioner;
      state.childrenForPractitioner = initialState.childrenForPractitioner;
    },
    updatePractitioner: (state, action: PayloadAction<ChildDto>) => {
      if (state.childForPractitioner) {
        state.childForPractitioner = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(getPractitionerById.fulfilled, (state, action) => {
    //   state.childForPractitioner = action.payload;
    // });

    builder.addCase(getChildrenForPractitioner.fulfilled, (state, action) => {
      if (!state.childrenForPractitioner) {
        const childrenForPractitioner = Object.assign(
          [],
          action.payload
        ) as ChildDto[];

        state.childrenForPractitioner = childrenForPractitioner;
      }
      // state.practitionersForCoach = action.payload;
    });
  },
});

const {
  reducer: childrenForPractitionerReducer,
  actions: childrenForPractitionerActions,
} = childrenForPractitionerSlice;

const childrenForPractitionerPersistConfig = {
  key: 'childrenForPractitioner',
  storage: localForage,
  blacklist: [],
};

export {
  childrenForPractitionerPersistConfig,
  childrenForPractitionerReducer,
  childrenForPractitionerActions,
};
