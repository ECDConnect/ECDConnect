import { CmsVisitDataInputModelInput } from '@ecdlink/graphql';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus } from '../types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import {
  addVisitFormData,
  getCompletedVisitsForVisitId,
  getGrowthDataForInfant,
  getHealthCareWorkerVisitStatus,
  getHealthPromotion,
  getMoreInformation,
  getPreviousVisitInformationForInfant,
  getVisitAnswersForInfant,
  getVisitVideos,
  getHealthCareWorkerHighlights,
  getPreviousVisitInformationForMother,
  getMomCompletedVisitsForVisitId,
  addVisitForMomFormData,
  getVisitAnswersForMother,
  GetMotherSummaryByPriority,
  GetInfantSummaryByPriority,
} from './visit.actions';
import { CompletedVisitsForVisitId, VisitState } from './visit.types';

const initialState: VisitState & ThunkStateStatus = {
  visitStatus: {},
  visitFormData: [],
  visitFormDataForMother: [],
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

const handleAddMomCompletedVisitsByVisitId = (
  state: VisitState & ThunkStateStatus,
  action: PayloadAction<CompletedVisitsForVisitId>
) => {
  return typeof state.momcompletedVisitsForVisitId?.[0] === 'string'
    ? state.momcompletedVisitsForVisitId?.map((item) => {
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
    addVisitFormDataForMother: (
      state,
      action: PayloadAction<CmsVisitDataInputModelInput>
    ) => {
      if (state.visitFormDataForMother) {
        state.visitFormDataForMother = !!state.visitFormDataForMother.length
          ? state.visitFormDataForMother.map((item) => {
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
    addMomCompletedVisitsByVisitId: (
      state,
      action: PayloadAction<CompletedVisitsForVisitId>
    ) => {
      state.momcompletedVisitsForVisitId = handleAddMomCompletedVisitsByVisitId(
        state,
        action
      );
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getHealthCareWorkerVisitStatus);
    setThunkActionStatus(builder, addVisitFormData);
    setThunkActionStatus(builder, addVisitForMomFormData);
    setThunkActionStatus(builder, getHealthPromotion);
    setThunkActionStatus(builder, getMoreInformation);
    setThunkActionStatus(builder, getCompletedVisitsForVisitId);
    setThunkActionStatus(builder, getVisitVideos);
    setThunkActionStatus(builder, getVisitAnswersForInfant);
    setThunkActionStatus(builder, getVisitAnswersForMother);
    setThunkActionStatus(builder, getHealthCareWorkerHighlights);
    setThunkActionStatus(builder, GetMotherSummaryByPriority);
    setThunkActionStatus(builder, GetInfantSummaryByPriority);
    setThunkActionStatus(builder, getPreviousVisitInformationForMother);
    setThunkActionStatus(builder, getMomCompletedVisitsForVisitId);
    setThunkActionStatus(builder, getGrowthDataForInfant);
    builder.addCase(addVisitFormData.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addVisitForMomFormData.fulfilled, (state, action) => {
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
      setFulfilledThunkActionStatus(state, action);
      const updatedDataIndex = state.healthPromotion?.findIndex(
        (item) => item?.id === action.payload.id
      );

      if (
        updatedDataIndex !== undefined &&
        updatedDataIndex !== -1 &&
        !!state.healthPromotion
      ) {
        state.healthPromotion[updatedDataIndex] = action.payload;
        return;
      }

      state.healthPromotion = state.healthPromotion?.length
        ? [...state.healthPromotion, ...[action.payload]]
        : [action.payload];
    });
    builder.addCase(getMoreInformation.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
      const updatedDataIndex = state.moreInformation?.findIndex(
        (item) =>
          item?.visit === action.payload?.visit &&
          item?.type === action.payload?.type
      );

      if (
        updatedDataIndex !== undefined &&
        updatedDataIndex !== -1 &&
        !!state.moreInformation
      ) {
        state.moreInformation[updatedDataIndex] = action.payload;
        return;
      }

      state.moreInformation = state.moreInformation?.length
        ? [...state.moreInformation, ...[action.payload]]
        : [action.payload];
    });
    builder.addCase(getCompletedVisitsForVisitId.fulfilled, (state, action) => {
      state.completedVisitsForVisitId = handleAddCompletedVisitsByVisitId(
        state,
        action
      );

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(
      getMomCompletedVisitsForVisitId.fulfilled,
      (state, action) => {
        state.momcompletedVisitsForVisitId =
          handleAddMomCompletedVisitsByVisitId(state, action);

        setFulfilledThunkActionStatus(state, action);
      }
    );
    builder.addCase(
      getPreviousVisitInformationForInfant.fulfilled,
      (state, action) => {
        state.previousVisitInformationForInfant = action.payload;
      }
    );
    builder.addCase(getGrowthDataForInfant.fulfilled, (state, action) => {
      state.growthDataForInfant = action.payload;

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getVisitVideos.fulfilled, (state, action) => {
      state.visitVideos = !!state.visitVideos?.length
        ? [...new Set([...state.visitVideos, ...action.payload])]
        : action.payload;

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getVisitAnswersForInfant.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      const mergedDate = !!state.visitAnswersForInfant?.length
        ? [...state.visitAnswersForInfant, ...action.payload]
        : [];

      state.visitAnswersForInfant = !!mergedDate.length
        ? mergedDate.filter((item, index) => {
            return index === mergedDate.findIndex((obj) => obj.id === item.id);
          })
        : action.payload;
    });
    builder.addCase(getVisitAnswersForMother.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      const mergedDate = !!state.visitAnswersForMother?.length
        ? [...state.visitAnswersForMother, ...action.payload]
        : [];

      state.visitAnswersForMother = !!mergedDate.length
        ? mergedDate.filter((item, index) => {
            return (
              index ===
              mergedDate.findIndex(
                (obj) =>
                  obj.visitSection === item.visitSection &&
                  obj.visitId === item.visitId &&
                  obj.visitName === item.visitName
              )
            );
          })
        : action.payload;
    });
    builder.addCase(
      getHealthCareWorkerHighlights.fulfilled,
      (state, action) => {
        state.healthCareWorkerHighlights = action.payload;

        setFulfilledThunkActionStatus(state, action);
      }
    );
    builder.addCase(
      getPreviousVisitInformationForMother.fulfilled,
      (state, action) => {
        state.previousVisitInformationForMother = action.payload;

        setFulfilledThunkActionStatus(state, action);
      }
    );
    builder.addCase(GetMotherSummaryByPriority.fulfilled, (state, action) => {
      state.motherSummaryByPriority = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(GetInfantSummaryByPriority.fulfilled, (state, action) => {
      state.infantSummaryByPriority = action.payload;
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
