import {
  ChildAttendanceReportModel,
  ChildGroupingAttendanceReportModel,
} from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Divider,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { endOfYear, getYear, startOfISOWeekYear } from 'date-fns';
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
import { ChildAttendanceReportState } from './child-attendance-report.types';

export const ChildAttendanceReportPage: React.FC = () => {
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

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Child Attendance Report',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const currentYear = getYear(new Date());
  const [childAttendanceReportData, setChildAttendanceReportData] =
    useState<ChildAttendanceReportModel>({
      totalActualAttendance: 0,
      totalExpectedAttendance: 0,
      classGroupAttendance: [],
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

      const startDate = startOfISOWeekYear(new Date());
      const endDate = endOfYear(new Date());

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

    const attendancePercentage =
      (childAttendanceReportData.totalActualAttendance /
        (childAttendanceReportData.totalExpectedAttendance || 1)) *
      100;
    setAttendancePercentage(attendancePercentage);
    const group = childAttendanceReportData.classGroupAttendance.find(
      (x) => x.classroomGroupId === classroomGroupId
    );
    setClassroomGroup(group);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childAttendanceReportData]);

  const contactCaregiver = () => {
    history.push('/child-caregivers', { childId });
  };
  return (
    <BannerWrapper
      className="overflow-y-auto h-full"
      onBack={history.goBack}
      size={'small'}
      title={`${childUser?.firstName}'s attendance`}
      displayOffline={!isOnline}
    >
      <div className={'w-full pt-2 flex flex-col pb-20'}>
        <Typography
          className={'px-4'}
          type="h1"
          color={'primary'}
          text={`Attendance ${currentYear}`}
        />

        <div className={'w-full pt-4 px-4 flex flex-row'}>
          <StatusChip
            backgroundColour={getColor(attendancePercentage)}
            text={`${childAttendanceReportData?.totalActualAttendance ?? 0}/${
              childAttendanceReportData?.totalExpectedAttendance ?? 0
            }`}
            textColour={'white'}
            borderColour={getColor(attendancePercentage)}
          />
          <Typography
            className={'ml-2'}
            type="body"
            color={getColor(attendancePercentage)}
            text={`days attended so far this year.`}
          />
        </div>

        <Typography
          className={'mt-2 px-4'}
          type="body"
          color={'textMid'}
          text={getAttendanceText(attendancePercentage)}
        />

        <div
          className={
            'w-full flex flex-row justify-between items-center border-b border-solid border-uiLight py-3'
          }
        >
          <Typography
            className={'mt-2 w-1/2 pl-6'}
            type="small"
            color={'textMid'}
            text={'MONTH'}
          />
          <Typography
            className={'mt-2 w-1/2 pl-6'}
            type="small"
            color={'textMid'}
            text={'DAYS PRESENT'}
          />
        </div>
        {classroomGroup &&
          classroomGroup.monthlyAttendance.map((report, idx) => {
            const currentReportAttendancePercentage =
              (report.actualAttendance / report.expectedAttendance) * 100;
            const reportItemColor = getColor(currentReportAttendancePercentage);
            const reportItemShape = getShape(currentReportAttendancePercentage);
            return (
              <div
                key={`child-attendance-report-month-${idx}`}
                className={`w-full flex flex-row justify-between items-center py-4 bg-${
                  (idx + 1) % 2 === 0 ? 'uiBg' : 'white'
                }`}
              >
                <Typography
                  className={'w-1/2 pl-6'}
                  type="body"
                  weight="bolder"
                  color={'black'}
                  text={report.month}
                />
                <div className={'w-1/2 flex flex-row items-center pl-6'}>
                  <div
                    className={getShapeClass(reportItemShape, reportItemColor)}
                  ></div>
                  <Typography
                    align={'center'}
                    className={'ml-2'}
                    type="body"
                    color={reportItemColor}
                    text={`${report.actualAttendance} out of ${report.expectedAttendance}`}
                  />
                </div>
              </div>
            );
          })}
        <div className="px-4">
          <Divider className={'my-4'} />
          <Button
            color={'primary'}
            type="filled"
            onClick={contactCaregiver}
            className="w-full"
          >
            {renderIcon('ChatAlt2Icon', 'w-5 h-5 text-white mr-2')}
            <Typography
              type="small"
              color={'white'}
              text={'Contact caregiver'}
            />
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};
