import { AttendanceResult } from '@/models/classroom/attendance/AttendanceResult';
import { BannerWrapper } from '@ecdlink/ui';
import { format } from 'date-fns';
import AttendanceList from '../../../attendance-list/attendance-list';
import { EditAttendanceRegisterProps } from '../../../edit-attendance-register/edit-attendance-register.types';

export const MonthlyAttendanceReport = ({
  attendanceDate,
  onComplete,
  submitText = 'Submit',
  onBack,
  editAttendanceRegisterVisible,
}: EditAttendanceRegisterProps) => {
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
      title={'Edit Register'}
      subTitle={format(attendanceDate, 'EEEE, d LLLL')}
      //   className={styles.bannerContentWrapper}
    >
      <AttendanceList
        attendanceDate={attendanceDate}
        submitText={submitText}
        onSubmitSuccess={(attendanceSuccessList: AttendanceResult) =>
          attendanceSubmitted(attendanceSuccessList)
        }
        editAttendanceRegisterVisible={editAttendanceRegisterVisible}
      />
    </BannerWrapper>
  );
};

export default MonthlyAttendanceReport;
