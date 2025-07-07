import attendanceWalkthrough from '../../modules/attendance/walkthrough/ss.json';
import programmeWalkthrough from '../../modules/programme/walkthrough/ss.json';
import incomeStatementsWalkthrough from '../../modules/income-statements/walkthrough/ss.json';
import progressWalkthrough from '../../modules/progress/walkthrough/ss.json';

export const SS = {
  translation: {
    ...attendanceWalkthrough,
    ...programmeWalkthrough,
    ...incomeStatementsWalkthrough,
    ...progressWalkthrough,
  },
};
