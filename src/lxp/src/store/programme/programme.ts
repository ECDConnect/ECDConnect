import { ProgrammeDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getProgrammes,
  getUserProgrammes,
  upsertProgrammes,
  updateProgrammes,
} from './programme.actions';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import {
  ProgrammeState,
  UpdateProgramme,
  UpdateProgrammeDay,
} from './programme.types';

const initialState: ProgrammeState = {
  programmes: undefined,
};

const programmeSlice = createSlice({
  name: 'programme',
  initialState,
  reducers: {
    resetProgrammeState: (state) => {
      state.programmes = initialState.programmes;
    },
    createProgramme: (state, action: PayloadAction<ProgrammeDto>) => {
      if (!state.programmes) state.programmes = [];

      state.programmes?.push(action.payload);
    },
    upsertProgrammes: (state, action: PayloadAction<UpdateProgramme>) => {
      if (state.programmes) {
        for (let i = 0; i < state.programmes.length; i++) {
          if (state.programmes[i].id === action.payload.programme.id)
            state.programmes[i] = action.payload.programme;
        }
      } else {
        state.programmes = [];
        state.programmes?.push(action.payload.programme);
      }
    },
    updateProgrammes: (state, action: PayloadAction<UpdateProgramme>) => {
      if (state.programmes) {
        for (let i = 0; i < state.programmes.length; i++) {
          if (state.programmes[i].id === action.payload.programme.id)
            state.programmes[i] = {
              ...action.payload.programme,
              synced: false,
            };
        }
      } else {
        state.programmes = [];
        state.programmes?.push(action.payload.programme);
      }
    },
    updateProgrammeDay: (state, action: PayloadAction<UpdateProgrammeDay>) => {
      if (!state.programmes) return;
      const indexOfProgramme = state.programmes.findIndex(
        (programme) => programme.id === action.payload.programmeId
      );

      if (indexOfProgramme < 0) return;

      const programmeDays = state.programmes[indexOfProgramme].dailyProgrammes;

      const indexOfDay = programmeDays.findIndex(
        (day) => day.day === action.payload.programmeDay.day
      );

      if (indexOfDay < 0) return;

      state.programmes[indexOfProgramme] = {
        ...state.programmes[indexOfProgramme],
        synced: false,
      };

      state.programmes[indexOfProgramme].dailyProgrammes[indexOfDay] =
        action.payload.programmeDay;
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getProgrammes);
    setThunkActionStatus(builder, getUserProgrammes);
    setThunkActionStatus(builder, upsertProgrammes);
    setThunkActionStatus(builder, updateProgrammes);
    builder.addCase(getProgrammes.fulfilled, (state, action) => {
      const localProgrammes =
        state.programmes?.filter((programme) => !programme?.synced) ?? [];
      const syncedProgrammes = action.payload?.map((programme) => ({
        ...programme,
        synced: true,
      }));

      state.programmes = [...localProgrammes, ...syncedProgrammes];
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getUserProgrammes.fulfilled, (state, action) => {
      const localProgrammes =
        state.programmes?.filter((programme) => !programme?.synced) ?? [];
      const syncedProgrammes = action.payload?.map((programme) => ({
        ...programme,
        synced: true,
      }));

      state.programmes = [...localProgrammes, ...syncedProgrammes];
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(upsertProgrammes.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(updateProgrammes.fulfilled, (state, action) => {
      if (state.programmes && action.payload?.length) {
        state.programmes = state.programmes.map((programme) => ({
          ...programme,
          synced: action.payload?.some(
            (updatedProgramme) => updatedProgramme.id === programme.id
          ),
        }));
      }
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: programmeReducer, actions: programmeActions } = programmeSlice;

const programmePersistConfig = {
  key: 'programme',
  storage: localForage,
  blacklist: [],
};

export { programmePersistConfig, programmeReducer, programmeActions };
