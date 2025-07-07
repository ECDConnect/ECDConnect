import {
  AttendanceDto,
  ChildAttendanceReportModel,
  ClassRoomChildAttendanceMonthlyReportModel,
  Config,
  MonthlyAttendanceRecord,
} from '@ecdlink/core';
import { TrackAttendanceModelInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';

class AttendanceService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getAttendance(
    startDate: Date,
    endDate: Date
  ): Promise<AttendanceDto[]> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { attendance: AttendanceDto[] };
      errors?: {};
    }>(``, {
      query: `
      query attendance($startDate: DateTime!, $endDate: DateTime!) {
        attendance(
          startDate: $startDate
          endDate: $endDate
        ) {
          classroomProgrammeId
          userId
          attended
          attendanceDate
          weekOfYear
          monthOfYear
          year
        }
      }
      `,
      variables: {
        startDate: startDate,
        endDate: endDate,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Attendance failed - Server connection error');
    }

    return response.data.data.attendance;
  }

  async getClassroomAttendanceReport(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ClassRoomChildAttendanceMonthlyReportModel> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query classroomAttendanceOverviewReport(
        $userId: String
        $startDate: DateTime!
        $endDate: DateTime!) {
        classroomAttendanceOverviewReport(
            userId: $userId
            startDate: $startDate
            endDate: $endDate) {
        classroomAttendanceReport{
            totalActualAttendance
            totalExpectedAttendance
            attendancePercentage
            classgroupId
            childFullName
            childIdNumber
            childUserId
            month
            year
            attendance{ key value }
        }
        totalAttendance { key value }
        totalAttendanceStatsReport {
        totalSessions
        totalMonthlyAttendance
        totalChildrenAttendedAllSessions
        }
    }
    }
      `,
      variables: {
        userId: userId,
        startDate: startDate,
        endDate: endDate,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Monthly Attendance Report failed - Server connection error'
      );
    }
    return response.data.data.classroomAttendanceOverviewReport;
  }

  async getMonthlyAttendanceReport(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MonthlyAttendanceRecord[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query monthlyAttendanceReport(
        $userId: String
        $startMonth: DateTime!
        $endMonth: DateTime!) {
        monthlyAttendanceReport(
          userId: $userId
          startMonth: $startMonth
          endMonth: $endMonth          
        ) {
          month
          monthOfYear
          year
          percentageAttendance
          numberOfSessions
          totalScheduledSessions
        }
      }
      `,
      variables: {
        userId: userId,
        startMonth: startDate,
        endMonth: endDate,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Monthly Attendance Report failed - Server connection error'
      );
    }

    return response.data.data.monthlyAttendanceReport;
  }

  async getChildAttendanceRecords(
    userId: string,
    classgroupId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ChildAttendanceReportModel> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query childAttendanceReport(
          $userId: String
          $classgroupId: UUID!
          $startDate: DateTime!
          $endDate: DateTime!
        ) {
            childAttendanceReport(
              userId: $userId
              classgroupId: $classgroupId
              startDate: $startDate
              endDate: $endDate
            ) {
              totalExpectedAttendance
              totalActualAttendance
              attendancePercentage
              classGroupAttendance {
                classroomGroupId
                classroomGroupName
                startDate
                endDate
                expectedAttendance
                attendancePercentage
                monthlyAttendance {
                  month
                  monthNumber
                  actualAttendance
                  expectedAttendance
                  attendancePercentage
                }
              }
            }
          }
      `,
      variables: {
        userId: userId,
        classgroupId: classgroupId,
        startDate: startDate,
        endDate: endDate,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Child Attendance Report failed - Server connection error'
      );
    }

    return response.data.data.childAttendanceReport;
  }

  async trackAttendance(
    attendance: TrackAttendanceModelInput[]
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { trackAttendance: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation trackAttendance($attendance: [TrackAttendanceModelInput]) {
          trackAttendance(attendance: $attendance)
        }
      `,
      variables: {
        attendance: attendance,
      },
    });

    if (response.status !== 200) {
      throw new Error('Tracking Attendance failed - Server connection error');
    }
    if (response.data.errors) {
      throw new Error('Update Attendance failed - please contact helpdesk');
    }
    return response.data.data.trackAttendance;
  }
}

export default AttendanceService;
