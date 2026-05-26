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
      id: 'attendance',
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
    startDate: Date,
    endDate: Date
  ): Promise<ClassRoomChildAttendanceMonthlyReportModel> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'classroomAttendanceOverviewReport',
      variables: {
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
    startDate: Date,
    endDate: Date
  ): Promise<MonthlyAttendanceRecord[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'monthlyAttendanceReport',
      variables: {
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
      id: 'childAttendanceReport',
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
      id: 'trackAttendance',
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
