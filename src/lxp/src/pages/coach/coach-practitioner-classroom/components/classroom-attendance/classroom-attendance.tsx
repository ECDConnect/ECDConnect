import { Typography, Card } from '@ecdlink/ui';
import * as styles from './classroom-attendance.styles';
import { ClassroomAttendanceProps } from './classroom-attendance.types';
import {
  getMonthName,
  getPrevMonth,
} from '@utils/classroom/attendance/track-attendance-utils';

export const ClassroomAttendance: React.FC<ClassroomAttendanceProps> = ({
  practitionerClassroomGroups,
  practitionerClassroomsData,
}) => {
  return (
    <div className="flex w-full flex-wrap justify-center">
      <Card
        className={styles.attendanceCard}
        borderRaduis={'xl'}
        shadowSize={'md'}
      >
        <div className="ml-4 mt-4">
          <Typography
            text={`Attendance: ${getMonthName(
              getPrevMonth().getMonth()
              // eslint-disable-next-line no-useless-concat
            )}\u00A0${getPrevMonth().getFullYear()}`}
            type="body"
            className="mb-4"
          />
        </div>
        {practitionerClassroomGroups?.length! > 0 ? (
          <div className={'grid grid-cols-2 justify-around gap-4'}>
            {practitionerClassroomGroups?.map((item, index) => {
              const classroomMetrics = practitionerClassroomsData?.find(
                (item2) => item2?.classroomGroupId === item?.id
              );

              let percentageClassname =
                'mt-4 mb-3 text-4xl font-semibold text-successMain';
              const randomPercentage =
                classroomMetrics?.attendancePercentage || 0;
              if (randomPercentage <= 75) {
                percentageClassname =
                  'mt-4 mb-3 text-4xl font-semibold text-alertMain';
                if (randomPercentage <= 60) {
                  percentageClassname =
                    'mt-4 mb-3 text-4xl font-semibold text-errorMain';
                }
              }
              return (
                <div className="ml-8" key={index}>
                  <div className={percentageClassname}>{randomPercentage}%</div>
                  <Typography text={item?.name} type="body" className="mb-4" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ml-4 mt-4">
            <Typography
              text={`No classes and/or children`}
              type="body"
              className="mb-4"
            />
          </div>
        )}
      </Card>
    </div>
  );
};
