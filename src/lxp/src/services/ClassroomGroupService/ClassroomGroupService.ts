import { Config } from '@ecdlink/core';
import { ClassroomGroupInput, ClassroomMetricReport } from '@ecdlink/graphql';
import { api } from '../axios.helper';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
class ClassroomGroupService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getClassroomGroupById(id: string): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetClassroomGroupById',
      variables: {
        id: id,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Classroom Group by id failed - Server connection error'
      );
    }

    return response.data.data.GetClassroomGroupById;
  }

  async getClassroomGroupsForUser(
    practitionerUserId?: string
  ): Promise<ClassroomGroupDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { classroomGroupsForUser: ClassroomGroupDto[] };
      errors?: {};
    }>(``, {
      id: 'GetClassroomGroupsForUser',
      variables: {
        userId: practitionerUserId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'GetClassroomGroupsForUser Failed - Server connection error'
      );
    }

    return response.data.data.classroomGroupsForUser;
  }

  async getClassroomGroupForClassId(
    classroomGroupId?: string
  ): Promise<ClassroomGroupDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { classroomGroupForClassId: ClassroomGroupDto };
      errors?: {};
    }>(``, {
      id: 'GetClassroomGroupForClassId',
      variables: {
        classroomGroupId: classroomGroupId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'GetClassroomGroupForClassId Failed - Server connection error'
      );
    }

    return response.data.data.classroomGroupForClassId;
  }

  async updateClassroomGroup(
    id: string,
    input: ClassroomGroupInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateClassroomGroup',
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Updating classroom group failed - Server connection error'
      );
    }

    return true;
  }

  async updateReassignClassroomGroup(
    practitionerId: string,
    reassignedToPractitioner: string,
    reason: string,
    absentDate: Date,
    loggedByUser: string,
    classProgram: string,
    absentDateEnd?: Date,
    fromRole?: string,
    toRole?: string,
    roleAssignedToUser?: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'addAbsenteeForPractitioner',
      variables: {
        practitionerId: practitionerId,
        reassignedToPractitioner: reassignedToPractitioner,
        reason: reason,
        absentDate: absentDate,
        loggedByUser: loggedByUser,
        classProgram: classProgram,
        absentDateEnd: absentDateEnd,
        fromRole: fromRole,
        toRole: toRole,
        roleAssignedToUser: roleAssignedToUser,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Updating classroom group failed - Server connection error'
      );
    }

    return true;
  }

  async editAbsentee(
    absenteeId: string,
    deleteAbsentee: boolean,
    reassignedToPractitioner: string,
    reason: string,
    absentDate: Date,
    absentDateEnd?: Date,
    isRoleAssign?: boolean,
    roleAssignedToUser?: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'editAbsentee',
      variables: {
        absenteeId,
        deleteAbsentee,
        reassignedToPractitioner,
        reason,
        absentDate,
        absentDateEnd,
        isRoleAssign: isRoleAssign,
        roleAssignedToUser: roleAssignedToUser,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Updating classroom group failed - Server connection error'
      );
    }

    return true;
  }

  async getClassAttendanceMetricsByUser(
    userId: string,
    startMonth: Date,
    endMonth: Date
  ): Promise<ClassroomMetricReport[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'classAttendanceMetricsByUser',
      variables: {
        userId: userId,
        startMonth: startMonth,
        endMonth: endMonth,
      },
    });

    if (response.status !== 200 || !!response.data.error) {
      throw new Error('Get class metrics Failed - Server connection error');
    }

    return response.data.data
      .classAttendanceMetricsByUser as ClassroomMetricReport[];
  }
}

export default ClassroomGroupService;
