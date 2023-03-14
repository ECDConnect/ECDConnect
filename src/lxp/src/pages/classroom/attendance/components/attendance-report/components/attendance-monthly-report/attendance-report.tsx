import { AttendanceResult } from '@/models/classroom/attendance/AttendanceResult';
import {
  ChildAttendanceReportModel,
  ChildGroupingAttendanceReportModel,
} from '@ecdlink/core';
import {
  ComponentBaseProps,
  BannerWrapper,
  Button,
  Divider,
  StatusChip,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { getYear } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  badScoreThreshold,
  goodScoreThreshold,
} from '@models/classroom/attendance/ClassAttendance';
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
}

export const MonthlyAttendanceReport = ({
  reportMonth,
  onDownloadReport,
  onBack,
}: MonthlyAttendanceReportProps) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const { state } = useLocation<ChildAttendanceReportState>();
  const { childId, classroomGroupId } = state;
  const appDispatch = useAppDispatch();

  const child = useSelector(childrenSelectors.getChildById(childId));
  const childUser = useSelector(
    childrenSelectors.getChildUserById(child?.userId)
  );
  const attendanceData = useSelector(attendanceSelectors.getTrackedAttendance);
  const learner = useSelector(
    classroomsSelectors.getChildLearnerByClassroom(classroomGroupId, child)
  );

  const currentYear = getYear(new Date());
  const [childAttendanceReportData, setChildAttendanceReportData] =
    useState<ChildAttendanceReportModel>({
      totalActualAttendance: 0,
      totalExpectedAttendance: 0,
      classGroupAttendance: [],
      attendancePercentage: 0,
    });
  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [classroomGroup, setClassroomGroup] =
    useState<ChildGroupingAttendanceReportModel>();

  const authUser = useSelector(authSelectors.getAuthUser);

  const getAttendanceText = (score: number): string => {
    if (score >= goodScoreThreshold) {
      return `${childUser?.firstName}'s attendance is good!`;
    }

    if (score <= badScoreThreshold) {
      return `${childUser?.firstName}'s attendance has not been good!`;
    }

    return '';
  };

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
          child?.userId ?? '',
          classroomGroupId,
          startDate,
          endDate
        )
        .then((data) => {
          setChildAttendanceReportData(data);
        });
    }
    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!childAttendanceReportData) return;
    setAttendancePercentage(childAttendanceReportData.attendancePercentage);
    const group = childAttendanceReportData.classGroupAttendance.find(
      (x) => x.classroomGroupId === classroomGroupId
    );
    setClassroomGroup(group);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childAttendanceReportData]);

  const contactCaregiver = () => {
    history.push('/child-caregivers', { childId });
  };

  const downloadReport = (attendanceSuccessList: AttendanceResult) => {
    if (onDownloadReport) {
      onDownloadReport(new Date());
    }
  };

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
          'border-uiLight flex w-full flex-row items-center justify-between border-b border-solid py-3'
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

      {classroomGroup &&
        classroomGroup.monthlyAttendance.map((report, idx) => {
          const reportItemColor = getColor(report.attendancePercentage);
          const reportItemShape = getShape(report.attendancePercentage);
          return (
            <div
              key={`child-attendance-report-month-${idx}`}
              className={`flex w-full flex-row items-center justify-between py-4 bg-${
                (idx + 1) % 2 === 0 ? 'uiBg' : 'white'
              }`}
            >
              {report?.expectedAttendance > 0 && (
                <>
                  <Typography
                    className={'w-1/2 pl-6'}
                    type="body"
                    weight="bold"
                    color={'black'}
                    text={report.month}
                  />
                  <div className={'flex w-1/2 flex-row items-center pl-6'}>
                    <div
                      className={getShapeClass(
                        reportItemShape,
                        reportItemColor
                      )}
                    ></div>
                    <Typography
                      align={'center'}
                      className={'ml-2'}
                      type="body"
                      color={reportItemColor}
                      text={`${report.attendancePercentage} %`}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
    </BannerWrapper>
  );
};

export default MonthlyAttendanceReport;
