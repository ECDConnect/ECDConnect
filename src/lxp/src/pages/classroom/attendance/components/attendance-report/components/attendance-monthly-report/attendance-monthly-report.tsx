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
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';
import * as styles from './attendance-monthly-report.styles';
import { MonthlyAttendanceReport } from './attendance-report';
import { AttendanceSummary } from '@models/classroom/attendance/AttendanceSummary';
import { addDays, getYear } from 'date-fns';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { ClassRoomChildAttendanceMonthlyReportModel } from '@ecdlink/core';
import { startOfMonth, endOfMonth } from 'date-fns';

interface AttendanceMonthlyReportProps extends ComponentBaseProps {
  attendanceSummary: AttendanceSummary[];
  classroomId: string;
}

export const AttendanceMonthlyReport: React.FC<
  AttendanceMonthlyReportProps
> = ({ attendanceSummary, classroomId }) => {
  const [displayReport, setDisplayReport] = useState<boolean>(false);
  const [selectedmonth, setSelectedMonth] = useState<number>(0);

  const [viewReportDate, setViewReportDate] = useState<string>();
  const [reportData, setReportData] = useState<
    ClassRoomChildAttendanceMonthlyReportModel[]
  >([]);
  const authUser = useSelector(authSelectors.getAuthUser);

  const closeReport = () => {
    setDisplayReport(!displayReport);
  };

  function getMonthRange(monthNumber: number) {
    // Get the current year
    const year = new Date().getFullYear();

    // Get the start and end date of the month
    const startDate = startOfMonth(new Date(year, monthNumber - 1, 1));
    const endDate = endOfMonth(new Date(year, monthNumber - 1, 1));

    return { startDate, endDate };
  }

  useEffect(() => {
    const monthNumber = selectedmonth + 1;
    const { startDate, endDate } = getMonthRange(monthNumber);
    console.log(viewReportDate);
    new AttendanceService(authUser?.auth_token ?? '')
      .getClassroomAttendanceReport(
        authUser?.id ?? '',
        classroomId,
        startDate,
        endDate
      )
      .then((data) => {
        setReportData(data);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

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
              onDownloadReport={() => console.log('>>')}
              onBack={() => closeReport()}
              classroomGroupId={classroomId}
              reportData={reportData ?? []}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};
