import attendanceWalkthrough from '../../modules/attendance/walkthrough/nso.json';
import progressWalkthrough from '../../modules/progress/walkthrough/nso.json';

export const NSO = {
  translation: {
    ...attendanceWalkthrough,
    ...progressWalkthrough,
  },
};
