import {
  ChildDto,
  ClassProgrammeDto,
  LearnerDto,
  ClassroomGroupDto,
} from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getClassroomForCoach,
  getClassroomGroupsForCoach,
} from './classroomForCoach.actions';
import { ClassroomForCoachState } from './classroomForCoach.types';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { ClassroomGroupDto as SimpleClassroomGroupDto } from '@/models/classroom/classroom-group.dto';

const initialState: ClassroomForCoachState = {
  classroomForCoach: undefined,
  classroomGroupData: {
    classroomGroups: [],
    dateRefreshed: undefined,
  },
  classroomProgrammes: undefined,
  classroomGroupLearners: undefined,
};

const classroomsSlice = createSlice({
  name: 'classroomsForCoach',
  initialState,
  reducers: {
    resetClassroomState: (state) => {
      state.classroomForCoach = initialState.classroomForCoach;
      state.classroomGroupData = initialState.classroomGroupData;
      state.classroomProgrammes = initialState.classroomProgrammes;
      state.classroomGroupLearners = initialState.classroomGroupLearners;
    },
    updateClassroom: (state, action: PayloadAction<ClassroomDto[]>) => {
      state.classroomForCoach = action.payload;
    },
    updateClassroomGroup: (
      state,
      action: PayloadAction<SimpleClassroomGroupDto>
    ) => {
      const payloadUpdated = { ...action.payload, synced: false };
      for (
        let i = 0;
        i < state.classroomGroupData.classroomGroups.length;
        i++
      ) {
        if (
          state.classroomGroupData.classroomGroups[i].id === action.payload.id
        )
          state.classroomGroupData.classroomGroups[i] = payloadUpdated;
      }
    },
    updateClassroomProgramme: (
      state,
      action: PayloadAction<ClassProgrammeDto>
    ) => {
      if (state.classroomProgrammes) {
        for (let i = 0; i < state.classroomProgrammes.length; i++) {
          if (state.classroomProgrammes[i].id === action.payload.id)
            state.classroomProgrammes[i] = action.payload;
        }
      }
    },
    updateClassroomGroupLearner: (state, action: PayloadAction<LearnerDto>) => {
      if (state.classroomGroupLearners) {
        for (let i = 0; i < state.classroomGroupLearners.length; i++) {
          if (
            state.classroomGroupLearners[i].userId === action.payload.userId &&
            state.classroomGroupLearners[i].classroomGroupId ===
              action.payload.classroomGroupId
          )
            state.classroomGroupLearners[i] = action.payload;
        }
      }
    },
    deleteClassroomGroup: (state, action: PayloadAction<ClassroomGroupDto>) => {
      if (!!action.payload.id) {
        const index = state.classroomGroupData.classroomGroups.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index > -1) {
          state.classroomGroupData.classroomGroups.splice(index, 1);
        }
      }
    },
    deleteClassroomProgramme: (
      state,
      action: PayloadAction<ClassProgrammeDto>
    ) => {
      if (action.payload.id) {
        if (state.classroomProgrammes) {
          for (let i = 0; i < state.classroomProgrammes.length; i++) {
            if (state.classroomProgrammes[i].id === action.payload.id)
              state.classroomProgrammes[i].isActive = false;
          }
        }
      } else {
        const index = state.classroomProgrammes?.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index && index > -1) state.classroomProgrammes?.splice(index, 1);
      }
    },
    deleteClassroomGroupLearner: (state, action: PayloadAction<LearnerDto>) => {
      const index = state.classroomGroupLearners?.findIndex(
        (c) =>
          c.userId === action.payload.userId &&
          c.classroomGroupId === action.payload.classroomGroupId
      );
      if (index && index > -1) state.classroomGroupLearners?.splice(index, 1);
    },
    deactivateClassroomGroupLearner: (
      state,
      action: PayloadAction<ChildDto>
    ) => {
      if (!state.classroomGroupLearners) return;

      const learnerIndex = state.classroomGroupLearners.findIndex(
        (learner) => learner.userId === action.payload.userId
      );

      if (learnerIndex < 0) return;

      const newDate = new Date();
      state.classroomGroupLearners[learnerIndex].stoppedAttendance =
        newDate.toISOString();
      state.classroomGroupLearners[learnerIndex].isActive = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getClassroomForCoach.fulfilled, (state, action) => {
      if (action.payload) {
        state.classroomForCoach = action.payload;
      }
    });
    builder.addCase(getClassroomGroupsForCoach.fulfilled, (state, action) => {
      if (action.payload) {
        state.classroomGroupData = {
          classroomGroups: action.payload.map((cg) => ({
            ...cg,
            synced: true,
            learners: cg.learners.map((l) => ({ ...l, synced: true })),
          })),
          dateRefreshed: new Date().toDateString(),
        };
      }
    });
  },
});

const {
  reducer: classroomsForCoachReducer,
  actions: classroomsForCoachActions,
} = classroomsSlice;

const classroomsForCoachPersistConfig = {
  key: 'classroomsForCoach',
  storage: localForage,
  blacklist: [],
};

export {
  classroomsForCoachPersistConfig,
  classroomsForCoachReducer,
  classroomsForCoachActions,
};
