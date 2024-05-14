import {
  ClassProgrammeDto,
  ClassroomDto,
  ClassroomGroupDto,
  LearnerDto,
  SiteAddressDto,
} from '@ecdlink/core';
import {
  ClassProgrammeInput,
  ClassroomGroupInput,
  ClassroomInput,
  LearnerInput,
  SiteAddressInput,
  WorkflowStatusEnum,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ClassroomGroupLearnerService } from '@services/ClassroomGroupLearnerService';
import { ClassroomGroupProgrammesService } from '@services/ClassroomGroupProgrammesService';
import { ClassroomGroupService } from '@services/ClassroomGroupService';
import { ClassroomService } from '@services/ClassroomService';
import { RootState, ThunkApiType } from '../types';
import { ClassroomDto as SimpleClassroomDto } from '@/models/classroom/classroom.dto';
import { ClassroomGroupDto as SimpleClassroomGroupDto } from '@/models/classroom/classroom-group.dto';

export const ClassroomActions = {
  GET_CLASSROOM: 'getClassroom',
  GET_CLASSROOM_GROUPS: 'getClassroomGroups',
};

export const getClassroom = createAsyncThunk<
  SimpleClassroomDto,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  ClassroomActions.GET_CLASSROOM,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroom: classroomCache },
    } = getState();

    if (!classroomCache) {
      try {
        let classroom: SimpleClassroomDto | undefined;
        if (userAuth?.auth_token) {
          classroom = await new ClassroomService(
            userAuth?.auth_token
          ).getClassroomForUser(userAuth?.id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!classroom) {
          return rejectWithValue('Error getting Classrooms');
        }
        return classroom;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return classroomCache;
    }
  }
);

export const getClassroomGroups = createAsyncThunk<
  SimpleClassroomGroupDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  ClassroomActions.GET_CLASSROOM_GROUPS,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomGroups: cache },
    } = getState();

    if (!cache) {
      try {
        let groups: SimpleClassroomGroupDto[] | undefined;

        if (userAuth?.auth_token) {
          groups = await new ClassroomGroupService(
            userAuth?.auth_token
          ).getClassroomGroupsForUser(userAuth?.id);
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
      return cache;
    }
  }
);

export const getClassroomProgrammes = createAsyncThunk<
  ClassProgrammeDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getClassroomProgrammes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomProgrammes: cache },
    } = getState();

    if (!cache) {
      try {
        let programmes: ClassProgrammeDto[] | undefined;

        if (userAuth?.auth_token) {
          programmes = await new ClassroomGroupProgrammesService(
            userAuth?.auth_token
          ).getClassroomProgrammes();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!programmes) {
          return rejectWithValue('Error getting Classroom Programmes');
        }

        return programmes;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return cache;
    }
  }
);

export const getClassroomGroupLearners = createAsyncThunk<
  LearnerDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getClassroomGroupLearners',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomGroupLearners: cache },
    } = getState();

    if (!cache) {
      try {
        let learners: LearnerDto[] | undefined;

        if (userAuth?.auth_token) {
          learners = await new ClassroomGroupLearnerService(
            userAuth?.auth_token
          ).getClassroomGroupLearners();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!learners) {
          return rejectWithValue('Error getting Classroom Group learners');
        }

        return learners;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return cache;
    }
  }
);

// This currently calls a generic GQL endpoint, may need to update
export const upsertClassroom = createAsyncThunk<
  boolean[],
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
    try {
      if (userAuth?.auth_token && classroom) {
        const input: ClassroomInput = {
          Id: classroom.id,
          UserId: classroom.principal.userId,
          //SiteAddressId: classroom.siteAddressId, This might be needed, but I need to test
          Name: classroom.name,
          ClassroomImageUrl: classroom.imageUrl,
          NumberPractitioners: classroom.numberOfPractitioners,
          NumberOfAssistants: classroom.numberOfPractitioners,
          NumberOfOtherAssistants: classroom.numberOfOtherAssistants,
          IsActive: true, // All classrooms/groups on FE will be active
          SiteAddress: classroom?.siteAddress
            ? mapSiteAddress(classroom.siteAddress)
            : null,
          PreschoolFeeAmount: classroom.preschoolFeeAmount || 0,
          PreschoolFeeAmountLastUpdateDate:
            classroom.preschoolFeeAmountLastUpdateDate,
        };

        const result = await new ClassroomService(
          userAuth?.auth_token
        ).updateClassroom(classroom.id ?? '', input);

        return [result];
      }
      return [false];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const upsertClassroomSiteAddress = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertClassroomSiteAddress',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroom },
    } = getState();
    try {
      if (userAuth?.auth_token && classroom) {
        const input: ClassroomInput = {
          Id: classroom.id,
          SiteAddressId: classroom.siteAddress.id,
          IsActive: true,
          SiteAddress: classroom?.siteAddress
            ? mapSiteAddress(classroom?.siteAddress!)
            : null,
        };

        const result = await new ClassroomService(
          userAuth?.auth_token
        ).updateClassroomSiteAddress(classroom.id ?? '', input);

        return [result];
      }
      return [false];
    } catch (err) {
      return rejectWithValue(err);
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
  'updateClassroomGroup',
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
        return classroomGroup;
      } else return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// TODO - need to test this, may need updates
