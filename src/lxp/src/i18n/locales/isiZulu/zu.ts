import attendanceWalkthrough from '../../modules/attendance/walkthrough/zu.json';
import programmeWalkthrough from '../../modules/programme/walkthrough/zu.json';
import incomeStatementsWalkthrough from '../../modules/income-statements/walkthrough/zu.json';
import progressWalkthrough from '../../modules/progress/walkthrough/zu.json';

export const ZU = {
  translation: {
    ...attendanceWalkthrough,
    ...programmeWalkthrough,
    ...incomeStatementsWalkthrough,
    ...progressWalkthrough,
  },
};
