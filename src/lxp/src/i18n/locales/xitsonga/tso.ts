import attendanceWalkthrough from '../../modules/attendance/walkthrough/tso.json';
import progressWalkthrough from '../../modules/progress/walkthrough/tso.json';

export const TSO = {
  translation: {
    ...attendanceWalkthrough,
    ...progressWalkthrough,
  },
};
