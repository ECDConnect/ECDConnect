import { LocalStorageKeys, MonthlyAttendanceRecord } from '@ecdlink/core';
import { MessageModal } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { OfflineCard } from '../../../../../components/offline-card/offline-card';
import PointsSuccessCard from '../../../../../components/points-success-card/points-success-card';
import { AttendanceSummary } from '../../../../../models/classroom/attendance/AttendanceSummary';
import { AttendanceService } from '@services/AttendanceService';
import { authSelectors } from '../../../../../store/auth';
import { setStorageItem } from '../../../../../utils/common/local-storage.utils';
import { AttendanceReportProps } from './attendance-report.types';
import { AttendanceMonthlyReport } from './components/attendance-monthly-report/attendance-monthly-report';

export const AttendanceReport: React.FC<AttendanceReportProps> = ({ classroom }) => {
  const isOnline = true;
  const [successMessageVisible, setSuccessMessageVisible] = useState<boolean>(true);
  const [displaySmartStartMessage, setDisplaySmartStartMessage] = useState<boolean>(true);

  const authUser = useSelector(authSelectors.getAuthUser);

  const closeMessage = () => {
    setDisplaySmartStartMessage(false);
    setStorageItem(true, LocalStorageKeys.hasClosedAttendanceSmartStartPointsMessage);
  };

  const [attendanceData, setAttendanceData] = useState<AttendanceSummary[]>([]);

  const [reportData, setReportData] = useState<MonthlyAttendanceRecord[]>();

  useEffect(() => {
    if (!classroom) return;
    const year = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const startMonth = new Date(classroom.insertedDate ?? '');

    new AttendanceService(authUser?.auth_token ?? '')
      .getMonthlyAttendanceReport(
        authUser?.id ?? '',
        classroom.id ?? '',
        startMonth,
        new Date(year, currentMonth, 1)
      )
      .then((data) => {
        setReportData(data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroom]);

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
    <div className="h-full w-full flex flex-col overflow-y-auto pb-32">
      <div className={'flex flex-col p-4'}>
        <PointsSuccessCard
          visible={successMessageVisible}
          onClose={() => setSuccessMessageVisible(false)}
          className={'mb-4'}
          message={'Your attendance registers are up to date this week!'}
          icon={'SparklesIcon'}
        />
        {isOnline && <AttendanceMonthlyReport attendanceSummary={attendanceData} />}
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
