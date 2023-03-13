import { CmsVisitDataInputModelInput } from '@ecdlink/graphql';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus } from '../types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import {
  addVisitFormData,
  getHealthCareWorkerVisitStatus,
  getHealthPromotion,
  getMoreInformation,
} from './visit.actions';
import { VisitState } from './visit.types';

const initialState: VisitState & ThunkStateStatus = {
  visitStatus: {},
  visitFormData: {},
};

const visitSlice = createSlice({
  name: 'visit',
  initialState,
  reducers: {
    addVisitFormData: (
      state,
      action: PayloadAction<CmsVisitDataInputModelInput>
    ) => {
      if (state.visitFormData) {
        state.visitFormData = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getHealthCareWorkerVisitStatus);
    setThunkActionStatus(builder, addVisitFormData);
    setThunkActionStatus(builder, getHealthPromotion);
    setThunkActionStatus(builder, getMoreInformation);
    builder.addCase(addVisitFormData.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(
      getHealthCareWorkerVisitStatus.fulfilled,
      (state, action) => {
        state.visitStatus = action.payload;

        setFulfilledThunkActionStatus(state, action);
      }
    );
    builder.addCase(getHealthPromotion.fulfilled, (state, action) => {
      state.healthPromotion = state.healthPromotion?.length
        ? [...state.healthPromotion, ...action.payload]
        : action.payload;

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getMoreInformation.fulfilled, (state, action) => {
      state.moreInformation = state.moreInformation?.length
        ? [...state.moreInformation, ...action.payload]
        : action.payload;

      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: visitReducer, actions: visitActions } = visitSlice;

const visitPersistConfig = {
  key: 'visit',
  storage: localForage,
  blacklist: [],
};

export { visitPersistConfig, visitReducer, visitActions };
