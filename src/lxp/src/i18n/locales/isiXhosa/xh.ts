import attendanceWalkthrough from '../../modules/attendance/walkthrough/xh.json';
import programmeWalkthrough from '../../modules/programme/walkthrough/xh.json';
import incomeStatementsWalkthrough from '../../modules/income-statements/walkthrough/xh.json';
import progressWalkthrough from '../../modules/progress/walkthrough/xh.json';

export const XH = {
  translation: {
    ...attendanceWalkthrough,
    ...programmeWalkthrough,
    ...incomeStatementsWalkthrough,
    ...progressWalkthrough,
  },
};
