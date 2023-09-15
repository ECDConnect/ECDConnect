import { InfantDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus } from '../types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import {
  getInfants,
  addInfant,
  getInfantCountForMonth,
  getInfantsWeeklyVisits,
  getInfantVisits,
  updateInfant,
  updateInfantCaregiverAddress,
  updateInfantCaregiverContactDetails,
  getAllInfantEventRecordTypes,
  updateInfantCaregiver,
  addAdditionalVisitForInfant,
  getReferralsForInfant,
  getCompletedReferralsForInfant,
  updateVisitDataStatus,
} from './infant.actions';
import { InfantState } from './infant.types';

const initialState: InfantState & ThunkStateStatus = {
  status: [],
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
    setThunkActionStatus(builder, getInfants);
    setThunkActionStatus(builder, getInfantCountForMonth);
    setThunkActionStatus(builder, getInfantVisits);
    setThunkActionStatus(builder, updateInfantCaregiverAddress);
    setThunkActionStatus(builder, updateInfantCaregiverContactDetails);
    setThunkActionStatus(builder, getAllInfantEventRecordTypes);
    setThunkActionStatus(builder, updateInfantCaregiver);
    setThunkActionStatus(builder, addAdditionalVisitForInfant);
    setThunkActionStatus(builder, getReferralsForInfant);
    setThunkActionStatus(builder, getCompletedReferralsForInfant);
    setThunkActionStatus(builder, updateVisitDataStatus);
    builder.addCase(updateVisitDataStatus.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getInfantCountForMonth.fulfilled, (state, action) => {
      state.infantCountForMonth = action.payload;

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addInfant.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getInfants.fulfilled, (state, action) => {
      const infants = Object.assign([], action.payload) as InfantDto[];

      for (let i = 0; i < infants.length; i++) {
        infants[i].isActive = true;
      }

      state.infants = infants;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getInfantsWeeklyVisits.fulfilled, (state, action) => {
      state.infantsWeeklyVisits = action.payload;
    });
    builder.addCase(getInfantVisits.fulfilled, (state, action) => {
      state.visits = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(updateInfant.fulfilled, (state, action) => {
      if (!action.payload || !state.infants) return;

      state.infants = state.infants?.map((item) => {
        if (item?.user?.id === action.payload?.user?.id) {
          return { ...item, ...action.payload };
        }
        return item;
      });
    });
    builder.addCase(getAllInfantEventRecordTypes.fulfilled, (state, action) => {
      state.eventRecordTypes = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getReferralsForInfant.fulfilled, (state, action) => {
      state.referralsForInfant = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(
      getCompletedReferralsForInfant.fulfilled,
      (state, action) => {
        state.completedReferralsForInfant = action.payload;
        setFulfilledThunkActionStatus(state, action);
      }
    );
    builder.addCase(updateInfantCaregiver.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addAdditionalVisitForInfant.fulfilled, (state, action) => {
      if (state.visits) {
        state.visits = [...state.visits, action.payload];
      } else {
        state.visits = [action.payload];
      }

      setFulfilledThunkActionStatus(state, action);
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
