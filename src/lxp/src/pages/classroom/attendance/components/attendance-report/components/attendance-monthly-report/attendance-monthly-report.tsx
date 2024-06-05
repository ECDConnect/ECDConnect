import {
  Typography,
  ComponentBaseProps,
  classNames,
  Dialog,
  DialogPosition,
  renderIcon,
} from '@ecdlink/ui';
import { useLayoutEffect, useState } from 'react';
import * as styles from './attendance-monthly-report.styles';
import { MonthlyAttendanceReport } from './attendance-report';
import { getYear } from 'date-fns';
import { useHistory, useLocation } from 'react-router';
import { ClassDashboardRouteState } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { MonthlyAttendanceRecord } from '@ecdlink/core';

interface AttendanceMonthlyReportProps extends ComponentBaseProps {
  attendanceSummary: MonthlyAttendanceRecord[];
  classroomId: string;
}

export const AttendanceMonthlyReport: React.FC<
  AttendanceMonthlyReportProps
> = ({ attendanceSummary, classroomId }) => {
  const [displayReport, setDisplayReport] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<MonthlyAttendanceRecord>();

  const location = useLocation<ClassDashboardRouteState>();
  const history = useHistory();

  const closeReport = () => {
    setDisplayReport(!displayReport);
    history.replace({
      ...location,
      state: {
        ...location.state,
        fromChildAttendanceReport: false,
      },
    });
  };

  useLayoutEffect(() => {
    if (location.state?.fromChildAttendanceReport && !displayReport) {
      setDisplayReport(true);
    }
  }, [displayReport, history, location]);

  return (
    <div className={styles.wrapper}>
      {attendanceSummary &&
        attendanceSummary.map((attendanceItem, idx) => {
          return (
            <div
              onClick={() => {
                if (!attendanceItem.percentageAttendance) return;
                setDisplayReport(true);
                setSelectedMonth(attendanceItem);
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
                    text={`submitted registers`}
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
                    {!!attendanceItem.percentageAttendance &&
                      renderIcon('ChevronRightIcon', 'text-primary h-6')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {displayReport && selectedMonth && (
        <Dialog
          fullScreen
          visible={displayReport}
          position={DialogPosition.Top}
        >
          <div className={'h-full'}>
            <MonthlyAttendanceReport
              selectedMonth={selectedMonth}
              onDownloadReport={() => {}}
              onBack={closeReport}
              classroomGroupId={classroomId}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};
