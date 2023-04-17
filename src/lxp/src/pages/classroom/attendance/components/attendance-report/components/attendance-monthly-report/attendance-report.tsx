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
  onDownloadReport,
  onBack,
  classroomGroupId,
  reportData,
}: MonthlyAttendanceReportProps) => {
  // const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const { state } = useLocation<ChildAttendanceReportState>();
  const appDispatch = useAppDispatch();

  // const downloadReport = (attendanceSuccessList: AttendanceResult) => {
  //   if (onDownloadReport) {
  //     onDownloadReport(new Date());
  //   }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

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

      {/* TODO: integrate this with backend to get correct data */}
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
      <div className={'flex h-full w-full flex-1 flex-col px-4'}>
        {<GeneratePdfReportButton title="Download Register" url=""/>}
      </div>
    </BannerWrapper>
  );
};

export default MonthlyAttendanceReport;
