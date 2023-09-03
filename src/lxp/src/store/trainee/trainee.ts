import { PractitionerDto, TraineeDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getTraineeById,
  getTraineeTimeline,
  getTraineeVisitData,
  updateTraineeOnboardTimelineSSVisitEvent,
} from './trainee.actions';
import { TraineeState } from './trainee.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { UpdateVisitPlannedVisitDateModelInput } from '@ecdlink/graphql';

const initialState: TraineeState = {
  trainee: undefined,
  traineeOnboardTimeline: undefined,
  traineeVisitData: undefined,
  coachSmartSpaceCheckData: undefined,
  coachFranchisorAgreementData: undefined,
};

const traineeSlice = createSlice({
  name: 'trainee',
  initialState,
  reducers: {
    resetPractitionerState: (state) => {
      state.trainee = initialState.trainee;
    },
    saveCoachSmartSpaceCheckData: (state, action) => {
      const checkData = state.coachSmartSpaceCheckData?.filter(
        (item) => item?.visitSection !== action.payload?.[0]?.visitSection
      );
      checkData?.push(...action?.payload);
      state.coachSmartSpaceCheckData = checkData ? checkData : action.payload;
    },
    saveCoachFranchisorAgreementData: (state, action) => {
      const checkData = state.coachFranchisorAgreementData?.filter(
        (item) => item?.visitSection !== action.payload?.[0]?.visitSection
      );
      checkData?.push(...action?.payload);
      state.coachFranchisorAgreementData = checkData
        ? checkData
        : action.payload;
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
      state.traineeOnboardTimeline = action.payload;
    });
    builder.addCase(getTraineeVisitData.fulfilled, (state, action) => {
      state.traineeVisitData = action.payload;
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
  },
});

const { reducer: traineerReducer, actions: traineeActions } = traineeSlice;

const traineePersistConfig = {
  key: 'trainee',
  storage: localForage,
  blacklist: [],
};

export { traineePersistConfig, traineerReducer, traineeActions };
