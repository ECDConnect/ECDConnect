import {
  ChildAttendanceReportModel,
  ClassRoomChildAttendanceMonthlyReportModel,
} from '@ecdlink/core';
import { ComponentBaseProps, BannerWrapper, Typography } from '@ecdlink/ui';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import {
  getColor,
  getShape,
  getShapeClass,
} from '@utils/classroom/attendance/track-attendance-utils';
import GeneratePdfReportButton from '../../../../../../../../src/components/download-pdf-button/download-pdf-button';
import { UserOptions } from 'jspdf-autotable';

export interface ChildAttendanceReportState {
  childId: string;
  classroomGroupId: string;
}

export interface MonthlyAttendanceReportProps extends ComponentBaseProps {
  reportMonth: string;
  onDownloadReport: (date: Date) => void;
  onBack: () => void;
  classroomGroupId: string;
  reportData: ClassRoomChildAttendanceMonthlyReportModel[];
}

export const MonthlyAttendanceReport = ({
  reportMonth,
  onBack,
  reportData,
}: MonthlyAttendanceReportProps) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const numDays = 29;

  // data that must be used to display in report
  // const dataX = {
  //   "detailedReport":[{ child: 'John Doe', id: 'IDTEST2525255', day1: '1', day2: '1', day3: '0', day4: '1' }, { child: 'Jack Bauer', id: 'IDTEST2525255', day1: '1', day2: '1', day3: '0', day4: '1' }],
  //   "todayAttendance": {day1: '10', day2: '21', day3: '10', day4: '4', },
  //   "totalMonthlyAttendance": 23,
  //   "totalSessions": 22,
  //   "totalChildrenAttendedSessions": 53
  // };

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: `View ${reportMonth} Report `,
        })
      );
    }
  }, [appDispatch, isOnline, reportMonth]);

  const data = [
    { child: 'John', id: 'IDTEST2525255', day1: '1', day2: '1', day3: '0' },
  ];

  for (let i = 0; i < 50; i++) {
    const newArray = {
      child: 'John Bblocks',
      id: 'IDTEST2525255',
      day1: '1',
      day2: '1',
      day3: '0',
      day4: '0',
      day5: '0',
    };
    data.push(newArray);
  }
  const tableColumns = [
    { header: 'Child', dataKey: 'child' },
    { header: 'ID/Passport', dataKey: 'id' },
    ...Array.from({ length: numDays }, (_, i) => ({
      header: `${i + 1}`, // day number as header
      dataKey: `day${i + 1}`, // unique key for each day column
    })),
  ];

  const footer = [
    'Child Attendance per Day',
    '', // Placeholder for ID/Passport column
    '', // Placeholder for Day 1 column
    '', // Placeholder for Day 2 column
    // ... continue with empty placeholders for Day 3 to Day 29 columns ...
  ];

  const tableTopContent = {
    pageTitle: `${reportMonth} Attendance Report`,
    subtitle: 'Text 2',
    practitioner_name: 'Name: Jenny Droe',
    id_number: 'ID: ID23YGH444',
    programme_type: 'ProgrammeType: 46372test',
    programme_days: 'Programmme Days: Monday to Friday',
    site_address: 'Site Address1234 ABC St, City, State, Country',
    phone: 'Phone: 0123456789',
  };

  const tableBottomContent = [
    `Number of children who attended all sessions: 9`,
    `Total number of sessions: 198`,
    `Number of children who attended all sessions: 9`,
  ];

  const tableHeadStyles: UserOptions['headStyles'] = {
    fillColor: [211, 211, 211], // Light grey
    textColor: [0, 0, 0],
    fontSize: 10,
    lineWidth: 0.1,
    lineColor: 0x000000,
  };
  const tableStyles: UserOptions['styles'] = {
    lineWidth: 0.1,
    lineColor: 0x000000,
  };
  const tableFootStyles: UserOptions['footStyles'] = {
    textColor: [0, 0, 0],
    fillColor: [211, 211, 211], // Light grey
    fontSize: 10,
    lineWidth: 0.1,
    lineColor: 0x000000,
  };

  return (
    <BannerWrapper
      size={'small'}
      showBackground={false}
      color={'primary'}
      onBack={onBack}
      title={`View ${reportMonth} Report `}
      subTitle={''}
      className={'h-full overflow-y-auto'}
    >
      <div className={'flex w-full flex-col pt-2 pb-5'}>
        <Typography
          className={'px-4'}
          type="h1"
          color={'black'}
          text={` ${reportMonth} attendance register`}
        />

        <Typography
          className={'p-4'}
          type="body"
          color={'black'}
          text={`Tap a child’s name to see their attendance record.`}
        />
      </div>
      <div
        className={
          'border-uiLight flex w-full flex-row items-center justify-between border-b border-solid py-3 '
        }
      >
        <Typography
          className={'mt-2 w-1/2 pl-6'}
          type="small"
          color={'textMid'}
          text={'CHILD'}
        />
        <Typography
          className={'mt-2 w-1/2 pl-6'}
          type="small"
          color={'textMid'}
          text={'% PRESENT'}
        />
      </div>

      {reportData?.map((report, idx) => {
        const reportItemColor = getColor(report?.attendancePercentage);
        const reportItemShape = getShape(report?.attendancePercentage);
        return (
          <div
            key={`child-attendance-report-month-${idx}`}
            className={`flex w-full flex-row items-center justify-between py-4 bg-${
              (idx + 1) % 2 === 0 ? 'uiBg' : 'white'
            }`}
          >
            <>
              <Typography
                className={'w-1/2 pl-6'}
                type="body"
                weight="bold"
                color={'black'}
                text={report.childFullName}
              />
              <div className={'flex w-1/2 flex-row items-center pl-6'}>
                <div
                  className={getShapeClass(reportItemShape, reportItemColor)}
                ></div>
                <Typography
                  align={'center'}
                  className={'ml-2'}
                  type="body"
                  color={reportItemColor}
                  text={`${report?.attendancePercentage} %`}
                />
              </div>
            </>
          </div>
        );
      })}
      <div className={'flex h-full w-full flex-1 flex-col px-4 py-4'}>
        {
          <GeneratePdfReportButton
            title="Download Register"
            outputName={`${reportMonth}-attandance-report.pdf`}
            headerColumns={tableColumns}
            bodyRows={data}
            tableFooter={footer}
            content={tableTopContent}
            tableBottomContent={tableBottomContent}
            tableHeadStyles={tableHeadStyles}
            tableFootStyles={tableFootStyles}
            tableStyles={tableStyles}
          />
        }
      </div>
    </BannerWrapper>
  );
};

export default MonthlyAttendanceReport;
