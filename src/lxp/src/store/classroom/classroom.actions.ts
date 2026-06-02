import { ClassroomGroupDto, LearnerDto, SiteAddressDto } from '@ecdlink/core';
import {
  ClassProgrammeInput,
  ClassroomGroupInput,
  ClassroomInput,
  ClassroomMetricReport,
  LearnerInput,
  LearnerInputModelInput,
  SiteAddressInput,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ClassroomGroupLearnerService } from '@services/ClassroomGroupLearnerService';
import { ClassroomGroupProgrammesService } from '@services/ClassroomGroupProgrammesService';
import { ClassroomGroupService } from '@services/ClassroomGroupService';
import { ClassroomService } from '@services/ClassroomService';
import { RootState, ThunkApiType } from '../types';
import {
  ClassroomDto,
  ClassroomDto as SimpleClassroomDto,
} from '@/models/classroom/classroom.dto';
import { ClassroomGroupDto as SimpleClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { OverrideCache } from '@/models/sync/override-cache';
import { SiteAddressService } from '@/services/SiteAddressService';
import PermissionsService from '@/services/PermissionsService/PermissionsService';

export const ClassroomActions = {
  GET_CLASSROOM_FOR_USER: 'getClassroomForUser',
  GET_CLASSROOM_GROUPS: 'getClassroomGroups',
  GET_CLASSROOM_GROUP_FOR_CLASS_ID: 'getClassroomGroupForClassId',
  GET_CLASSROOM_FOR_TRIAL_PERIOD_USER: 'getClassroomForTrialPeriodUser',
  GET_CLASS_ATTENDANCE_METRICS_BY_USER: 'getClassAttendanceMetricsByUser',
  GET_CLASSROOM_FOR_PRESCHOOL_CODE: 'getClassroomForPreschoolCode',
  UPSERT_CLASSROOM_GROUPS: 'upsertClassroomGroups',
  UPSERT_CLASSROOM_GROUPS_LEARNERS: 'upsertClassroomGroupLearners',
  UPDATE_CLASSROOM_GROUP: 'updateClassroomGroup',
  UPSERT_CLASS_PROGRAMMES: 'upsertClassroomGroupProgrammes',
  ADD_CHILD_PROGRESS_REPORT_PERIODS: 'addChildProgressReportPeriods',
  UPSERT_CHILD_PROGRESS_REPORT_PERIODS: 'upsertChildProgressReportPeriods',
  UPDATE_CLASSROOM_PRACTITIONER_PERMISSIONS:
    'updateClassroomPractitionerPermissions',
  EDIT_ABSENTEE: 'editAbsentee',
  UPDATE_REASSIGN_CLASSROOM_GROUP: 'updateReassignClassroomGroup',
};

export const getClassroomForUser = createAsyncThunk<
  SimpleClassroomDto,
  { userId?: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  ClassroomActions.GET_CLASSROOM_FOR_USER,
  // eslint-disable-next-line no-empty-pattern
  async ({ userId, overrideCache = false }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroom: cache },
    } = getState();

    if (!!overrideCache || !cache) {
      try {
        let classroom: SimpleClassroomDto | undefined;
        if (userAuth?.auth_token) {
          classroom = await new ClassroomService(
            userAuth?.auth_token
          ).getClassroomForUser(userId);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        return classroom;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return cache;
    }
  }
);

export const getClassroomGroups = createAsyncThunk<
  SimpleClassroomGroupDto[],
  { practitionerUserId?: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  ClassroomActions.GET_CLASSROOM_GROUPS,
  // eslint-disable-next-line no-empty-pattern
  async (
    { practitionerUserId, overrideCache = false },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
      classroomData: { classroomGroupData: cache },
    } = getState();

    const hasClasses = cache.classroomGroups.length !== 0;

    if (!!overrideCache || !cache || !hasClasses) {
      try {
        let groups: SimpleClassroomGroupDto[] | undefined;

        if (userAuth?.auth_token) {
          groups = await new ClassroomGroupService(
            userAuth?.auth_token
          ).getClassroomGroupsForUser(practitionerUserId);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!groups) {
          return rejectWithValue('Error getting Classroom Groups');
        }

        groups.sort((a, b) => {
          return (a.name || '') > (b.name || '') ? 1 : -1;
        });

        return groups;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return cache.classroomGroups;
    }
  }
);

export const getClassroomGroupForClassId = createAsyncThunk<
  SimpleClassroomGroupDto,
  { classroomGroupId?: string },
  ThunkApiType<RootState>
>(
  ClassroomActions.GET_CLASSROOM_GROUP_FOR_CLASS_ID,
  // eslint-disable-next-line no-empty-pattern
  async ({ classroomGroupId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let group: SimpleClassroomGroupDto | undefined;

      if (userAuth?.auth_token) {
        group = await new ClassroomGroupService(
          userAuth?.auth_token
        ).getClassroomGroupForClassId(classroomGroupId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!group) {
        return rejectWithValue('Error getting Classroom Groups');
      }
      return group;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const upsertClassroom = createAsyncThunk<
  boolean,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertClassroom',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroom },
    } = getState();

    const token = userAuth?.auth_token;
    const shouldSyncClassroom = Boolean(
      token && classroom && !classroom.synced
    );

    if (!shouldSyncClassroom) {
      return false;
    }

    try {
      if (userAuth?.auth_token && classroom && !classroom?.synced) {
        const input: ClassroomInput = {
          Id: classroom.id,
          UserId: classroom.principal.userId,
          SiteAddressId: classroom.siteAddress?.id
            ? classroom.siteAddress?.id
            : null,
          Name: classroom.name,
          ClassroomImageUrl: classroom.classroomImageUrl,
          IsActive: true, // All classrooms/groups on FE will be active
          SiteAddress: classroom?.siteAddress?.addressLine1
            ? mapSiteAddress(classroom.siteAddress as any)
            : null,
          PreschoolCode: classroom?.preschoolCode,
        };

        if (classroom?.siteAddress?.id) {
          const addressInput = mapSiteAddress(classroom.siteAddress as any);

          await new SiteAddressService(userAuth?.auth_token!).updateSiteAddress(
            classroom.siteAddress.id ?? '',
            addressInput
          );

          input.SiteAddressId = addressInput.Id;
        }

        // if (
        //   classroom!.childProgressReportPeriods?.some((a) => a.synced === false)
        // ) {
        //   await new ClassroomService(
        //     userAuth?.auth_token
        //   ).addChildProgressReportPeriods(
        //     classroom!.id,
        //     classroom!.childProgressReportPeriods
        //       ?.filter((y) => y.synced === false)
        //       .map((x) => ({
        //         id: x.id,
        //         startDate: new Date(x.startDate),
        //         endDate: new Date(x.endDate),
        //       }))
        //   );
        // }

        const result = await new ClassroomService(
          userAuth?.auth_token
        ).updateClassroom(classroom.id ?? '', input);

        return result;
      }
      return false;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const upsertChildProgressReportPeriods = createAsyncThunk<
  boolean,
  {}, // no payload needed
  { state: RootState }
>(
  'childProgressReportPeriods/upsert',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const { userAuth } = state.auth;
    const { classroom } = state.classroomData;

    // Early returns + better guard clauses
    if (!userAuth?.auth_token) {
      return rejectWithValue('No authentication token available');
    }

    if (!classroom?.id) {
      return rejectWithValue('No classroom selected');
    }

    if (!classroom.childProgressReportPeriods?.length) {
      return true; // nothing to sync → consider success
    }

    const token = userAuth.auth_token;

    // Only take periods that need syncing
    const periodsToSync = classroom.childProgressReportPeriods
      .filter((period) => period.synced === false)
      .map((period) => ({
        id: period.id,
        startDate: new Date(period.startDate),
        endDate: new Date(period.endDate),
      }));

    // Nothing to update → early success
    if (periodsToSync.length === 0) {
      return true;
    }

    try {
      await new ClassroomService(token).addChildProgressReportPeriods(
        classroom.id,
        periodsToSync
      );

      return true;
    } catch (err: any) {
      console.error('Failed to upsert progress report periods:', err);

      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          'Failed to save progress report periods'
      );
    }
  }
);

type UpdateClassroomGroupdRequest = {
  classroomGroup: ClassroomGroupDto;
  id: string;
};

export const updateClassroomGroup = createAsyncThunk<
  ClassroomGroupDto,
  UpdateClassroomGroupdRequest,
  ThunkApiType<RootState>
>(
  ClassroomActions.UPDATE_CLASSROOM_GROUP,
  async ({ classroomGroup }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userAuth },
      } = getState();
      if (userAuth?.auth_token) {
        const input = mapClassroomGroupInput(classroomGroup);

        await new ClassroomGroupService(
          userAuth?.auth_token
        ).updateClassroomGroup(input.Id || '', input);

        // Sync learners

        return classroomGroup;
      } else return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const upsertClassroomGroups = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  ClassroomActions.UPSERT_CLASSROOM_GROUPS,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomGroupData },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];
      if (userAuth?.auth_token) {
        promises = classroomGroupData.classroomGroups
          .filter((group) => !group.synced)
          .map(async (x) => {
            const input: ClassroomGroupInput = {
              Id: x.id,
              ClassroomId: x.classroomId,
              Name: x.name,
              IsActive: true,
              UserId: x.userId,
            };

            return await new ClassroomGroupService(
              userAuth?.auth_token
            ).updateClassroomGroup(x.id ?? '', input);

            // Sync learners
          });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const upsertClassroomGroupProgrammes = createAsyncThunk<
  boolean[],
  {},
  ThunkApiType<RootState>
>(
  ClassroomActions.UPSERT_CLASS_PROGRAMMES,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomGroupData },
    } = getState();

    const classroomProgrammes = classroomGroupData.classroomGroups
      .flatMap((x) => x.classProgrammes)
      .filter((x) => !x.synced);

    try {
      let promises: Promise<boolean>[] = [];
      if (userAuth?.auth_token && classroomProgrammes.length) {
        promises = classroomProgrammes.map(async (x) => {
          const input: ClassProgrammeInput = {
            Id: x.id,
            ClassroomGroupId: x.classroomGroupId,
            ProgrammeStartDate: x.programmeStartDate ?? new Date(),
            MeetingDay: x.meetingDay,
            IsFullDay: x.isFullDay,
            IsActive: x.isActive === false ? false : true,
          };

          return await new ClassroomGroupProgrammesService(
            userAuth?.auth_token
          ).updateClassProgramme(x.id ?? '', input);
        });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Syncs all learners on each classroomgroup
export const upsertClassroomGroupLearners = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  ClassroomActions.UPSERT_CLASSROOM_GROUPS_LEARNERS,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomGroupData },
    } = getState();
    try {
      let promises: Promise<boolean>[] = [];
      if (!!userAuth && !!userAuth?.auth_token) {
        classroomGroupData.classroomGroups.forEach((classroomGroup) => {
          const newPromises = classroomGroup.learners
            .filter((l) => !l.synced)
            .map(async (x) => {
              const input: LearnerInput = {
                UserId: x.childUserId,
                ClassroomGroupId: classroomGroup.id,
                StartedAttendance: x.startedAttendance,
                StoppedAttendance: x.stoppedAttendance,
                IsActive: x.isActive,
              };
              if (x.isActive === false) {
                const updateInput: LearnerInputModelInput = {
                  userId: x.childUserId,
                  classroomGroupId: classroomGroup.id,
                  startedAttendance: x.startedAttendance,
                  stoppedAttendance: x.stoppedAttendance,
                  isActive: x.isActive,
                };
                return await new ClassroomGroupLearnerService(
                  userAuth?.auth_token
                ).updateLearnerWithUserId(x.childUserId, updateInput);
              } else if (!!x.learnerId && x.learnerId.length > 0) {
                return await new ClassroomGroupLearnerService(
                  userAuth?.auth_token
                ).updateLearner(x.learnerId, input);
              } else {
                // Use the atomic move operation. This ensures only one active learner
                // exists for the child on the server, even in multi-device / offline sync races.
                // The backend also updates Learner and Child hierarchy fields so the child
                // is correctly linked to the practitioner of the new classroom group.
                await new ClassroomGroupLearnerService(
                  userAuth?.auth_token
                ).moveChildToClassroomGroup(
                  input.UserId,
                  input.ClassroomGroupId,
                  input.StartedAttendance
                );
                return true;
              }
            });

          promises = promises.concat(newPromises);
        });
      } else {
        return rejectWithValue('No auth');
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type UpdateLearnerRequest = {
  learner: LearnerDto;
  id: string;
};

export const updateLearner = createAsyncThunk<
  LearnerDto,
  UpdateLearnerRequest,
  ThunkApiType<RootState>
>('updateLearner', async ({ learner, id }, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    if (userAuth?.auth_token) {
      const input = mapLearnerInput(learner);

      await new ClassroomGroupLearnerService(
        userAuth?.auth_token
      ).updateLearner(id, input);

      return learner;
    }
    return rejectWithValue('no access token, profile check required');
  } catch (err) {
    return rejectWithValue(err);
  }
});

type CreateLearnerRequest = {
  learner: LearnerDto;
};

export const createLearner = createAsyncThunk<
  LearnerDto,
  CreateLearnerRequest,
  ThunkApiType<RootState>
>('createLearner', async ({ learner }, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    if (userAuth?.auth_token) {
      const input = mapLearnerInput(learner);

      await new ClassroomGroupLearnerService(
        userAuth?.auth_token
      ).createLearner(input);

      return learner;
    }
    return rejectWithValue('no access token, profile check required');
  } catch (err) {
    return rejectWithValue(err);
  }
});

/**
 * Recommended way to move a child to a different class.
 * Uses the new MoveChildToClassroomGroup backend mutation which safely
 * handles closing any previous active learner record.
 */
export const moveChildToNewClass = createAsyncThunk<
  {
    result: any;
    childUserId: string;
    oldClassroomGroupId?: string;
    newClassroomGroupId: string;
  },
  {
    childUserId: string;
    newClassroomGroupId: string;
    oldClassroomGroupId?: string;
    startedAttendance?: string | Date;
  },
  ThunkApiType<RootState>
>(
  'moveChildToNewClass',
  async (
    {
      childUserId,
      newClassroomGroupId,
      oldClassroomGroupId,
      startedAttendance,
    },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const result = await new ClassroomGroupLearnerService(
          userAuth?.auth_token
        ).moveChildToClassroomGroup(
          childUserId,
          newClassroomGroupId,
          startedAttendance
        );

        // Hierarchy updates (Learner + Child + UserHierarchy) are now fully handled
        // inside the backend MoveChildToClassroomGroup mutation. No FE call needed.

        return {
          result,
          childUserId,
          oldClassroomGroupId,
          newClassroomGroupId,
        };
      }
      return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addChildProgressReportPeriods = createAsyncThunk<
  boolean,
  {
    classroomId: string;
    childProgressReportPeriods: {
      id: string;
      startDate: Date;
      endDate: Date;
    }[];
  },
  ThunkApiType<RootState>
>(
  ClassroomActions.ADD_CHILD_PROGRESS_REPORT_PERIODS,
  async (
    { classroomId, childProgressReportPeriods },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        await new ClassroomService(
          userAuth?.auth_token
        ).addChildProgressReportPeriods(
          classroomId,
          childProgressReportPeriods
        );

        return true;
      }
      return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateClassroomPractitionerPermissions = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  ClassroomActions.UPDATE_CLASSROOM_PRACTITIONER_PERMISSIONS,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomPractitioners },
    } = getState();
    try {
      let promises: Promise<any>[] = [];
      if (!!userAuth && !!userAuth?.auth_token) {
        const service = new PermissionsService(userAuth?.auth_token);
        promises = classroomPractitioners.map(async (e) => {
          return await service.UpdateUserPermission(e);
        });

        return Promise.all(promises);
      } else {
        return rejectWithValue('No auth');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const editAbsentee = createAsyncThunk<
  boolean,
  {
    absenteeId: string;
    deleteAbsentee: boolean;
    reassignedToPractitioner: string;
    reason: string;
    absentDate: Date;
    absentDateEnd?: Date;
    isRoleAssign?: boolean;
    roleAssignedToUser?: string;
  },
  ThunkApiType<RootState>
>(
  ClassroomActions.EDIT_ABSENTEE,
  async (
    {
      absenteeId,
      deleteAbsentee,
      reassignedToPractitioner,
      reason,
      absentDate,
      absentDateEnd,
      isRoleAssign,
      roleAssignedToUser,
    },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new ClassroomGroupService(userAuth?.auth_token).editAbsentee(
        absenteeId,
        deleteAbsentee,
        reassignedToPractitioner,
        reason,
        absentDate,
        absentDateEnd,
        isRoleAssign,
        roleAssignedToUser
      );
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to edit Absentee'
      );
    }
  }
);

export const getClassAttendanceMetricsByUser = createAsyncThunk<
  ClassroomMetricReport[],
  { userId: string; startMonth: Date; endMonth: Date },
  ThunkApiType<RootState>
>(
  ClassroomActions.GET_CLASS_ATTENDANCE_METRICS_BY_USER,
  async ({ userId, startMonth, endMonth }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new ClassroomGroupService(
        userAuth?.auth_token
      ).getClassAttendanceMetricsByUser(userId, startMonth, endMonth);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to get Class Attendance Metrics By User'
      );
    }
  }
);

