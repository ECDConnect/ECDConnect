import {
  Typography,
  ComponentBaseProps,
  classNames,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';
import * as styles from './attendance-monthly-report.styles';
import { MonthlyAttendanceReport } from './attendance-report';
import { AttendanceSummary } from '@models/classroom/attendance/AttendanceSummary';
import { getYear } from 'date-fns';
import { useState } from 'react';

interface AttendanceMonthlyReportProps extends ComponentBaseProps {
  attendanceSummary: AttendanceSummary[];
}

export const AttendanceMonthlyReport: React.FC<
  AttendanceMonthlyReportProps
> = ({ attendanceSummary }) => {
  const [displayReport, setDisplayReport] = useState<boolean>(false);
  const [viewReportDate, setViewReportDate] = useState<string>();

  const closeReport = () => {
    setDisplayReport(!displayReport);
  };
  return (
    <div className={styles.wrapper}>
      {attendanceSummary &&
        attendanceSummary.map((attendanceItem, idx) => {
          return (
            <div
              onClick={() => {
                setDisplayReport(true);
                setViewReportDate(
                  getMonthName(attendanceItem?.monthOfYear - 1)
                );
              }}
              key={`attendance-summary-item-${idx}`}
              className={classNames(
                styles.attendanceItemWrapper(
                  attendanceItem.attendanceScore,
                  idx > 0
                ),
                styles.getBgColor(attendanceItem.attendanceScore)
              )}
            >
              <div className={styles.resultsSection} id="results-section">
                <div className={'flex flex-col items-start justify-between'}>
                  <Typography
                    type={'h3'}
                    weight={'bold'}
                    color={'black'}
                    text={`${getMonthName(
                      attendanceItem.monthOfYear - 1
                    )} ${getYear(new Date())}`}
                    lineHeight={'none'}
                  ></Typography>

                  <Typography
                    text={`submited registers`}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="text-primary h-6"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
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
              onDownloadReport={() => console.log('>>')}
              onBack={() => closeReport()}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};
