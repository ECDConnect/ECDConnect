import attendanceWalkthrough from '../../modules/attendance/walkthrough/nr.json';
import programmeWalkthrough from '../../modules/programme/walkthrough/nr.json';
import incomeStatementsWalkthrough from '../../modules/income-statements/walkthrough/nr.json';
import progressWalkthrough from '../../modules/progress/walkthrough/nr.json';

export const NR = {
  translation: {
    ...attendanceWalkthrough,
    ...programmeWalkthrough,
    ...incomeStatementsWalkthrough,
    ...progressWalkthrough,
  },
};
