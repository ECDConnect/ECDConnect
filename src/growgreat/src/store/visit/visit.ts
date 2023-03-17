import { CmsVisitDataInputModelInput } from '@ecdlink/graphql';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus } from '../types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import {
  addVisitFormData,
  getCompletedVisitsForVisitId,
  getHealthCareWorkerVisitStatus,
  getHealthPromotion,
  getMoreInformation,
  getPreviousVisitInformationForInfant,
  getVisitVideos,
} from './visit.actions';
import { CompletedVisitsForVisitId, VisitState } from './visit.types';

const initialState: VisitState & ThunkStateStatus = {
  visitStatus: {},
  visitFormData: [],
};

const handleAddCompletedVisitsByVisitId = (
  state: VisitState & ThunkStateStatus,
  action: PayloadAction<CompletedVisitsForVisitId>
) => {
  return typeof state.completedVisitsForVisitId?.[0] === 'string'
    ? state.completedVisitsForVisitId?.map((item) => {
        if (item.visitId === action.payload.visitId) {
          const uniqueVisits = [
            ...new Set([...item.visits, ...action.payload.visits]),
          ];
          return {
            ...item,
            visits: uniqueVisits,
          };
        }
        return item;
      })
    : [action.payload];
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
    addCompletedVisitsByVisitId: (
      state,
      action: PayloadAction<CompletedVisitsForVisitId>
    ) => {
      state.completedVisitsForVisitId = handleAddCompletedVisitsByVisitId(
        state,
        action
      );
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getHealthCareWorkerVisitStatus);
    setThunkActionStatus(builder, addVisitFormData);
    setThunkActionStatus(builder, getHealthPromotion);
    setThunkActionStatus(builder, getMoreInformation);
    setThunkActionStatus(builder, getCompletedVisitsForVisitId);
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
    builder.addCase(getCompletedVisitsForVisitId.fulfilled, (state, action) => {
      state.completedVisitsForVisitId = handleAddCompletedVisitsByVisitId(
        state,
        action
      );

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(
      getPreviousVisitInformationForInfant.fulfilled,
      (state, action) => {
        state.previousVisitInformationForInfant = action.payload;

        setFulfilledThunkActionStatus(state, action);
      }
    );
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
