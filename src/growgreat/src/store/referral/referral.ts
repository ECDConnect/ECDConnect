import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus } from '../types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { getReferralsForInfant } from './referral.actions';
import { ReferralState } from './referral.types';

const initialState: ReferralState & ThunkStateStatus = {};

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getReferralsForInfant);
    builder.addCase(getReferralsForInfant.fulfilled, (state, action) => {
      state.referralsForInfant = action.payload;

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
