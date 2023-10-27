import {
  Typography,
  ComponentBaseProps,
  classNames,
  Dialog,
  DialogPosition,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { AttendanceService } from '@services/AttendanceService';
import { getMonthRange } from '@utils/classroom/attendance/track-attendance-utils';
import * as styles from './attendance-monthly-report.styles';
import { MonthlyAttendanceReport } from './attendance-report';
import { AttendanceSummary } from '@models/classroom/attendance/AttendanceSummary';
import { getYear, add } from 'date-fns';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { ChildAttendanceOverallReportModel } from '@ecdlink/core';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';

interface AttendanceMonthlyReportProps extends ComponentBaseProps {
  attendanceSummary: AttendanceSummary[];
  classroomId: string;
}

export const AttendanceMonthlyReport: React.FC<
  AttendanceMonthlyReportProps
> = ({ attendanceSummary, classroomId }) => {
  const [displayReport, setDisplayReport] = useState<boolean>(false);

  const [totalAttendance, setTotalAttendance] = useState<
    {
      key: number;
      value: number;
    }[]
  >([]);
  const [totalAttendanceStatsReport, setTotalAttendanceStatsReport] = useState<{
    totalSessions: number;
    totalMonthlyAttendance: number;
    totalChildrenAttendedAllSessions: number;
  }>();

  const [viewReportDate, setViewReportDate] = useState<string>();
  const [reportData, setReportData] = useState<
    ChildAttendanceOverallReportModel[]
  >([]);
  const authUser = useSelector(authSelectors.getAuthUser);
  const { errorDialog } = useRequestResponseDialog();

  const closeReport = () => {
    setDisplayReport(!displayReport);
  };

  useEffect(() => {
    if (viewReportDate) {
      const { startDate, endDate } = getMonthRange(viewReportDate);

      const nextDay = add(startDate, { days: 1 });
      new AttendanceService(authUser?.auth_token ?? '')
        .getClassroomAttendanceReport(
          authUser?.id ?? '',
          classroomId,
          nextDay,
          endDate
        )
        .then((data) => {
          setReportData(data.classroomAttendanceReport);
          setTotalAttendance(data.totalAttendance);
          setTotalAttendanceStatsReport(data.totalAttendanceStatsReport);
        })
        .catch((err) => {
          errorDialog(err.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewReportDate]);

  return (
    <div className={styles.wrapper}>
      {attendanceSummary &&
        attendanceSummary.map((attendanceItem, idx) => {
          return (
            <div
              onClick={() => {
                setDisplayReport(true);
                setViewReportDate(attendanceItem?.month);
              }}
              key={`attendance-summary-item-${idx}`}
              className={classNames(
                styles.attendanceItemWrapper(attendanceItem.attendanceScore),
                styles.getBgColor(attendanceItem.attendanceScore)
              )}
            >
              <div className={styles.resultsSection} id="results-section">
                <div className={'flex flex-col items-start justify-between'}>
                  <Typography
                    type={'h3'}
                    weight={'bold'}
                    color={'black'}
                    text={`${attendanceItem.month} ${getYear(new Date())}`}
                    lineHeight={'none'}
                  ></Typography>

                  <Typography
                    text={`submitted registers`}
                    weight={'bold'}
                    color={'black'}
                    type={'h3'}
                  />
                </div>

                <div id="big-score-result" className={'flex flex-row'}>
                  <Typography
                    text={`${attendanceItem.attendanceScore}%`}
                    weight={'bold'}
                    color={styles.getColor(attendanceItem.attendanceScore)}
                    type={'h1'}
                    className={'text-4xl'}
                  />
                  <div className={'pl-6 pt-2'}>
                    {renderIcon('ChevronRightIcon', 'text-primary h-6')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {displayReport && (
        <Dialog
          fullScreen
          visible={displayReport}
          position={DialogPosition.Top}
        >
          <div className={'h-full'}>
            <MonthlyAttendanceReport
              reportMonth={viewReportDate ?? ''}
              onDownloadReport={() => {}}
              onBack={() => closeReport()}
              classroomGroupId={classroomId}
              reportData={reportData}
              totalAttendance={totalAttendance}
              totalAttendanceStatsReport={totalAttendanceStatsReport}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};
