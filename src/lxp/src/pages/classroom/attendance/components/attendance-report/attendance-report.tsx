import { Button, LoadingSpinner, renderIcon, Typography } from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { OfflineCard } from '../../../../../components/offline-card/offline-card';
import PointsSuccessCard from '../../../../../components/points-success-card/points-success-card';
import { AttendanceSummary } from '@models/classroom/attendance/AttendanceSummary';
import { authSelectors } from '@store/auth';
import { useAppDispatch } from '@store';
import { AttendanceReportProps } from './attendance-report.types';
import { AttendanceMonthlyReport } from './components/attendance-monthly-report/attendance-monthly-report';
import {
  attendanceSelectors,
  attendanceThunkActions,
} from '@/store/attendance';
import { addDays, startOfYear } from 'date-fns';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { AttendanceActions } from '@/store/attendance/attendance.actions';

export const AttendanceReport: React.FC<AttendanceReportProps> = ({
  classroom,
  currentClassroomGroup,
  classroomGroups,
  isAllRegistersCompleted,
}) => {
  const appDispatch = useAppDispatch();
  const isOnline = true;

  const classroomGroup = classroomGroups?.find((x) => x.classroomId != null);

  //we pick classroomID from classroom group when user is practitioner or if class was assigned to them
  const classroomID =
    classroom?.id ??
    currentClassroomGroup?.classroomId ??
    classroomGroup?.classroomId;

  const authUser = useSelector(authSelectors.getAuthUser);
  const attendanceReports = useSelector(
    attendanceSelectors.getAttendanceReportsForUser(authUser?.id ?? '')
  );

  const [attendanceTracked, setAttendanceTracked] = useState<boolean>(false);
  const [selectedClassroomGroups, setSelectedClassroomGroups] = useState<
    ClassroomGroupDto[]
  >([]);

  const today = new Date();

  const { isLoading } = useThunkFetchCall(
    'attendanceData',
    AttendanceActions.GET_MONTHLY_ATTENDANCE_REPORT
  );

  const attendanceSummary = useMemo(
    (): AttendanceSummary[] =>
      attendanceReports
        ?.map((report) => ({
          month: report.month,
          monthOfYear: +report.monthOfYear,
          attendanceScore: report.percentageAttendance,
        }))
        ?.reverse(),
    [attendanceReports]
  );

  useEffect(() => {
    setSelectedClassroomGroups(
      classroomGroups
        ?.filter((x) => x.classroomId === classroomID)
        .slice(0, 1) || []
    );
  }, [classroomGroups, classroomID]);

  useEffect(() => {
    const firstDay = startOfYear(new Date(today.setUTCHours(0, 0, 0, 0))); // Get the first day of the current year

    const firstDayOfYear = addDays(firstDay, 1);

    if (!attendanceTracked) {
      // TODO: add cache for attendance report
      appDispatch(
        attendanceThunkActions.getMonthlyAttendanceReport({
          userId: authUser?.id!,
          classroomId: classroomID!,
          startDate: firstDayOfYear,
          endDate: new Date(),
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassroomGroups]);

  useEffect(() => {
    if (!attendanceTracked) {
      if (isOnline) {
        const trackAttendance = async () => {
          return await appDispatch(
            attendanceThunkActions.trackAttendanceSync({})
          );
        };
        trackAttendance().then(() => {
          setAttendanceTracked(true);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <LoadingSpinner
        backgroundColor="quatenary"
        size="medium"
        spinnerColor="uiBg"
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className={'flex flex-col'}>
        <Typography
          type="h2"
          color="textDark"
          text="Choose a register to view"
          className="mb-4"
        />
        <PointsSuccessCard
          visible={!!isAllRegistersCompleted}
          className={'mb-4'}
          message={`Good job! All your attendance registers are up to date!`}
          icon={'SparklesIcon'}
        />
        <AttendanceMonthlyReport
          attendanceSummary={attendanceSummary}
          classroomId={classroomID!}
        />
        {!isOnline && <OfflineCard />}
      </div>
      <div
        className={'static bottom-0 flex h-full w-full flex-1 flex-col px-2'}
      >
        {attendanceSummary?.length > 6 && (
          <Button
            type="outlined"
            color="primary"
            className={'mt-0'}
            // TODO: Implement see more registers
            onClick={() => {
              // setSeeRegister(true);
            }}
          >
            {renderIcon('EyeIcon', 'h-5 w-5 text-primary')}
            <Typography
              type="h6"
              color="primary"
              text={'See more registers'}
              className="ml-2"
            ></Typography>
          </Button>
        )}
      </div>
    </div>
  );
};
