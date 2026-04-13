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
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { IconInformationIndicator } from '@/pages/classroom/programme-planning/components/icon-information-indicator/icon-information-indicator';
import { useHolidays } from '@/hooks/useHolidays';
import { useMonthlyAttendanceSummary } from '@/hooks/useMonthlyAttendanceSummary';
import { normalizeToStartOfDay } from '@/utils/classroom/attendance/track-attendance-utils';

export const AttendanceReport: React.FC<AttendanceReportProps> = ({
  classroom,
  currentClassroomGroup,
  classroomGroups,
  isAllRegistersCompleted,
  onTakeAttendance,
}) => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const holiday = useHolidays();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const attendanceData = useSelector(attendanceSelectors.getAttendance);
  const [hasMoreRegisters, setHasMoreRegisters] = useState(true);
  const { hasPermissionToTakeAttendance } = useUserPermissions();
  const isTrialPeriod = useIsTrialPeriod();

  const hasPermissionToEdit =
    practitioner?.isPrincipal || hasPermissionToTakeAttendance || isTrialPeriod;

  const classroomGroup = classroomGroups?.find((x) => x.classroomId != null);

  //we pick classroomID from classroom group when user is practitioner or if class was assigned to them
  const classroomID =
    classroom?.id ??
    currentClassroomGroup?.classroomId ??
    classroomGroup?.classroomId;

  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const fourthRecentMonth = subMonths(firstDayOfMonth, 3);

  const authUser = useSelector(authSelectors.getAuthUser);
  const attendanceSummary = useSelector(
    attendanceSelectors.getAttendanceReportsForUser(authUser?.id ?? '')
  );

  // calculate this month's attendance summary only
  const { monthlySummary } = useMonthlyAttendanceSummary(
    attendanceData!,
    classroomGroups!,
    holiday.holidays!
  );

  // replace this month's summary from hook or add as new
  const newAttendanceSummary = [...attendanceSummary];
  if (monthlySummary !== null) {
    const thisMonthIndex = newAttendanceSummary.findIndex(
      (x) =>
        parseInt(x.monthOfYear) === today.getMonth() + 1 &&
        parseInt(x.year) === today.getFullYear()
    );
    if (thisMonthIndex !== -1) {
      newAttendanceSummary[thisMonthIndex] = monthlySummary;
    } else {
      newAttendanceSummary.push(monthlySummary);
    }
  }

  const previousAttendanceSummary = usePrevious(attendanceSummary) as
    | MonthlyAttendanceRecord[]
    | undefined;

  const [attendanceTracked, setAttendanceTracked] = useState<boolean>(false);
  const [selectedClassroomGroups, setSelectedClassroomGroups] = useState<
    ClassroomGroupDto[]
  >([]);
  const [lastStartOfPeriod, setLastStartOfPeriod] = useState<Date>();

  const { isLoading, wasLoading, isFulfilled } = useThunkFetchCall(
    'attendanceData',
    AttendanceActions.GET_MONTHLY_ATTENDANCE_REPORT
  );

  const { showMessage } = useSnackbar();
  const dialog = useDialog();

  const isInitialStartDate =
    lastStartOfPeriod && isSameDay(fourthRecentMonth, lastStartOfPeriod);

  const formattedAttendanceSummary = useMemo(() => {
    const copy = [...(newAttendanceSummary ?? [])]?.reverse() ?? [];

    if (isInitialStartDate) {
      return copy.slice(0, 4);
    }

    return copy;
  }, [newAttendanceSummary, isInitialStartDate]);

  const shouldShowSeeMoreButton =
    isInitialStartDate &&
    formattedAttendanceSummary.length > 0 &&
    hasMoreRegisters;

  const onSeeMoreRegisters = () => {
    if (!isOnline) {
      return dialog({
        color: 'bg-white',
        position: DialogPosition.Middle,
        render: (onSubmit) => <OnlineOnlyModal onSubmit={onSubmit} />,
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
    ).then((result) => {
      // If the backend returns no new data, hide the button permanently
      if (!result || (Array.isArray(result) && result.length === 0)) {
        setHasMoreRegisters(false);
      }
    });
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
      if (isOnline)
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
    if (wasLoading && isFulfilled && !shouldShowSeeMoreButton) {
      showMessage({
        message: 'No more registers to show',
        type: 'info',
        duration: 10000,
      });
    }
  }, [isFulfilled, shouldShowSeeMoreButton, showMessage, wasLoading]);

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

  const hasAttendanceData =
    formattedAttendanceSummary.length > 1 ||
    (formattedAttendanceSummary.length === 1 &&
      formattedAttendanceSummary[0].percentageAttendance !== 0);

  const noValidAttendance =
    !formattedAttendanceSummary.length ||
    (formattedAttendanceSummary.length === 1 &&
      formattedAttendanceSummary[0].percentageAttendance === 0 &&
      formattedAttendanceSummary[0].totalScheduledSessions === 0);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto p-4">
      <div className="flex flex-col">
        {hasAttendanceData && isFulfilled && (
          <>
            <Typography
              type="h2"
              color="textDark"
              text="Choose a register to view"
              className="mb-4"
            />
            <PointsSuccessCard
              visible={!!isAllRegistersCompleted}
              className="mb-4"
              message="Good job! All your attendance registers are up to date!"
              icon="SparklesIcon"
            />
          </>
        )}

        {noValidAttendance ? (
          <IconInformationIndicator
            title={
              hasPermissionToEdit
                ? 'You don’t have any attendance registers yet!'
                : 'No registers to view yet!'
            }
            subTitle={
              hasPermissionToEdit
                ? 'Tap "Take attendance" to get started'
                : "When attendance registers are added for your class, you'll be able to see them here"
            }
          />
        ) : (
          <>
            {isFulfilled && !wasLoading && isLoading}
            <AttendanceMonthlyReport
              attendanceSummary={formattedAttendanceSummary}
            />
            {shouldShowSeeMoreButton && (
              <Button
                className="mt-6"
                type="outlined"
                color="quatenary"
                textColor="quatenary"
                icon="EyeIcon"
                text="See more registers"
                onClick={onSeeMoreRegisters}
              />
            )}
          </>
        )}
      </div>

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