export const upsertClassroomGroups = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertClassroomGroups',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomGroups },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];
      if (userAuth?.auth_token && classroomGroups) {
        promises = classroomGroups.map(async (x) => {
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
        });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateClassroomGroupProgrammes = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'updateClassroomGroupProgrammes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomProgrammes },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];

      if (userAuth?.auth_token && classroomProgrammes) {
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

export const upsertClassroomGroupProgrammes = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertClassroomGroupProgrammes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomProgrammes },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];
      if (classroomProgrammes?.some((item) => item?.isOnline === false)) {
        if (userAuth?.auth_token && classroomProgrammes) {
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
      }
      return [true];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateClassroomGroupLearners = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'updateClassroomGroupLearners',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomGroupLearners },
      children: { children },
      staticData: { WorkflowStatuses },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];
      const workflowStatus = WorkflowStatuses?.find(
        (x) => x.enumId === WorkflowStatusEnum.ChildExternalLink
      );

      if (userAuth?.auth_token && classroomGroupLearners) {
        promises = classroomGroupLearners
          .filter((classroomGroupLearner) => {
            const child = children?.find(
              (x) => x.userId === classroomGroupLearner.userId
            );
            return child && child.workflowStatusId !== workflowStatus?.id
              ? true
              : false;
          })
          .map(async (x) => {
            const input: LearnerInput = {
              UserId: x.userId,
              ClassroomGroupId: x.classroomGroupId,
              ProgrammeAttendanceReasonId: x.attendanceReasonId,
              OtherAttendanceReason: x.otherAttendanceReason,
              StartedAttendance: x.startedAttendance,
              StoppedAttendance: x.stoppedAttendance,
              IsActive: Boolean(x.isActive),
            };
            if (x.id && x.id.length > 0) {
              return await new ClassroomGroupLearnerService(
                userAuth?.auth_token
              ).updateLearner(x.id, input);
            } else {
              return !!(await new ClassroomGroupLearnerService(
                userAuth?.auth_token
              ).createLearner(input));
            }
          });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const upsertClassroomGroupLearners = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertClassroomGroupLearners',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomData: { classroomGroupLearners },
      children: { children },
      staticData: { WorkflowStatuses },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];
      const workflowStatus = WorkflowStatuses?.find(
        (x) => x.enumId === WorkflowStatusEnum.ChildExternalLink
      );
      if (classroomGroupLearners?.some((item) => item?.isOnline === false)) {
        if (userAuth?.auth_token && classroomGroupLearners) {
          promises = classroomGroupLearners
            .filter((classroomGroupLearner) => {
              const child = children?.find(
                (x) => x.userId === classroomGroupLearner.userId
              );
              return child && child.workflowStatusId !== workflowStatus?.id
                ? true
                : false;
            })
            .map(async (x) => {
              const input: LearnerInput = {
                UserId: x.userId,
                ClassroomGroupId: x.classroomGroupId,
                ProgrammeAttendanceReasonId: x.attendanceReasonId,
                OtherAttendanceReason: x.otherAttendanceReason,
                StartedAttendance: x.startedAttendance,
                StoppedAttendance: x.stoppedAttendance,
                IsActive: Boolean(x.isActive),
              };
              if (x.id && x.id.length > 0) {
                return await new ClassroomGroupLearnerService(
                  userAuth?.auth_token
                ).updateLearner(x.id, input);
              } else {
                return !!(await new ClassroomGroupLearnerService(
                  userAuth?.auth_token
                ).createLearner(input));
              }
            });
        }
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

export const updatePreschoolFee = createAsyncThunk<
  boolean,
  { classroomId: string; amount: number | undefined },
  ThunkApiType<RootState>
>(
  'updatePreschoolFee',
  async ({ classroomId, amount }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        await new ClassroomService(userAuth?.auth_token).updatePreschoolFee(
          classroomId,
          amount
        );

        return true;
      }
      return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
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
  AddressLine1: x.addressLine1,
  AddressLine2: x.addressLine2,
  AddressLine3: x.addressLine3,
  Name: x.name,
  PostalCode: x.postalCode,
  ProvinceId: x.provinceId,
  Ward: x.ward,
  IsActive: x.isActive === false ? false : true,
});
