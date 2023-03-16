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
  getVisitVideos,
} from './visit.actions';
import { VisitState } from './visit.types';

const initialState: VisitState & ThunkStateStatus = {
  visitStatus: {},
  visitFormData: [],
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
        state.visitFormData = !!state.visitFormData.length
          ? state.visitFormData.map((item) => {
              if (item.visitId === action.payload.visitId) {
                return action.payload;
              }

              return item;
            })
          : [action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getHealthCareWorkerVisitStatus);
    setThunkActionStatus(builder, addVisitFormData);
    setThunkActionStatus(builder, getHealthPromotion);
    setThunkActionStatus(builder, getMoreInformation);
    setThunkActionStatus(builder, getVisitVideos);
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
    builder.addCase(getVisitVideos.fulfilled, (state, action) => {
      state.visitVideos = !!state.visitVideos?.length
        ? [...new Set([...state.visitVideos, ...action.payload])]
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
