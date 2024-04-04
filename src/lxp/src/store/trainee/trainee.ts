import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getCoachSmartSpaceVisitData,
  getTraineeById,
  getTraineeTimeline,
  getTraineeVisitData,
  syncCoachSmartSpaceVisitData,
  submitCoachSmartSpaceVisitData,
  updateTraineeOnboardTimelineSSVisitEvent,
  submitTraineeFranchisorAgreementData as submitFranchiseeAgreementData,
  syncTraineeFranchisorAgreementData as syncFranchiseeAgreementData,
} from './trainee.actions';
import {
  SmartSpaceVisitData,
  SmartSpaceVisit,
  TraineeState,
} from './trainee.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { UpdateVisitPlannedVisitDateModelInput } from '@ecdlink/graphql';

const initialState: TraineeState = {
  trainee: undefined,
  traineeOnboardTimeline: {},
  traineeChecklistVisitData: {},
  coachSmartSpaceVisitData: {},
  franchiseeAgreementData: {},
};

const traineeSlice = createSlice({
  name: 'trainee',
  initialState,
  reducers: {
    resetPractitionerState: (state) => {
      state.trainee = initialState.trainee;
    },
    saveCoachSmartSpaceVisitData: (
      state,
      action: PayloadAction<SmartSpaceVisit>
    ) => {
      state.coachSmartSpaceVisitData = {
        ...state.coachSmartSpaceVisitData,
        [action.payload.visitId]: action.payload,
      };
    },
    setCoachSmartSpaceVisitSyncId: (
      state,
      action: PayloadAction<{ visitId: string; syncId: string }>
    ) => {
      state.coachSmartSpaceVisitData = {
        ...state.coachSmartSpaceVisitData,
        [action.payload.visitId]: {
          ...state.coachSmartSpaceVisitData[action.payload.visitId],
          syncId: action.payload.syncId,
        },
      };
    },
    saveFranchiseeAgreementData: (
      state,
      action: PayloadAction<SmartSpaceVisit>
    ) => {
      state.franchiseeAgreementData = {
        ...state.franchiseeAgreementData,
        [action.payload.visitId]: action.payload,
      };
    },
    setFranchiseeAgreementVisitSyncId: (
      state,
      action: PayloadAction<{ visitId: string; syncId: string }>
    ) => {
      state.franchiseeAgreementData = {
        ...state.franchiseeAgreementData,
        [action.payload.visitId]: {
          ...state.franchiseeAgreementData[action.payload.visitId],
          syncId: action.payload.syncId,
        },
      };
    },
    updateTraineeOnboardTimelineSSVisitEvent: (
      state,
      action: PayloadAction<UpdateVisitPlannedVisitDateModelInput>
    ) => {
      if (!state.traineeOnboardTimeline) return;
      const input = action.payload;

      state.traineeOnboardTimeline.sSCoachVisitEventId = input.eventId;
      state.traineeOnboardTimeline.sSCoachVisitDate = input.plannedVisitDate;
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getTraineeVisitData);
    builder.addCase(getTraineeById.fulfilled, (state, action) => {
      state.trainee = action.payload;
    });
    builder.addCase(getTraineeTimeline.fulfilled, (state, action) => {
      state.traineeOnboardTimeline = {
        ...state.traineeOnboardTimeline,
        [action.meta.arg.userId]: action.payload,
      };
    });
    builder.addCase(getTraineeVisitData.fulfilled, (state, action) => {
      state.traineeChecklistVisitData = {
        ...state.traineeChecklistVisitData,
        [action.meta.arg.visitId]: action.payload,
      };
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getCoachSmartSpaceVisitData.fulfilled, (state, action) => {
      const mappedData: SmartSpaceVisitData[] = action.payload.map((item) => {
        return {
          visitSection: item.visitSection!,
          question: item.question!,
          questionAnswer: item.questionAnswer || undefined,
        };
      });

      state.coachSmartSpaceVisitData = {
        ...state.coachSmartSpaceVisitData,
        [action.meta.arg.visitId]: {
          visitId: action.meta.arg.visitId,
          traineeId: '',
          coachId: '',
          visitData: mappedData,
        },
      };

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(
      updateTraineeOnboardTimelineSSVisitEvent.fulfilled,
      (state, action) => {
        setFulfilledThunkActionStatus(state, action);

        const input = action.meta.arg;
        if (state.traineeOnboardTimeline) {
          state.traineeOnboardTimeline.sSCoachVisitDate =
            input.plannedVisitDate;
          state.traineeOnboardTimeline.sSCoachVisitEventId = input.eventId;
        }
      }
    );
    builder.addCase(
      submitCoachSmartSpaceVisitData.fulfilled,
      (state, action) => {
        state.coachSmartSpaceVisitData = {
          ...state.coachSmartSpaceVisitData,
          [action.meta.arg]: {
            ...state.coachSmartSpaceVisitData[action.meta.arg],
            syncId: undefined,
          },
        };
      }
    );
    builder.addCase(syncCoachSmartSpaceVisitData.fulfilled, (state, action) => {
      const updatedVisits = state.coachSmartSpaceVisitData;
      const visitIdsToRemove = Object.values(state.coachSmartSpaceVisitData)
        .filter((item) => !!item.syncId)
        .map((item) => item.visitId);

      visitIdsToRemove.forEach(
        (visitId) => (updatedVisits[visitId].syncId = undefined)
      );

      state.coachSmartSpaceVisitData = updatedVisits;
    });
    builder.addCase(
      submitFranchiseeAgreementData.fulfilled,
      (state, action) => {
        state.franchiseeAgreementData = {
          ...state.franchiseeAgreementData,
          [action.meta.arg]: {
            ...state.franchiseeAgreementData[action.meta.arg],
            syncId: undefined,
          },
        };
      }
    );
    builder.addCase(syncFranchiseeAgreementData.fulfilled, (state, action) => {
      const updatedVisits = state.franchiseeAgreementData;
      const visitIdsToRemove = Object.values(state.franchiseeAgreementData)
        .filter((item) => !!item.syncId)
        .map((item) => item.visitId);

      visitIdsToRemove.forEach(
        (visitId) => (updatedVisits[visitId].syncId = undefined)
      );

      state.franchiseeAgreementData = updatedVisits;
    });
  },
});

const { reducer: traineerReducer, actions: traineeActions } = traineeSlice;

const traineePersistConfig = {
  key: 'trainee',
  storage: localForage,
  blacklist: [],
};

export { traineePersistConfig, traineerReducer, traineeActions };
