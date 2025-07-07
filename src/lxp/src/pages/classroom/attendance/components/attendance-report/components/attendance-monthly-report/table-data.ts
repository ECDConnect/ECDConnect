import {
  ClassRoomChildAttendanceMonthlyReportModel,
  MonthlyAttendanceRecord,
  PractitionerDto,
} from '@ecdlink/core';
import { PractitionerReportDetails } from '@ecdlink/graphql';
import { UserOptions } from 'jspdf-autotable';

interface TableDataProps {
  monthlyReport?: ClassRoomChildAttendanceMonthlyReportModel;
  selectedMonth: MonthlyAttendanceRecord;
  practitioner?: PractitionerDto;
  reportDetails?: PractitionerReportDetails;
}

export const getTableData = ({
  monthlyReport,
  reportDetails,
  selectedMonth,
  practitioner,
}: TableDataProps) => {
  const reportData = monthlyReport?.classroomAttendanceReport ?? [];
  const totalAttendance = monthlyReport?.totalAttendance || [];
  const totalAttendanceStatsReport = monthlyReport?.totalAttendanceStatsReport;

  const numDays = totalAttendance.length;

  const tableBody = reportData.map(
    (item: {
      attendance?: any;
      childFullName?: any;
      childIdNumber?: string;
    }) => {
      const { childFullName, childIdNumber } = item;
      const attendance = item.attendance.reduce(
        (obj: { [x: string]: any }, { key, value }: any, i: number) => {
          obj[`day${key}`] = value !== null ? value : '*';
          return obj;
        },
        {}
      );
      return { child: childFullName, id: childIdNumber, ...attendance };
    }
  );

  const tableHeaders = [
    { header: 'Child', dataKey: 'child' },
    { header: 'ID/Passport', dataKey: 'id' },
    ...totalAttendance.slice(0, numDays).map(({ key }) => ({
      header: `${key} ${selectedMonth.month.slice(0, 3)}`,
      dataKey: `day${key}`, // using key value as dataKey
    })),
  ];

  const finalTableData = [
    {
      tableName: '',
      type: '',
      total: '',
      headers: tableHeaders,
      data: tableBody,
    },
  ];

  const footer = [
    'Child Attendance per Day',
    '', // Placeholder for ID/Passport column
  ];

  totalAttendance.forEach((obj) => {
    footer.push(obj.value?.toString() || '*');
  });

  let attendanceSum = 0;

  for (let i = 0; i < totalAttendance.length; i++) {
    attendanceSum += totalAttendance[i].value;
  }

  const tableTopContent = {
    pageTitle: `${selectedMonth.month} ${selectedMonth.year} Attendance Report`,
    subtitle: `Class: ${reportDetails?.classroomGroupName ?? 'N/A'}`,
    text_coulumn_one_row_one: `Name: ${practitioner?.user?.fullName}`,
    text_coulumn_one_row_two: `ID number: ${
      reportDetails?.idNumber === null ? '' : reportDetails?.idNumber
    }`,
    text_coulumn_one_row_three: `Phone number: ${
      reportDetails?.phone === null ? '' : reportDetails?.phone
    }`,
    text_column_two_row_one: `Class days: ${
      reportDetails?.programmeDays === null ? '' : reportDetails?.programmeDays
    } `,
    text_column_two_row_two: `Site address: ${
      reportDetails?.classSiteAddress === null
        ? ''
        : reportDetails?.classSiteAddress
    }`,
  };

  const tableBottomContent = [
    `Total monthly attendance: ${attendanceSum}`,
    `Total number of sessions: ${totalAttendanceStatsReport?.totalSessions}`,
    `Number of children who attended all sessions: ${
      attendanceSum === 0
        ? '0'
        : totalAttendanceStatsReport?.totalChildrenAttendedAllSessions
    }`,
    '* = child was not registered yet OR practitioner did not take attendance',
  ];

  const tableHeadStyles: UserOptions['headStyles'] = {
    fillColor: [128, 128, 128], // Light grey
    textColor: [255, 255, 255],
    fontSize: 9,
    lineWidth: 0.1,
    lineColor: 0x000000,
  };
  const tableStyles: UserOptions['styles'] = {
    lineWidth: 0.1,
    lineColor: 0x000000,
    fontSize: 8,
  };
  const tableFootStyles: UserOptions['footStyles'] = {
    fillColor: [229, 229, 229], // Light grey
    textColor: [0, 0, 0],
    fontSize: 9,
    lineWidth: 0.1,
    lineColor: 0x000000,
  };

  return {
    attendanceSum,
    tableTopContent,
    tableBottomContent,
    finalTableData,
    tableHeadStyles,
    tableStyles,
    tableFootStyles,
    footer,
  };
};
