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
  AttendanceDto,
  ClassProgrammeDto,
  LearnerDto,
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
import { OfflineUpdate } from '@/models/sync/offline-update';

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

  const attendanceData = useSelector(attendanceSelectors.getAttendance);

  const [offlineAttendanceData, setOfflineAttendanceData] = useState<
    MonthlyAttendanceRecord[]
  >([]);

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

  const convertMonthNumberToMonthName = (monthNumber: number): string => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[monthNumber - 1];
  };

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

  /**
   * Calculate all the days of class for a programme from the start date till the end of the month
   * Takes into account the meeting day of the programme
   *
   * @param {*} programme // The programme object to get the total days of class for
   * @param {*} month // 1 - 12 To limit the days to the month a programme can run till
   */
  const getProgrammeTotalDaysForMonth = (
    programme: ClassProgrammeDto & OfflineUpdate,
    month: number
  ) => {
    const programmeStartDate = new Date(programme.programmeStartDate);
    const currentDate = new Date();
    const meetingDay = programme.meetingDay;

    const totalDaysInMonth = new Date(
      programmeStartDate.getFullYear(),
      month,
      0
    ).getDate();
    const daysOfClass = [];

    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dayInMonth = new Date(
        programmeStartDate.getFullYear(),
        month - 1,
        i
      );
      if (
        dayInMonth.getDay() === meetingDay &&
        dayInMonth >= programmeStartDate &&
        dayInMonth <= currentDate
      ) {
        daysOfClass.push(dayInMonth.toUTCString());
      }
    }

    return daysOfClass;
  };

  const getLearnerCount = (data: LearnerDto[], daysOfClass: string[]) =>
    data.filter((learner) => {
      const learnerStartDate = new Date(learner.startedAttendance);
      const learnerEndDate = learner.stoppedAttendance
        ? new Date(learner.stoppedAttendance)
        : null;
      const firstDayOfClass = new Date(daysOfClass[0]);
      const lastDayOfClass = new Date(daysOfClass[daysOfClass.length - 1]);
      return (
        learnerStartDate <= lastDayOfClass &&
        (!learnerEndDate || learnerEndDate >= firstDayOfClass)
      );
    });

  /**
   * Format the attendance for offline use. Does a crude calculation of the percentage attendance
   * on the frontend
   *
   * @param {AttendanceDto[]} attendanceData
   * @param {ClassroomGroupDto[]} classroomGroups
   * @return {*}
   */
  const formattedOfflineAttendanceData = (
    attendanceData: AttendanceDto[],
    classroomGroups: ClassroomGroupDto[]
  ) => {
    // Empty array to store formatted data
    const formattedData: any = [];

    // Filter attendance data set to only have data for learners in the classroom groups
    const learners = classroomGroups
      .map((group) => group.learners.map((learner) => learner))
      .flat();
    const learnerIds = learners.map((learner) => learner.childUserId);
    const usersData = attendanceData.filter((item) =>
      learnerIds.includes(item.userId!)
    );

    // Get all applicable months
    const months = [
      ...new Set(
        usersData.map(
          (item) =>
            item.monthOfYear || new Date(item.attendanceDate!).getMonth() + 1
        )
      ),
    ].sort((a, b) => a - b);

    // Loop through each month so final data is grouped by month
    months.forEach((month) => {
      let totalScheduledSessions = 0;
      let numberOfSessions = 0;

      // Get all the days of class for each programme from programme start date till end of the month
      classroomGroups.forEach((group) => {
        const groupLearners = group.learners.map((learner) => learner);

        // Loop through programmes in the group
        group.classProgrammes.forEach((programme) => {
          const daysOfClass = getProgrammeTotalDaysForMonth(programme, month);
          const learners = getLearnerCount(groupLearners, daysOfClass);

          if (daysOfClass.length > 0 && learners.length > 0) {
            const attendanceForPeriod = usersData.filter((item) => {
              return (
                item.classroomProgrammeId === programme.id &&
                item.monthOfYear === month &&
                item.year === usersData[0].year
              );
            });
            numberOfSessions += attendanceForPeriod.length / learners.length;
            totalScheduledSessions += daysOfClass.length;
          }
        });
      });

      const percentageAttendance = Math.floor(
        numberOfSessions > 0
          ? (numberOfSessions / (totalScheduledSessions * 1.0)) * 100
          : 0
      );

      formattedData.push({
        month: convertMonthNumberToMonthName(month),
        monthOfYear: month,
        year: usersData[0].year,
        percentageAttendance,
        numberOfSessions,
        totalScheduledSessions,
      });
    });

    return formattedData.sort(
      (a: any, b: any) => b.monthOfYear - a.monthOfYear
    );
  };

  useEffect(() => {
    if (
      attendanceData &&
      offlineAttendanceData.length === 0 &&
      !isOnline &&
      classroomGroups
    ) {
      const offlineData = formattedOfflineAttendanceData(
        attendanceData,
        classroomGroups
      );
      setOfflineAttendanceData(offlineData);
    }
  }, [attendanceData, offlineAttendanceData]);

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

  const hasAttendanceData =
    formattedAttendanceSummary.length > 1 ||
    (formattedAttendanceSummary.length === 1 &&
      formattedAttendanceSummary[0].percentageAttendance !== 0) ||
    offlineAttendanceData.length > 0;

  const noValidAttendance =
    !formattedAttendanceSummary.length ||
    (formattedAttendanceSummary.length === 1 &&
      formattedAttendanceSummary[0].percentageAttendance === 0);

  const renderNoAttendanceOrOfflineAttendance = () => {
    return offlineAttendanceData.length > 0 ? (
      <>
        <AttendanceMonthlyReport attendanceSummary={offlineAttendanceData} />
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
      </>
    ) : (
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
    );
  };

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
          renderNoAttendanceOrOfflineAttendance()
        ) : (
          <>
            {isFulfilled && !wasLoading && isLoading}
            <AttendanceMonthlyReport
              attendanceSummary={formattedAttendanceSummary}
            />
            {isToShowSeeMoreButton && (
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
