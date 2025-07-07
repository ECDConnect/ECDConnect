import attendanceWalkthrough from '../../modules/attendance/walkthrough/tso.json';
import programmeWalkthrough from '../../modules/programme/walkthrough/tso.json';
import incomeStatementsWalkthrough from '../../modules/income-statements/walkthrough/tso.json';
import progressWalkthrough from '../../modules/progress/walkthrough/tso.json';

export const TSO = {
  translation: {
    ...attendanceWalkthrough,
    ...programmeWalkthrough,
    ...incomeStatementsWalkthrough,
    ...progressWalkthrough,
  },
};
