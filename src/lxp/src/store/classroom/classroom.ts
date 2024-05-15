import {
  ChildDto,
  ClassProgrammeDto,
  ClassroomDto,
  ClassroomGroupDto,
  LearnerDto,
} from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getClassroomGroups,
  getClassroomProgrammes,
  getClassroom,
  updatePreschoolFee,
  createLearner,
} from './classroom.actions';
import { ClassroomState } from './classroom.types';
import { ClassroomDto as SimpleClassroomDto } from '@/models/classroom/classroom.dto';
import { ClassroomGroupDto as SimpleClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { SiteAddressDto } from '@/models/classroom/site-address.dto';

const initialState: ClassroomState = {
  classroom: undefined,
  classroomGroups: undefined,
  classroomProgrammes: undefined,
  classroomGroupLearners: undefined,
  programmeType: undefined,
  principal: undefined,
  classrooGroupsForPractitioner: undefined,
};

const classroomsSlice = createSlice({
  name: 'classrooms',
  initialState,
  reducers: {
    resetClassroomState: (state) => {
      state.classroom = initialState.classroom;
      state.classroomGroups = initialState.classroomGroups;
      state.classroomProgrammes = initialState.classroomProgrammes;
      state.classroomGroupLearners = initialState.classroomGroupLearners;
      state.principal = initialState.principal;
      state.classrooGroupsForPractitioner =
        initialState.classrooGroupsForPractitioner;
    },
    updateClassroom: (state, action: PayloadAction<SimpleClassroomDto>) => {
      state.classroom = action.payload;
    },
    updateClassroomSiteAddress: (
      state,
      action: PayloadAction<SiteAddressDto>
    ) => {
      if (!!state.classroom) {
        state.classroom = {
          ...state.classroom,
          siteAddress: action.payload,
        };
      }
    },
    // TODO - do we need this? It should just pass in the number, not the whole classroom...
    updateClassroomNumberPractitioners: (
      state,
      action: PayloadAction<Pick<ClassroomDto, 'numberPractitioners'>>
    ) => {
      if (state.classroom)
        state.classroom.numberOfPractitioners =
          action.payload.numberPractitioners!;
    },
    updateClassroomGroup: (
      state,
      action: PayloadAction<SimpleClassroomGroupDto>
    ) => {
      if (state.classroomGroups) {
        const isOnline = navigator.onLine;
        const payloadUpdated = { ...action.payload, isOnline };
        for (let i = 0; i < state.classroomGroups.length; i++) {
          if (state.classroomGroups[i].id === action.payload.id)
            state.classroomGroups[i] = payloadUpdated;
        }
      }
    },
    updateClassroomProgramme: (
      state,
      action: PayloadAction<ClassProgrammeDto>
    ) => {
      if (state.classroomProgrammes) {
        const isOnline = navigator.onLine;
        const payloadUpdated = { ...action.payload, isOnline };
        for (let i = 0; i < state.classroomProgrammes.length; i++) {
          if (state.classroomProgrammes[i].id === action.payload.id)
            state.classroomProgrammes[i] = payloadUpdated;
        }
      }
    },
    updateClassroomGroupLearner: (state, action: PayloadAction<LearnerDto>) => {
      if (state.classroomGroupLearners) {
        const isOnline = navigator.onLine;
        const payloadUpdated = { ...action.payload, isOnline };
        for (let i = 0; i < state.classroomGroupLearners.length; i++) {
          if (
            state.classroomGroupLearners[i].userId === action.payload.userId &&
            state.classroomGroupLearners[i].classroomGroupId ===
              action.payload.classroomGroupId &&
            state.classroomGroupLearners[i].id === action.payload.id
          )
            state.classroomGroupLearners[i] = payloadUpdated;
        }
      }
    },
    createClassroom: (state, action: PayloadAction<SimpleClassroomDto>) => {
      state.classroom = action.payload;
    },
    createClassroomGroup: (
      state,
      action: PayloadAction<SimpleClassroomGroupDto>
    ) => {
      if (!state.classroomGroups) state.classroomGroups = [];
      const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, isOnline };
      state.classroomGroups?.push(payloadUpdated);
    },
    createClassroomProgramme: (
      state,
      action: PayloadAction<ClassProgrammeDto>
    ) => {
      const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, isOnline };
      if (!state.classroomProgrammes) state.classroomProgrammes = [];
      state.classroomProgrammes?.push(payloadUpdated);
    },
    createClassroomGroupLearner: (state, action: PayloadAction<LearnerDto>) => {
      const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, isOnline };
      if (!state.classroomGroupLearners) state.classroomGroupLearners = [];
      state.classroomGroupLearners?.push(payloadUpdated);
    },
    removeClassroomGroupOnEdit: (
      state,
      action: PayloadAction<Pick<ClassroomGroupDto, 'id'>>
    ) => {
      const index = state.classroomGroups?.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index && index > -1) {
        state.classroomGroups?.splice(index, 1);
        state.classroomProgrammes = state.classroomProgrammes?.filter(
          (programme) => programme.classroomGroupId !== action.payload.id
        );
      }
    },
    // TODO - need to check on this
    deleteClassroomGroup: (state, action: PayloadAction<ClassroomGroupDto>) => {
      if (!!action.payload.id && !!state.classroomGroups) {
        const index = state.classroomGroups?.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index && index > -1) state.classroomGroups?.splice(index, 1);
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
    // TODO - needs to be updated, to remove learner from the actual classroom group
    deleteClassroomGroupLearner: (state, action: PayloadAction<LearnerDto>) => {
      const index = state.classroomGroupLearners?.findIndex(
        (c) =>
          c.userId === action.payload.userId &&
          c.classroomGroupId === action.payload.classroomGroupId
      );
      if (index && index > -1) state.classroomGroupLearners?.splice(index, 1);
    },
    // TODO - needs to be updated, to remove learner from the actual classroom group
    deactivateClassroomGroupLearner: (
      state,
      action: PayloadAction<ChildDto>
    ) => {
      if (!state.classroomGroupLearners) return;

      const learnerIndex = state.classroomGroupLearners.findIndex(
        (learner) =>
          learner.userId === action.payload.userId &&
          learner.id === action.payload.id
      );

      if (learnerIndex < 0) return;

      const newDate = new Date();
      state.classroomGroupLearners[learnerIndex].stoppedAttendance =
        newDate.toISOString();
      state.classroomGroupLearners[learnerIndex].isActive = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getClassroom.fulfilled, (state, action) => {
      if (action.payload) {
        state.classroom = action.payload;
      }
    });
    builder.addCase(getClassroomGroups.fulfilled, (state, action) => {
      if (action.payload) {
        state.classroomGroups = action.payload;
      }
    });
    // TODO - might need to update this
    builder.addCase(getClassroomProgrammes.fulfilled, (state, action) => {
      if (action.payload) {
        state.classroomProgrammes = action.payload;
      }
    });
    builder.addCase(createLearner.fulfilled, (state, action) => {
      // TODO - should this add the learner to the class group in the state?
    });
    builder.addCase(updatePreschoolFee.fulfilled, (state, action) => {
      if (action.payload && !!state.classroom) {
        state.classroom = {
          ...state.classroom,
          preschoolFeeAmount: action.meta.arg.amount,
          preschoolFeeAmountLastUpdateDate: new Date() as unknown as string,
        };
      }
    });
  },
});

const { reducer: classroomsReducer, actions: classroomsActions } =
  classroomsSlice;

const classroomsPersistConfig = {
  key: 'classrooms',
  storage: localForage,
  blacklist: [],
};

export { classroomsPersistConfig, classroomsReducer, classroomsActions };
