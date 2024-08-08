import {
  Typography,
  ComponentBaseProps,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import * as styles from './attendance-monthly-report.styles';
import { getYear } from 'date-fns';
import { MonthlyAttendanceRecord } from '@ecdlink/core';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { MonthlyAttendanceReportRouteState } from './attendance-report.types';

interface AttendanceMonthlyReportProps extends ComponentBaseProps {
  attendanceSummary: MonthlyAttendanceRecord[];
}

export const AttendanceMonthlyReport: React.FC<
  AttendanceMonthlyReportProps
> = ({ attendanceSummary }) => {
  const history = useHistory();

  return (
    <div className={styles.wrapper}>
      {attendanceSummary &&
        attendanceSummary.map((attendanceItem, idx) => {
          return (
            <div
              onClick={() => {
                if (attendanceItem.totalScheduledSessions === 0) return;
                history.push(ROUTES.CLASSROOM.ATTENDANCE.MONTHLY_REPORT, {
                  selectedMonth: attendanceItem,
                } as MonthlyAttendanceReportRouteState);
              }}
              key={`attendance-summary-item-${idx}`}
              className={classNames(
                styles.attendanceItemWrapper(
                  attendanceItem.percentageAttendance
                ),
                styles.getBgColor(attendanceItem.percentageAttendance)
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
                    text={`completed registers`}
                    weight={'bold'}
                    color={'black'}
                    type={'h3'}
                  />
                </div>

                <div id="big-score-result" className={'flex flex-row'}>
                  <Typography
                    text={`${attendanceItem.percentageAttendance}%`}
                    weight={'bold'}
                    color={styles.getColor(attendanceItem.percentageAttendance)}
                    type={'h1'}
                    className={'text-4xl'}
                  />
                  <div className={'h-6 w-6 pl-4 pt-2'}>
                    {attendanceItem.totalScheduledSessions > 0 &&
                      renderIcon('ChevronRightIcon', 'text-primary h-6')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
