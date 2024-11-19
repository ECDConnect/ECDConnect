import attendanceWalkthrough from '../../modules/attendance/walkthrough/nso.json';
import programmeWalkthrough from '../../modules/programme/walkthrough/nso.json';
import incomeStatementsWalkthrough from '../../modules/income-statements/walkthrough/nso.json';
import progressWalkthrough from '../../modules/progress/walkthrough/nso.json';

export const NSO = {
  translation: {
    ...attendanceWalkthrough,
    ...programmeWalkthrough,
    ...incomeStatementsWalkthrough,
    ...progressWalkthrough,
  },
};
