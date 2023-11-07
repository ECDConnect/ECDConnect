import {
  ClassroomGroupDto,
  LocalStorageKeys,
  MonthlyAttendanceRecord,
} from '@ecdlink/core';
import { Button, MessageModal, renderIcon, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { OfflineCard } from '../../../../../components/offline-card/offline-card';
import PointsSuccessCard from '../../../../../components/points-success-card/points-success-card';
import { AttendanceSummary } from '@models/classroom/attendance/AttendanceSummary';
import { AttendanceService } from '@services/AttendanceService';
import { authSelectors } from '@store/auth';
import { useAppDispatch } from '@store';
import {
  setStorageItem,
  getStorageItem,
} from '@utils/common/local-storage.utils';
import { AttendanceReportProps } from './attendance-report.types';
import { AttendanceMonthlyReport } from './components/attendance-monthly-report/attendance-monthly-report';
import { attendanceThunkActions } from '@/store/attendance';
import { addDays, startOfYear } from 'date-fns';

export const AttendanceReport: React.FC<AttendanceReportProps> = ({
  classroom,
  currentClassroomGroup,
  classroomGroups,
}) => {
  const appDispatch = useAppDispatch();
  const isOnline = true;

  const classroomGroup = classroomGroups?.find((x) => x.classroomId != null);

  //we pick classroomID from classroom group when user is practitioner or if class was assigned to them
  const classroomID =
    classroom?.id ??
    currentClassroomGroup?.classroomId ??
    classroomGroup?.classroomId;

  const [successMessageVisible, setSuccessMessageVisible] =
    useState<boolean>(true);
  const [displaySmartStartMessage, setDisplaySmartStartMessage] =
    useState<boolean>(true);

  const authUser = useSelector(authSelectors.getAuthUser);

  const closeMessage = () => {
    setDisplaySmartStartMessage(false);
    setStorageItem(
      true,
      LocalStorageKeys.hasClosedAttendanceSmartStartPointsMessage
    );
  };

  useEffect(() => {
    const lastDate = localStorage.getItem('lastDate');
    const today = new Date().toDateString();
    if (lastDate !== today) {
      // Show notification on a new day
      setSuccessMessageVisible(true);
      // localStorage.setItem('lastDate', today);
    } else {
      setSuccessMessageVisible(false);
    }
  }, []);

  // const closeNotification = () => {
  //   setSuccessMessageVisible(false);
  //   setStorageItem(true, LocalStorageKeys.hasClosedSuccessAttendanceSubmitted);
  //   const today = new Date().toDateString();
  //   localStorage.setItem('lastDate', today);
  // };

  const [attendanceData, setAttendanceData] = useState<AttendanceSummary[]>([]);
  const [reportData, setReportData] = useState<MonthlyAttendanceRecord[]>();
  const [attendanceTracked, setAttendanceTracked] = useState<boolean>(false);
  const [selectedClassroomGroups, setSelectedClassroomGroups] = useState<
    ClassroomGroupDto[]
  >([]);

  const today = new Date();

  useEffect(() => {
    setSelectedClassroomGroups(
      classroomGroups
        ?.filter((x) => x.classroomId === classroomID)
        .slice(0, 1) || []
    );
  }, [classroomGroups, classroomID]);

  useEffect(() => {
    const lastDayCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    );

    const firstDay = startOfYear(new Date(today.setUTCHours(0, 0, 0, 0))); // Get the first day of the current year

    const firstDayOfYear = addDays(firstDay, 1);

    if (!attendanceTracked) {
      new AttendanceService(authUser?.auth_token ?? '')
        .getMonthlyAttendanceReport(
          authUser?.id ?? '',
          classroomID!,
          firstDayOfYear,
          new Date()
        )
        .then((data) => {
          setReportData(data);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassroomGroups]);

  useEffect(() => {
    if (!reportData) return;

    const attendanceReport: AttendanceSummary[] = reportData.map(
      (mar: MonthlyAttendanceRecord) => ({
        month: mar.month,
        monthOfYear: +mar.monthOfYear,
        attendanceScore: mar.percentageAttendance,
      })
    );

    setAttendanceData(attendanceReport.reverse());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportData]);

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

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-4 pt-4 pb-32">
      <div className={'flex flex-col'}>
        {/* EC-1909 - Suppress ticket */}
        {/* <PointsSuccessCard
          visible={successMessageVisible}
          className={'mb-4'}
          message={`Good job! All your attendance registers are up to date!`}
          icon={'SparklesIcon'}
        /> */}
        <AttendanceMonthlyReport
          attendanceSummary={attendanceData}
          classroomId={classroomID || classroomID!}
        />
        {!isOnline && <OfflineCard />}
      </div>
      <div
        className={'static bottom-0 flex h-full w-full flex-1 flex-col px-2'}
      >
        {attendanceData.length > 6 && (
          <Button
            type="outlined"
            color="primary"
            className={'mt-0'}
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
      <MessageModal
        title={'What can you do with SmartStart points?'}
        message={'Get R5 airtime for every 500 points you earn!'}
        visible={
          false
          //!hasClosedAttendanceSmartStartPointsMessage ??
          //displaySmartStartMessage
        }
        icon={'GiftIcon'}
        className={'mt-4'}
        onClose={closeMessage}
      />
    </div>
  );
};
