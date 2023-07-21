import { MotherDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { addEventRecord } from '../eventRecord/eventRecord.actions';
import { addInfant, getInfantCountForMonth } from '../infant/infant.actions';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import {
  addAdditionalVisitForMother,
  addMother,
  getAllMotherEventRecordTypes,
  getMotherCountForMonth,
  getMothers,
  getMothersWeeklyVisits,
  getMotherVisits,
  updateMotherAddress,
  updateMotherContactDetails,
  getReferralsForMother,
  getCompletedReferralsForMother,
  updateMother,
  updateMotherDeliveryDate,
} from './mother.actions';
import { MotherState, UpdateMotherDeliveryDateProps } from './mother.types';

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
    updateMotherDeliveryDate: (
      state,
      action: PayloadAction<UpdateMotherDeliveryDateProps>
    ) => {
      if (state.mothers) {
        for (let i = 0; i < state.mothers.length; i++) {
          if (state.mothers[i].id === action.payload.id)
            state.mothers[i] = {
              ...state.mothers[i],
              expectedDateOfDelivery: action.payload.expectedDateOfDelivery,
            };
        }
      }
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, addMother);
    setThunkActionStatus(builder, getMothers);
    setThunkActionStatus(builder, updateMotherAddress);
    setThunkActionStatus(builder, updateMotherContactDetails);
    setThunkActionStatus(builder, getMotherCountForMonth);
    setThunkActionStatus(builder, getMotherVisits);
    setThunkActionStatus(builder, addAdditionalVisitForMother);
    setThunkActionStatus(builder, getReferralsForMother);
    setThunkActionStatus(builder, getCompletedReferralsForMother);
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
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getMothersWeeklyVisits.fulfilled, (state, action) => {
      state.mothersWeeklyVisits = action.payload;
    });
    builder.addCase(getMotherVisits.fulfilled, (state, action) => {
      state.visits = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getAllMotherEventRecordTypes.fulfilled, (state, action) => {
      state.eventRecordTypes = action.payload;
    });
    builder.addCase(addEventRecord.fulfilled, (state, action) => {
      const motherId = action.payload?.input?.motherId;

      if (motherId && action.payload.isCloseFolder) {
        state.mothers = state.mothers?.filter(
          (item) => item.user?.id !== motherId
        );
      }
    });
    builder.addCase(addInfant.fulfilled, (state, action) => {
      const motherId = action.payload.motherId;

      if (motherId) {
        state.mothers = state.mothers?.filter(
          (item) => item.user?.id !== motherId
        );
      }
    });
    builder.addCase(getReferralsForMother.fulfilled, (state, action) => {
      state.referralsForMother = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(
      getCompletedReferralsForMother.fulfilled,
      (state, action) => {
        state.completedReferralsForMother = action.payload;
        setFulfilledThunkActionStatus(state, action);
      }
    );
    builder.addCase(addAdditionalVisitForMother.fulfilled, (state, action) => {
      if (state.visits) {
        state.visits = [...state.visits, action.payload];
      } else {
        state.visits = [action.payload];
      }

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(updateMother.fulfilled, (state, action) => {
      if (!action.payload || !state.mothers) return;

      state.mothers = state.mothers?.map((item) => {
        if (item?.user?.id === action.payload?.user?.id) {
          return { ...item, ...action.payload };
        }
        return item;
      });
    });
    builder.addCase(updateMotherDeliveryDate.fulfilled, (state, action) => {
      if (!action.payload || !state.mothers) return;

      state.mothers = state.mothers?.map((item) => {
        if (item?.id === action.payload?.id) {
          return {
            ...item,
            expectedDateOfDelivery: action.payload.expectedDateOfDelivery,
          };
        }
        return item;
      });
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
