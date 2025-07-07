import attendanceWalkthrough from '../../modules/attendance/walkthrough/tn.json';
import programmeWalkthrough from '../../modules/programme/walkthrough/tn.json';
import incomeStatementsWalkthrough from '../../modules/income-statements/walkthrough/tn.json';
import progressWalkthrough from '../../modules/progress/walkthrough/tn.json';

export const TN = {
  translation: {
    ...attendanceWalkthrough,
    ...programmeWalkthrough,
    ...incomeStatementsWalkthrough,
    ...progressWalkthrough,
  },
};
