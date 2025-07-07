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
      query: `
        query GetClassroomGroupById($id:UUID) {
          GetClassroomGroupById(id: $id) {
            id
            learners {
              isActive
                stoppedAttendance
                id
                userId
            }
          }
        }
      `,
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
    userId: string
  ): Promise<ClassroomGroupDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { classroomGroupsForUser: ClassroomGroupDto[] };
      errors?: {};
    }>(``, {
      query: `
        query GetClassroomGroupsForUser($userId: UUID!) {
          classroomGroupsForUser(userId: $userId) {
            id
            classroomId
            name
            userId
            learners {
              learnerId
              childUserId
              startedAttendance
              stoppedAttendance
              isActive
            }
            classProgrammes {
              id
              programmeStartDate
              meetingDay
              isFullDay
              classroomGroupId
              isActive
            }
          }
        }
          `,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'GetClassroomGroupsForUser Failed - Server connection error'
      );
    }

    return response.data.data.classroomGroupsForUser;
  }

  async updateClassroomGroup(
    id: string,
    input: ClassroomGroupInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateClassroomGroup($id: UUID!,$input: ClassroomGroupInput) {
          updateClassroomGroup(id: $id, input: $input) {
            id
          }
        }
      `,
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
      query: `
      mutation addAbsenteeForPractitioner ($practitionerId: String,
        $reason: String, $absentDate: DateTime!,$loggedByUser: String,
        $classProgram: String,$reassignedToPractitioner: String, $absentDateEnd: DateTime!,
        $fromRole: String,
        $toRole: String,
        $roleAssignedToUser: String
        )       {
         addAbsenteeForPractitioner (practitionerId: $practitionerId,
           reason: $reason, absentDate: $absentDate, 
           loggedByUser: $loggedByUser, classProgram: $classProgram, 
           reassignedToPractitioner: $reassignedToPractitioner, 
           absentDateEnd: $absentDateEnd,
           fromRole: $fromRole,
           toRole: $toRole,
           roleAssignedToUser: $roleAssignedToUser) { 
                  id  
                     }      
                       }
      `,
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
      query: `
      mutation editAbsentee(
        $absenteeId: String,
    $deleteAbsentee: Boolean,
    $reassignedToPractitioner: String,
    $reason: String!,
    $absentDate: DateTime!,
    $absentDateEnd: DateTime!,
    $isRoleAssign: Boolean,
    $roleAssignedToUser: String
    )       {
        editAbsentee (absenteeId: $absenteeId,
        deleteAbsentee: $deleteAbsentee,
    reassignedToPractitioner: $reassignedToPractitioner,
     reason: $reason,
     absentDate: $absentDate,
     absentDateEnd: $absentDateEnd,
    isRoleAssign: $isRoleAssign,
    roleAssignedToUser: $roleAssignedToUser
     ) {           id             }               }
      `,
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
      query: `
      query classAttendanceMetricsByUser(   
        $userId: String    
        $startMonth: DateTime! 
        $endMonth: DateTime!) 
        {        
          classAttendanceMetricsByUser(          
            userId: $userId, startMonth: $startMonth endMonth: $endMonth 
          ) 
          {          
            childCount  
            attendancePercentage 
            month 
            year 
            classroomId 
            practitionerId 
            weekOfYear 
            classroomGroupId       
          }      
        }  
      `,
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
