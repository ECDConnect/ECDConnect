import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus } from '../types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import {
  addVisitBackReferral,
  getReferralsForInfant,
  getReferralsForVisitId,
  updateVisitDataStatus,
} from './referral.actions';
import { ReferralState } from './referral.types';

const initialState: ReferralState & ThunkStateStatus = {};

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getReferralsForInfant);
    setThunkActionStatus(builder, getReferralsForVisitId);
    setThunkActionStatus(builder, updateVisitDataStatus);
    setThunkActionStatus(builder, addVisitBackReferral);
    builder.addCase(getReferralsForInfant.fulfilled, (state, action) => {
      state.referralsForInfant = action.payload;

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getReferralsForVisitId.fulfilled, (state, action) => {
      state.referralsForMother = action.payload;

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(updateVisitDataStatus.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addVisitBackReferral.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: referralReducer, actions: referralActions } = referralSlice;

const referralPersistConfig = {
  key: 'referral',
  storage: localForage,
  blacklist: [],
};

export { referralPersistConfig, referralReducer, referralActions };