export const updateReassignClassroomGroup = createAsyncThunk<
  boolean,
  {
    practitionerId: string;
    reassignedToPractitioner: string;
    reason: string;
    absentDate: Date;
    loggedByUser: string;
    classProgram: string;
    absentDateEnd?: Date;
    fromRole?: string;
    toRole?: string;
    roleAssignedToUser?: string;
  },
  ThunkApiType<RootState>
>(
  ClassroomActions.UPDATE_REASSIGN_CLASSROOM_GROUP,
  async (
    {
      practitionerId,
      reassignedToPractitioner,
      reason,
      absentDate,
      loggedByUser,
      classProgram,
      absentDateEnd,
      fromRole,
      toRole,
      roleAssignedToUser,
    },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new ClassroomGroupService(
        userAuth?.auth_token
      ).updateReassignClassroomGroup(
        practitionerId,
        reassignedToPractitioner,
        reason,
        absentDate,
        loggedByUser,
        classProgram,
        absentDateEnd,
        fromRole,
        toRole,
        roleAssignedToUser
      );
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to update Reassign ClassroomGroup'
      );
    }
  }
);

export const getClassroomForPreschoolCode = createAsyncThunk<
  ClassroomDto,
  { preSchoolCode: string },
  ThunkApiType<RootState>
