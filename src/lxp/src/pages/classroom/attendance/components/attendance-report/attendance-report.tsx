import { LocalStorageKeys, MonthlyAttendanceRecord } from '@ecdlink/core';
import { MessageModal } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { OfflineCard } from '../../../../../components/offline-card/offline-card';
import PointsSuccessCard from '../../../../../components/points-success-card/points-success-card';
import { AttendanceSummary } from '@models/classroom/attendance/AttendanceSummary';
import { AttendanceService } from '@services/AttendanceService';
import { authSelectors } from '@store/auth';
import { useAppDispatch } from '@store';
import { setStorageItem } from '@utils/common/local-storage.utils';
import { AttendanceReportProps } from './attendance-report.types';
import { AttendanceMonthlyReport } from './components/attendance-monthly-report/attendance-monthly-report';
import { attendanceThunkActions } from '@/store/attendance';

export const AttendanceReport: React.FC<AttendanceReportProps> = ({
  classroom,
}) => {
  const appDispatch = useAppDispatch();
  const isOnline = true;
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

  const [attendanceData, setAttendanceData] = useState<AttendanceSummary[]>([]);
  const [reportData, setReportData] = useState<MonthlyAttendanceRecord[]>();
  const [attendanceTracked, setAttendanceTracked] = useState<boolean>(false);

  useEffect(() => {
    const trackAttendance = async () => {
      return await appDispatch(attendanceThunkActions.trackAttendanceSync({}));
    };
    trackAttendance().then(() => {
      setAttendanceTracked(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!classroom) return;
    const today = new Date();
    const lastDayCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    const startDate = new Date(classroom.insertedDate ?? '');

    if (attendanceTracked) {
      new AttendanceService(authUser?.auth_token ?? '')
        .getMonthlyAttendanceReport(
          authUser?.id ?? '',
          classroom?.classroomId || classroom?.id!,
          startDate,
          new Date(lastDayCurrentMonth)
        )
        .then((data) => {
          setReportData(data);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroom, attendanceTracked]);

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

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-4 pt-4 pb-32">
      <div className={'flex flex-col'}>
        <PointsSuccessCard
          visible={successMessageVisible}
          onClose={() => setSuccessMessageVisible(false)}
          className={'mb-4'}
          message={'Your attendance registers are up to date this week!'}
          icon={'SparklesIcon'}
        />
        <AttendanceMonthlyReport attendanceSummary={attendanceData} />
        {!isOnline && <OfflineCard />}
      </div>
      <MessageModal
        title={'What can you do with SmartStart points?'}
        message={'Get R5 airtime for every 500 points you earn!'}
        visible={displaySmartStartMessage}
        icon={'GiftIcon'}
        className={'mt-4'}
        onClose={closeMessage}
      />
    </div>
  );
};
