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
    year: number,
    monthOfYear: number,
    weekOfYear: number
  ): Promise<AttendanceDto[]> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query attendance($year: Int!, $monthOfYear: Int, $weekOfYear: Int) {
        attendance(
          year: $year
          monthOfYear: $monthOfYear
          weekOfYear: $weekOfYear
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
        year: year,
        monthOfYear: monthOfYear,
        weekOfYear: weekOfYear,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Attendance failed - Server connection error');
    }

    return response.data.data.attendance;
  }

  async getClassroomAttendanceReport(
    userId: string,
    classgroupId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ClassRoomChildAttendanceMonthlyReportModel[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query classroomAttendanceReport(
        $userId: String
        $classgroupId: UUID!
        $startDate: DateTime!
        $endDate: DateTime!) {
        classroomAttendanceReport(
          userId: $userId
          classgroupId: $classgroupId
          startDate: $startDate
          endDate: $endDate
          ){
          totalActualAttendance
          totalExpectedAttendance
          attendancePercentage
          classgroupId
          childFullName
          childUserId
          month
          year 
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
        'Get Monthly Attendance Report failed - Server connection error'
      );
    }
    return response.data.data.classroomAttendanceReport;
  }

  async getMonthlyAttendanceReport(
    userId: string,
    classroomId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MonthlyAttendanceRecord[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query monthlyAttendanceReport(
        $userId: String
        $classroomId: UUID!
        $startMonth: DateTime!
        $endMonth: DateTime!) {
        monthlyAttendanceReport(
          userId: $userId
          classroomId: $classroomId
          startMonth: $startMonth
          endMonth: $endMonth
        ) {
          month
          monthOfYear
          year
          percentageAttendance
        }
      }
      `,
      variables: {
        userId: userId,
        classroomId: classroomId,
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
        'Get Monthly Attendance Report failed - Server connection error'
      );
    }

    return response.data.data.childAttendanceReport;
  }

  async trackAttendance(
    attendance: TrackAttendanceModelInput[]
  ): Promise<boolean> {

    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
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

    return true;
  }
}

export default AttendanceService;
