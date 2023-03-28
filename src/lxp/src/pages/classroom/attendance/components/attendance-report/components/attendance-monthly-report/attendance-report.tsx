
import {
  ChildAttendanceReportModel,
  ClassRoomChildAttendanceMonthlyReportModel,
} from '@ecdlink/core';
import {
  ComponentBaseProps,
  BannerWrapper,
  Button,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

import { AttendanceService } from '@services/AttendanceService';
import { useAppDispatch } from '@store';
import { attendanceSelectors, attendanceThunkActions } from '@store/attendance';
import { authSelectors } from '@store/auth';
import { childrenSelectors } from '@store/children';
import { analyticsActions } from '@store/analytics';
import {
  getColor,
  getShape,
  getShapeClass,
} from '@utils/classroom/attendance/track-attendance-utils';

import { classroomsSelectors } from '@/store/classroom';

export interface ChildAttendanceReportState {
  childId: string;
  classroomGroupId: string;
}

export interface MonthlyAttendanceReportProps extends ComponentBaseProps {
  reportMonth: string;
  onDownloadReport: (date: Date) => void;
  onBack: () => void;
  classroomGroupId: string;
  reportData: ClassRoomChildAttendanceMonthlyReportModel[]
}

export const MonthlyAttendanceReport = ({
  reportMonth,
  onDownloadReport,
  onBack,
  classroomGroupId,
  reportData
}: MonthlyAttendanceReportProps) => {
  // const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const { state } = useLocation<ChildAttendanceReportState>();
  const { childId } = state;
  const appDispatch = useAppDispatch();

  const child = useSelector(childrenSelectors.getChildById(childId));

  const attendanceData = useSelector(attendanceSelectors.getTrackedAttendance);
  const learner = useSelector(
    classroomsSelectors.getChildLearnerByClassroom(classroomGroupId, child)
  );

  const [childAttendanceReportData, setChildAttendanceReportData] =
    useState<ChildAttendanceReportModel>({
      totalActualAttendance: 0,
      totalExpectedAttendance: 0,
      classGroupAttendance: [],
      attendancePercentage: 0,
    });

  const authUser = useSelector(authSelectors.getAuthUser);

  useEffect(() => {
    async function init() {
      if (attendanceData && attendanceData.length > 0) {
        await appDispatch(
          attendanceThunkActions.trackAttendanceSync({})
        ).unwrap();
      }
      const startDate = new Date(learner?.startedAttendance || new Date());
      const endDate = new Date();

      new AttendanceService(authUser?.auth_token ?? '')
        .getChildAttendanceRecords(
          authUser?.id ?? '',
          classroomGroupId,
          startDate,
          endDate
        )
        .then((data) => {
          setChildAttendanceReportData(data);
        });
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {}, [childAttendanceReportData]);


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
      {['1', ' 2', '3', '4'].map((report, idx) => {
        const reportItemColor = getColor(10);
        const reportItemShape = getShape(67);
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
                text={'Elisha Bere'}
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
                  text={`10 %`}
                />
              </div>
            </>
          </div>
        );
      })}
      <div className={'flex h-full w-full flex-1 flex-col px-4'}>
        {
          <Button
            type="filled"
            color="primary"
            className={'mt-0'}
            onClick={() => {}}
          >
            {renderIcon('DownloadIcon', 'h-5 w-5 text-primary')}
            <Typography
              type="h6"
              color="white"
              text={'Download Register'}
              className="ml-2"
            ></Typography>
          </Button>
        }
      </div>
    </BannerWrapper>
  );
};

export default MonthlyAttendanceReport;
