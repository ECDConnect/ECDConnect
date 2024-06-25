import { ClassProgrammeDto, ClassroomGroupDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getClassroomGroups,
  //getClassroomProgrammes,
  getClassroom,
  updatePreschoolFee,
  createLearner,
  upsertClassroom,
  upsertClassroomGroups,
  updateClassroomGroup,
  upsertClassroomGroupLearners,
  upsertClassroomGroupProgrammes,
} from './classroom.actions';
import { ClassroomState } from './classroom.types';
import { ClassroomDto as SimpleClassroomDto } from '@/models/classroom/classroom.dto';
import { ClassroomGroupDto as SimpleClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { SiteAddressDto } from '@/models/classroom/site-address.dto';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { formatISO } from 'date-fns';

const initialState: ClassroomState = {
  classroom: undefined,
  classroomGroupData: {
    classroomGroups: [],
    dateRefreshed: undefined,
  },
};

const classroomsSlice = createSlice({
  name: 'classrooms',
  initialState,
  reducers: {
    resetClassroomState: (state) => {
      state.classroom = initialState.classroom;
      state.classroomGroupData = initialState.classroomGroupData;
    },
    updateClassroom: (state, action: PayloadAction<SimpleClassroomDto>) => {
      state.classroom = {
        ...action.payload,
        dateRefreshed: state.classroom?.dateRefreshed,
        synced: false,
      };
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
    updateClassroomNumberPractitioners: (
      state,
      action: PayloadAction<number>
    ) => {
      if (state.classroom) {
        state.classroom.numberOfPractitioners = action.payload;
      }
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
    deactivateLearner: (
      state,
      action: PayloadAction<{ childUserId: string; classroomGroupId: string }>
    ) => {
      state.classroomGroupData.classroomGroups =
        state.classroomGroupData.classroomGroups.map((classroomGroup) =>
          classroomGroup.id === action.payload.classroomGroupId
            ? {
                ...classroomGroup,
                learners: classroomGroup.learners.map((learner) =>
                  learner.childUserId === action.payload.childUserId
                    ? {
                        ...learner,
                        isActive: false,
                        stoppedAttendance: new Date().toUTCString(),
                        synced: false,
                      }
                    : learner
                ),
              }
            : classroomGroup
        );
    },
    createLearner: (
      state,
      action: PayloadAction<{
        childUserId: string;
        newClassroomGroupId: string;
      }>
    ) => {
      state.classroomGroupData.classroomGroups =
        state.classroomGroupData.classroomGroups.map((classroomGroup) =>
          classroomGroup.id === action.payload.newClassroomGroupId
            ? {
                ...classroomGroup,
                learners: classroomGroup.learners.concat({
                  learnerId: '',
                  childUserId: action.payload.childUserId,
                  startedAttendance: formatISO(new Date()),
                  isActive: true,
                  stoppedAttendance: undefined,
                  synced: false,
                }),
              }
            : classroomGroup
        );
    },
    createClassroom: (state, action: PayloadAction<SimpleClassroomDto>) => {
      state.classroom = {
        ...action.payload,
        dateRefreshed: undefined,
        synced: false,
      };
    },
    createClassroomGroup: (
      state,
      action: PayloadAction<SimpleClassroomGroupDto>
    ) => {
      const payloadUpdated = { ...action.payload, synced: false };
      state.classroomGroupData.classroomGroups.push(payloadUpdated);
    },
    // Only used during classroom setup it seems, is this still used? Only state gets updated, no BE sync
    // Should deactivate instead, so we can sync later
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
  },
  extraReducers: (builder) => {
    builder.addCase(getClassroom.fulfilled, (state, action) => {
      if (action.payload) {
        state.classroom = {
          ...action.payload,
          dateRefreshed: new Date().toDateString(),
          synced: true,
        };
      }
    });
    builder.addCase(getClassroomGroups.fulfilled, (state, action) => {
      if (action.payload) {
        state.classroomGroupData = {
          classroomGroups: action.payload.map((cg) => ({
            ...cg,
            synced: true,
            learners: cg.learners.map((l) => ({ ...l, synced: true })),
            classProgrammes: cg.classProgrammes.map((p) => ({
              ...p,
              synced: true,
            })),
          })),
          dateRefreshed: new Date().toDateString(),
        };
      }
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
    builder.addCase(upsertClassroom.fulfilled, (state, action) => {
      if (state.classroom) {
        state.classroom.synced = true;
      }
    });
    builder.addCase(upsertClassroomGroups.fulfilled, (state, action) => {
      state.classroomGroupData = {
        ...state.classroomGroupData,
        classroomGroups: state.classroomGroupData.classroomGroups.map(
          (group) => ({
            ...group,
            synced: true,
          })
        ),
      };
    });
    builder.addCase(upsertClassroomGroupLearners.fulfilled, (state, action) => {
      state.classroomGroupData = {
        ...state.classroomGroupData,
        classroomGroups: state.classroomGroupData.classroomGroups.map(
          (group) => ({
            ...group,
            learners: group.learners.map((learner) => ({
              ...learner,
              synced: true,
            })),
          })
        ),
      };
    });
    builder.addCase(
      upsertClassroomGroupProgrammes.fulfilled,
      (state, action) => {
        state.classroomGroupData = {
          ...state.classroomGroupData,
          classroomGroups: state.classroomGroupData.classroomGroups.map(
            (group) => ({
              ...group,
              classProgrammes: group.classProgrammes
                .filter((x) => x.isActive)
                .map((programme) => ({
                  ...programme,
                  synced: true,
                })),
            })
          ),
        };
      }
    );
    setThunkActionStatus(builder, updateClassroomGroup);
    builder.addCase(updateClassroomGroup.fulfilled, (state, action) => {
      const isActive = action.meta?.arg?.classroomGroup?.isActive;
      const classroomGroupId = action.meta?.arg?.id;

      if (isActive === false) {
        state.classroomGroupData.classroomGroups =
          state.classroomGroupData.classroomGroups.filter(
            (cg) => cg.id !== classroomGroupId
          );
      }

      setFulfilledThunkActionStatus(state, action);
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