>(
  ClassroomActions.GET_CLASSROOM_FOR_PRESCHOOL_CODE,
  async ({ preSchoolCode }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new ClassroomService(
        userAuth?.auth_token
      ).getClassroomForPreschoolCode(preSchoolCode);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to get Classroom For Preschool Code'
      );
    }
  }
);

const mapClassroomGroupInput = (
  x: Partial<ClassroomGroupDto>
): ClassroomGroupInput => ({
  UserId: x.userId,
  ClassroomId: x.classroomId,
  Name: x.name,
  ProgrammeTypeId: x.programmeTypeId,
  IsActive: Boolean(x.isActive),
  Id: x?.id,
});

const mapLearnerInput = (learnerDto: Partial<LearnerDto>): LearnerInput => ({
  Id: learnerDto.id,
  UserId: learnerDto.userId,
  ClassroomGroupId: learnerDto.classroomGroupId,
  ProgrammeAttendanceReasonId: learnerDto.attendanceReasonId,
  OtherAttendanceReason: learnerDto.otherAttendanceReason,
  StartedAttendance: learnerDto.startedAttendance,
  StoppedAttendance: learnerDto.stoppedAttendance,
  IsActive: learnerDto.isActive === false ? false : true,
});

const mapSiteAddress = (x: Partial<SiteAddressDto>): SiteAddressInput => ({
  Id: x.id,
  Area: x.area,
  AddressLine1: x.addressLine1,
  AddressLine2: x.addressLine2,
  AddressLine3: x.addressLine3,
  Latitude: !!x.latitude ? x.latitude.toString() : undefined,
  Longitude: !!x.longitude ? x.longitude.toString() : undefined,
  Municipality: x.municipality,
  Name: x.name,
  PostalCode: x.postalCode,
  ProvinceId: x.provinceId,
  Province: null,
  Ward: x.ward,
  IsActive: x.isActive === false ? false : true,
});
