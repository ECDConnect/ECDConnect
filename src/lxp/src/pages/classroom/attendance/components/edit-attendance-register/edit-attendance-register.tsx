import { BannerWrapper } from '@ecdlink/ui';
import { format } from 'date-fns';
import AttendanceList from '../attendance-list/attendance-list';
import * as styles from './edit-attendance-register.styles';
import { EditAttendanceRegisterProps } from './edit-attendance-register.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

export const EditAttendanceRegister = ({
  attendanceDate,
  onBack,
  editAttendanceRegisterVisible,
  classroomName,
  classroomGroupId,
}: EditAttendanceRegisterProps) => {
  const { isOnline } = useOnlineStatus();

  return (
    <BannerWrapper
      size={'small'}
      showBackground={false}
      color={'primary'}
      onBack={onBack}
      title={`Edit ${classroomName} Register`}
      subTitle={format(attendanceDate, 'EEEE, d LLLL')}
      className={styles.bannerContentWrapper}
      displayOffline={!isOnline}
    >
      <AttendanceList
        attendanceDate={attendanceDate}
        onSubmitSuccess={onBack}
        editAttendanceRegisterVisible={editAttendanceRegisterVisible}
        classroomGroupId={classroomGroupId}
      />
    </BannerWrapper>
  );
};

export default EditAttendanceRegister;
