import {
  Button,
  DialogPosition,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PointsSuccessCard from '../../../../../components/points-success-card/points-success-card';
import { authSelectors } from '@store/auth';
import { useAppDispatch } from '@store';
import { AttendanceReportProps } from './attendance-report.types';
import { AttendanceMonthlyReport } from './components/attendance-monthly-report/attendance-monthly-report';
import {
  attendanceSelectors,
  attendanceThunkActions,
} from '@/store/attendance';
import { isSameDay, startOfMonth, subMonths } from 'date-fns';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { AttendanceActions } from '@/store/attendance/attendance.actions';
import {
  MonthlyAttendanceRecord,
  useDialog,
  usePrevious,
  useSnackbar,
} from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { practitionerSelectors } from '@/store/practitioner';

export const AttendanceReport: React.FC<AttendanceReportProps> = ({
  classroom,
  currentClassroomGroup,
  classroomGroups,
  isAllRegistersCompleted,
  onTakeAttendance,
}) => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const { hasPermissionToTakeAttendance } = useUserPermissions();

  const hasPermissionToEdit =
    practitioner?.isPrincipal || hasPermissionToTakeAttendance;

  const classroomGroup = classroomGroups?.find((x) => x.classroomId != null);

  //we pick classroomID from classroom group when user is practitioner or if class was assigned to them
  const classroomID =
    classroom?.id ??
    currentClassroomGroup?.classroomId ??
    classroomGroup?.classroomId;

  const authUser = useSelector(authSelectors.getAuthUser);
  const attendanceSummary = useSelector(
    attendanceSelectors.getAttendanceReportsForUser(authUser?.id ?? '')
  );

  const previousAttendanceSummary = usePrevious(attendanceSummary) as
    | MonthlyAttendanceRecord[]
    | undefined;

  const [attendanceTracked, setAttendanceTracked] = useState<boolean>(false);
  const [selectedClassroomGroups, setSelectedClassroomGroups] = useState<
    ClassroomGroupDto[]
  >([]);
  const [lastStartOfPeriod, setLastStartOfPeriod] = useState<Date>();

  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const fourthRecentMonth = subMonths(firstDayOfMonth, 3);

  const { isLoading, wasLoading, isFulfilled } = useThunkFetchCall(
    'attendanceData',
    AttendanceActions.GET_MONTHLY_ATTENDANCE_REPORT
  );

  const { showMessage } = useSnackbar();
  const dialog = useDialog();

  const isInitialStartDate =
    lastStartOfPeriod && isSameDay(fourthRecentMonth, lastStartOfPeriod);
  const isToShowSeeMoreButton =
    isInitialStartDate ||
    attendanceSummary?.length !== previousAttendanceSummary?.length;

  const formattedAttendanceSummary = useMemo(() => {
    const copy = [...(attendanceSummary ?? [])]?.reverse() ?? [];

    if (isInitialStartDate) {
      return copy.slice(0, 4);
    }

    return copy;
  }, [attendanceSummary, isInitialStartDate]);

  const onSeeMoreRegisters = () => {
    if (!isOnline) {
      return dialog({
        color: 'bg-white',
        position: DialogPosition.Middle,
        render: (onSubmit) => {
          return <OnlineOnlyModal onSubmit={onSubmit} />;
        },
      });
    }
    const nextStartOfPeriod = subMonths(lastStartOfPeriod!, 1);

    setLastStartOfPeriod(nextStartOfPeriod);

    appDispatch(
      attendanceThunkActions.getMonthlyAttendanceReport({
        overrideCache: true,
        userId: authUser?.id!,
        startDate: nextStartOfPeriod,
        endDate: today,
      })
    );
  };

  useEffect(() => {
    setSelectedClassroomGroups(
      classroomGroups
        ?.filter((x) => x.classroomId === classroomID)
        .slice(0, 1) || []
    );
  }, [classroomGroups, classroomID]);

  useEffect(() => {
    if (!attendanceTracked) {
      setLastStartOfPeriod(fourthRecentMonth);

      appDispatch(
        attendanceThunkActions.getMonthlyAttendanceReport({
          userId: authUser?.id!,
          startDate: fourthRecentMonth,
          endDate: today,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassroomGroups, attendanceTracked]);

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

  useEffect(() => {
    if (wasLoading && isFulfilled && !isToShowSeeMoreButton) {
      showMessage({
        message: 'No more registers to show',
        type: 'info',
        duration: 10000,
      });
    }
  }, [isFulfilled, isToShowSeeMoreButton, showMessage, wasLoading]);

  if (isLoading) {
    return (
      <LoadingSpinner
        className="p-4"
        backgroundColor="quatenary"
        size="medium"
        spinnerColor="uiBg"
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto p-4">
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
          attendanceSummary={formattedAttendanceSummary}
        />
      </div>
      {isToShowSeeMoreButton && (
        <Button
          className="mt-6"
          type="outlined"
          color="quatenary"
          textColor="quatenary"
          icon="EyeIcon"
          text="See more registers"
          onClick={onSeeMoreRegisters}
        ></Button>
      )}
      {!isAllRegistersCompleted && hasPermissionToEdit && (
        <Button
          className="mt-auto"
          type="filled"
          color="quatenary"
          textColor="white"
          text="Take attendance"
          icon="PencilAltIcon"
          onClick={onTakeAttendance}
        />
      )}
    </div>
  );
};
