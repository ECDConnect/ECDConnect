import attendanceWalkthrough from '../../modules/attendance/walkthrough/ve.json';
import programmeWalkthrough from '../../modules/programme/walkthrough/ve.json';
import incomeStatementsWalkthrough from '../../modules/income-statements/walkthrough/ve.json';
import progressWalkthrough from '../../modules/progress/walkthrough/ve.json';

export const VE = {
  translation: {
    ...attendanceWalkthrough,
    ...programmeWalkthrough,
    ...incomeStatementsWalkthrough,
    ...progressWalkthrough,
  },
};
