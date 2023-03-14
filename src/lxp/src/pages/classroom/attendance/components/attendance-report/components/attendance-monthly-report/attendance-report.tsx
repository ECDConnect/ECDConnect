import { AttendanceResult } from '@/models/classroom/attendance/AttendanceResult';
import { BannerWrapper, ComponentBaseProps } from '@ecdlink/ui';
import { format } from 'date-fns';
import AttendanceList from '../../../attendance-list/attendance-list';

export interface MonthlyAttendanceReportProps extends ComponentBaseProps {
  reportMonth: string;
  submitText?: string;
  onComplete: (attendanceSuccessList: AttendanceResult) => void;
  onBack: () => void;
  editAttendanceRegisterVisible?: boolean;
}


export const MonthlyAttendanceReport = ({
  reportMonth,
  onComplete,
  onBack,
}: MonthlyAttendanceReportProps) => {


  const attendanceSubmitted = (attendanceSuccessList: AttendanceResult) => {
    if (onComplete) {
      onComplete(attendanceSuccessList);
    }
  };

  return (
    <BannerWrapper
      size={'small'}
      showBackground={false}
      color={'primary'}
      onBack={onBack}
      title={`View ${reportMonth} Report `}
      subTitle={''}
      //   className={styles.bannerContentWrapper}
    >
     


    </BannerWrapper>
  );
};

export default MonthlyAttendanceReport;
