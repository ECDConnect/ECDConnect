import { ClassroomGroupDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getClassroomGroups,
  getClassroomForUser,
  upsertClassroom,
  upsertClassroomGroups,
  updateClassroomGroup,
  upsertClassroomGroupLearners,
  upsertClassroomGroupProgrammes,
  addChildProgressReportPeriods,
  getClassroomGroupForClassId,
  upsertChildProgressReportPeriods,
  moveChildToNewClass,
} from './classroom.actions';
import { ClassroomState } from './classroom.types';
import { ClassroomDto as SimpleClassroomDto } from '@/models/classroom/classroom.dto';
import { ClassroomGroupDto as SimpleClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { SiteAddressDto } from '@/models/classroom/site-address.dto';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { formatISO } from 'date-fns';
import { UpdateUserPermissionInputModelInput } from '@ecdlink/graphql';

const initialState: ClassroomState = {
  classroom: undefined,
  classroomGroupData: {
    classroomGroups: [],
    dateRefreshed: undefined,
  },
  classroomPractitioners: [],
};

const classroomsSlice = createSlice({
  name: 'classrooms',
  initialState,
  reducers: {
    resetClassroomState: (state) => {
      state.classroom = initialState.classroom;
      state.classroomGroupData = initialState.classroomGroupData;
      state.classroomPractitioners = initialState.classroomPractitioners;
    },
    resetClassroomObjects: (state) => {
      state.classroomGroupData = initialState.classroomGroupData;
      state.classroomPractitioners = initialState.classroomPractitioners;
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
          synced: false,
        };
      }
    },
    updateClassroomGroup: (
      state,
      action: PayloadAction<SimpleClassroomGroupDto>
    ) => {
      const payloadUpdated = { ...action.payload };
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
    deleteLearner: (
      state,
      action: PayloadAction<{ childUserId: string; classroomGroupId: string }>
    ) => {
      state.classroomGroupData.classroomGroups =
        state.classroomGroupData.classroomGroups.map((classroomGroup) =>
          classroomGroup.id === action.payload.classroomGroupId
            ? {
                ...classroomGroup,
                learners: classroomGroup.learners.filter(
                  (learner) =>
                    learner.childUserId !== action.payload.childUserId
                ),
              }
            : classroomGroup
        );
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
      const { childUserId, newClassroomGroupId } = action.payload;

      state.classroomGroupData.classroomGroups =
        state.classroomGroupData.classroomGroups.map((classroomGroup) => {
          if (classroomGroup.id !== newClassroomGroupId) return classroomGroup;

          // Best-effort local guard: if this child already has an active learner
          // in this class in local state, don't create a duplicate.
          const alreadyHasActiveInThisClass = classroomGroup.learners.some(
            (l) =>
              l.childUserId === childUserId &&
              l.isActive &&
              !l.stoppedAttendance
          );

          if (alreadyHasActiveInThisClass) {
            return classroomGroup;
          }

          return {
            ...classroomGroup,
            learners: [
              ...classroomGroup.learners,
              {
                learnerId: '',
                childUserId,
                startedAttendance: formatISO(new Date()),
                isActive: true,
                stoppedAttendance: null,
                synced: false,
                classroomGroupId: classroomGroup.id,
                userId: childUserId,
              },
            ],
          };
        });
    },
    createClassroom: (state, action: PayloadAction<SimpleClassroomDto>) => {
      state.classroom = {
        ...action.payload,
        dateRefreshed: undefined,
        synced: false,
      };
    },
    createClassroomPractitioner: (
      state,
      action: PayloadAction<UpdateUserPermissionInputModelInput>
    ) => {
      const userExist = state.classroomPractitioners.find(
        (x) => x.userId === action.payload.userId
      );
      if (!userExist) state.classroomPractitioners.push(action.payload);
    },
    deleteClassroomPractitioner: (state) => {
      state.classroomPractitioners = [];
    },
    createClassroomGroup: (
      state,
      action: PayloadAction<SimpleClassroomGroupDto>
    ) => {
      const payloadUpdated = { ...action.payload, synced: false };
      state.classroomGroupData.classroomGroups.push(payloadUpdated);
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
    addChildProgressReportPeriod: (
      state,
      action: PayloadAction<{
        childProgressReportPeriods: Array<{
          id: string;
          startDate: string;
          endDate: string;
          synced: boolean;
        }>;
      }>
    ) => {
      if (!state.classroom) return;

      const existingPeriods = state.classroom.childProgressReportPeriods || [];

      const newPeriods = action.payload.childProgressReportPeriods.filter(
        (newPeriod) => {
          return !existingPeriods.some(
            (existing) => existing.id === newPeriod.id
          );
        }
      );

      if (newPeriods.length === 0) return; // Nothing to add

      state.classroom = {
        ...state.classroom,
        childProgressReportPeriods: [
          ...existingPeriods,
          ...newPeriods.map((x) => ({
            id: x.id,
            startDate: x.startDate,
            endDate: x.endDate,
            synced: x.synced,
          })),
        ],
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getClassroomForUser.fulfilled, (state, action) => {
      if (action.payload) {
        state.classroom = {
          ...action.payload,
          dateRefreshed: new Date().toDateString(),
          synced: true,
        };
      }
    });
    builder.addCase(getClassroomGroupForClassId.fulfilled, (state, action) => {
      if (!action.payload) return;

      const classIndex = state.classroomGroupData.classroomGroups.findIndex(
        (item) => item.id === action.payload.id
      );

      if (classIndex === -1) {
        state.classroomGroupData.classroomGroups.push(action.payload);
      } else {
        state.classroomGroupData.classroomGroups[classIndex] = action.payload;
      }
    });
    builder.addCase(getClassroomGroups.fulfilled, (state, action) => {
      if (!action.payload) return;

      const incomingGroups = action.payload;

      // Create a map of incoming groups by id for fast lookup
      const incomingMap = new Map(incomingGroups.map((cg) => [cg.id, cg]));

      // Start with current state or empty array if none exists
      const currentGroups = state.classroomGroupData?.classroomGroups ?? [];

      // Build the new array by merging/updating existing groups and adding new ones
      const updatedGroups = currentGroups.map((existing) => {
        const incoming = incomingMap.get(existing.id);

        if (!incoming) {
          // Group was removed remotely
          return { ...existing, synced: true, isActive: false };
        }

        // Group exists → update it
        return {
          ...existing, // keep any local-only fields you might have
          ...incoming, // overwrite with fresh server data
          synced: true,
          learners: incoming.learners.map((l) => ({
            ...l,
            synced: true,
          })),
          classProgrammes: incoming.classProgrammes.map((p) => ({
            ...p,
            synced: true,
          })),
        };
      });

      // Add any completely new groups that weren't in the current state
      const newGroups = incomingGroups
        .filter(
          (cg) => !currentGroups.some((existing) => existing.id === cg.id)
        )
        .map((cg) => ({
          ...cg,
          synced: true,
          learners: cg.learners.map((l) => ({ ...l, synced: true })),
          classProgrammes: cg.classProgrammes.map((p) => ({
            ...p,
            synced: true,
          })),
        }));

      const finalGroups = [...updatedGroups, ...newGroups];

      // Update state (preserving dateRefreshed pattern)
      state.classroomGroupData = {
        ...state.classroomGroupData, // keep any other fields you might have added later
        classroomGroups: finalGroups,
        dateRefreshed: new Date().toDateString(),
      };
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

    // Keep Redux learner state in sync after using the atomic MoveChildToClassroomGroup
    builder.addCase(moveChildToNewClass.fulfilled, (state, action) => {
      const { childUserId, oldClassroomGroupId, newClassroomGroupId, result } =
        action.payload;

      if (!childUserId || !newClassroomGroupId) return;

      const nowIso = new Date().toUTCString();
      const serverLearner = result; // the returned Learner from backend

      state.classroomGroupData = {
        ...state.classroomGroupData,
        classroomGroups: state.classroomGroupData.classroomGroups.map(
          (group) => {
            // Close the learner in the old classroom group (if we know which one)
            if (oldClassroomGroupId && group.id === oldClassroomGroupId) {
              return {
                ...group,
                learners: group.learners.map((learner) =>
                  learner.childUserId === childUserId
                    ? {
                        ...learner,
                        isActive: false,
                        stoppedAttendance: nowIso,
                        synced: true,
                      }
                    : learner
                ),
              };
            }

            // Add or update the learner in the new classroom group
            if (group.id === newClassroomGroupId) {
              const existingIndex = group.learners.findIndex(
                (l) => l.childUserId === childUserId
              );

              const newLearnerEntry = {
                learnerId: serverLearner?.id || '',
                childUserId,
                startedAttendance:
                  serverLearner?.startedAttendance || new Date().toISOString(),
                stoppedAttendance: serverLearner?.stoppedAttendance || null,
                isActive: serverLearner?.isActive ?? true,
                synced: true,
                classroomGroupId: newClassroomGroupId,
                userId: childUserId,
              };

              if (existingIndex >= 0) {
                // Update existing entry
                const updatedLearners = [...group.learners];
                updatedLearners[existingIndex] = {
                  ...updatedLearners[existingIndex],
                  ...newLearnerEntry,
                };
                return { ...group, learners: updatedLearners };
              } else {
                // Add new entry
                return {
                  ...group,
                  learners: [...group.learners, newLearnerEntry],
                };
              }
            }

            return group;
          }
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
    builder.addCase(
      addChildProgressReportPeriods.fulfilled,
      (state, action) => {
        if (state.classroom) {
          // Prefer the authoritative set the server returned (it may carry different
          // ids when another device created the periods first). Fall back to the
          // submitted set only if the server returned nothing.
          const serverPeriods = action.payload;
          const periods =
            serverPeriods && serverPeriods.length
              ? serverPeriods
              : action.meta.arg.childProgressReportPeriods;

          state.classroom = {
            ...state.classroom,
            childProgressReportPeriods: periods.map((x) => ({
              id: x.id,
              startDate: x.startDate.toString(),
              endDate: x.endDate.toString(),
              synced: true,
            })),
          };
        }
      }
    );
    builder.addCase(
      upsertChildProgressReportPeriods.fulfilled,
      (state, action) => {
        if (state.classroom) {
          const { serverPeriods, submittedPeriods } = action.payload;
          const existing = state.classroom.childProgressReportPeriods ?? [];

          if (serverPeriods && serverPeriods.length) {
            // Drop the periods we just tried to sync (their ids may have lost to
            // another device's ids) and re-add the authoritative server set, keeping
            // any other periods untouched. Keyed by id so server entries win.
            const submittedIds = new Set(submittedPeriods.map((p) => p.id));
            const byId = new Map<
              string,
              {
                id: string;
                startDate: string;
                endDate: string;
                synced: boolean;
              }
            >();

            existing
              .filter((p) => !submittedIds.has(p.id))
              .forEach((p) => byId.set(p.id, { ...p, synced: true }));

            serverPeriods.forEach((p) =>
              byId.set(p.id, {
                id: p.id,
                startDate: p.startDate.toString(),
                endDate: p.endDate.toString(),
                synced: true,
              })
            );

            state.classroom = {
              ...state.classroom,
              childProgressReportPeriods: Array.from(byId.values()),
            };
          } else {
            // Nothing came back to reconcile; keep prior behaviour.
            state.classroom = {
              ...state.classroom,
              childProgressReportPeriods: existing.map((period) => ({
                ...period,
                synced: true,
              })),
            };
          }
        }
        setFulfilledThunkActionStatus(state, action);
      }
    );
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
