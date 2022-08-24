import { Typography, Card } from '@ecdlink/ui';
import * as styles from './classroom-attendance.styles';
import { ClassroomAttendanceProps } from './classroom-attendance.types';

export const ClassroomAttendance: React.FC<ClassroomAttendanceProps> = ({
  practitionerClassroomGroups,
}) => {
  return (
    <div className="w-full flex flex-wrap justify-center">
      <Card
        className={styles.attendanceCard}
        borderRaduis={'xl'}
        shadowSize={'md'}
      >
        <div className="ml-4 mt-4">
          <Typography
            text={'Attendance: June 2021'}
            type="body"
            className="mb-4"
          />
        </div>
        <div className={'flex flex-wrap gap-4 justify-around'}>
          {practitionerClassroomGroups?.map((item, index) => {
            let percentageClassname =
              'mt-4 mb-3 text-4xl font-semibold text-successMain';
            const randomPercentage = Number((Math.random() * 100).toFixed(0));
            if (randomPercentage <= 75) {
              percentageClassname =
                'mt-4 mb-3 text-4xl font-semibold text-alertMain';
              if (randomPercentage <= 60) {
                percentageClassname =
                  'mt-4 mb-3 text-4xl font-semibold text-errorMain';
              }
            }
            return (
              <div className="mr-16" key={index}>
                <div className={percentageClassname}>{randomPercentage}%</div>
                <Typography text={item?.name} type="body" className="mb-4" />
              </div>
            );
          })}
          {/* <div className="ml-4">
                <div className="mt-4 mb-3 text-4xl font-semibold text-successMain">
                  45%
                </div>
                <Typography
                  text={'Little Stars'}
                  type="body"
                  className="mb-4"
                />
              </div> */}
          {/* <div className="mr-12">
                <div className="mt-4 mb-3 text-4xl font-semibold text-errorMain">
                  85%
                </div>
                <Typography text={'Dolphins'} type="body" className="mb-4" />
              </div> */}
        </div>
      </Card>
    </div>
  );
};
