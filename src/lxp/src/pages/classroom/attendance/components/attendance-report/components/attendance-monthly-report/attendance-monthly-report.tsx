import {
  Typography,
  renderIcon,
  ComponentBaseProps,
  classNames,
} from '@ecdlink/ui';
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';
import * as styles from './attendance-monthly-report.styles';
import {
  goodScoreThreshold,
  averageScoreThreshold,
} from '@models/classroom/attendance/ClassAttendance';
import { AttendanceSummary } from '@models/classroom/attendance/AttendanceSummary';
import { getYear } from 'date-fns';

interface AttendanceMonthlyReportProps extends ComponentBaseProps {
  attendanceSummary: AttendanceSummary[];
}

export const AttendanceMonthlyReport: React.FC<
  AttendanceMonthlyReportProps
> = ({ attendanceSummary }) => {
  const getText = (score: number) => {
    if (score === 100) {
      return 'You took attendance every day, great job!';
    }

    if (score >= goodScoreThreshold) {
      return 'Well done, you took attendance almost every day!';
    }

    if (score >= averageScoreThreshold) {
      return 'You missed some days!';
    }

    return 'You didn’t take attendance every day!';
  };

  return (
    <div className={styles.wrapper}>
      {attendanceSummary &&
        attendanceSummary.map((attendanceItem, idx) => {
          return (
            <div
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
                  <div className={'pl-4'}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="text-primary h-8"
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
    </div>
  );
};
