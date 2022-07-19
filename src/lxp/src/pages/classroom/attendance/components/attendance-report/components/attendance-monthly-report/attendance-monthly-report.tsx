import { Typography } from '@ecdlink/ui';
import { ComponentBaseProps } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';
import * as styles from './attendance-monthly-report.styles';
import {
  goodScoreThreshold,
  averageScoreThreshold,
} from '@models/classroom/attendance/ClassAttendance';
import { AttendanceSummary } from '@models/classroom/attendance/AttendanceSummary';

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
              className={styles.attendanceItemWrapper(
                attendanceItem.attendanceScore,
                idx > 0
              )}
            >
              <div className={styles.resultsSection} id="results-section">
                <div className={'flex flex-col items-start justify-between'}>
                  <Typography
                    type={'body'}
                    weight={'bold'}
                    color={'black'}
                    text={`${getMonthName(
                      attendanceItem.monthOfYear - 1
                    )} attendance`}
                    lineHeight={'none'}
                  ></Typography>

                  <div className={'flex flex-row mt-1'} id="month-with-points">
                    {renderIcon(
                      'GiftIcon',
                      styles.icon(attendanceItem.attendanceScore)
                    )}
                    <Typography
                      text={`${attendanceItem.attendanceScore}`}
                      weight={'bold'}
                      color={'textLight'}
                      type={'help'}
                      className={'mr-1'}
                    />
                    <Typography
                      text={'points earned'}
                      color={'textLight'}
                      type={'help'}
                    />
                  </div>
                </div>

                <div id="big-score-result">
                  <Typography
                    text={`${attendanceItem.attendanceScore}%`}
                    weight={'bold'}
                    color={styles.getColor(attendanceItem.attendanceScore)}
                    type={'h1'}
                    className={'text-4xl'}
                  />
                </div>
              </div>
              <div id="summary-text">
                <Typography
                  type="help"
                  color={'textLight'}
                  text={getText(attendanceItem.attendanceScore)}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};
