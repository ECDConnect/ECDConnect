import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getPractitionerTimeline } from './pqa.actions';
import { PQAState } from './pqa.types';

const initialState: PQAState = {};

const pqaSlice = createSlice({
  name: 'pqa',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPractitionerTimeline.fulfilled, (state, action) => {
      const practitionerId = action.meta.arg.userId;

      if (state.coachPractitionersTimeline?.length) {
        const newState = state.coachPractitionersTimeline.map((item) => {
          if (item.practitionerId === practitionerId) {
            return { ...item, timeline: action.payload };
          }

          return item;
        });

        state.coachPractitionersTimeline = newState;
      } else {
        state.coachPractitionersTimeline = [
          {
            practitionerId,
            timeline: action.payload,
          },
        ];
      }
    });
  },
});

const { reducer: pqaReducer, actions: pqaActions } = pqaSlice;

const pqaPersistConfig = {
  key: 'pqa',
  storage: localForage,
  blacklist: [],
};

export { pqaPersistConfig, pqaReducer, pqaActions };
