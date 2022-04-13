import { gql } from '@apollo/client';

export const MonthlyAttendanceRecordCSV = gql`
  query monthlyAttendanceRecordCSV(
    $startMonth: DateTime!
    $endMonth: DateTime!
    $ownerId: String
  ) {
    monthlyAttendanceRecordCSV(
      startMonth: $startMonth
      endMonth: $endMonth
      ownerId: $ownerId
    ) {
      base64File
      fileType
      fileName
      extension
    }
  }
`;

export const MonthlyAttendanceReport = gql`
  query monthlyAttendanceReport(
    $userId: String
    $classroomId: Int!
    $startMonth: DateTime!
    $endMonth: DateTime!
  ) {
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
`;

export const ChildAttendanceReport = gql`
  query childAttendanceReport(
    $userId: String
    $classgroupId: Int!
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
      classGroupAttendance {
        classroomGroupId
        classroomGroupName
        startDate
        endDate
        expectedAttendance
        monthlyAttendance {
          month
          monthNumber
          actualAttendance
          expectedAttendance
        }
      }
    }
  }
`;

export const practitionerMetrics = gql`
  {
    practitionerMetrics {
      avgChildren
      completedProfiles
      outstandingSyncs
      statusData {
        name
        value
      }
      programTypesData {
        name
        value
      }
    }
  }
`;

export const practitionerNewSignupMetric = gql`
  query practitionerNewSignupMetric($fromDate: DateTime!, $toDate: DateTime!) {
    practitionerNewSignupMetric(fromDate: $fromDate, toDate: $toDate)
  }
`;

export const childrenMetrics = gql`
  {
    childrenMetrics {
      unverifiedDocuments
      totalChildren
      totalChildProgressReports
      statusData {
        name
        value
      }
      childAttendacePerMonthData {
        name
        value
      }
    }
  }
`;

export const childrenAttendedVsAbsentMetrics = gql`
  query childrenAttendedVsAbsentMetrics(
    $fromDate: DateTime!
    $toDate: DateTime!
  ) {
    childrenAttendedVsAbsentMetrics(fromDate: $fromDate, toDate: $toDate) {
      name
      value
    }
  }
`;
