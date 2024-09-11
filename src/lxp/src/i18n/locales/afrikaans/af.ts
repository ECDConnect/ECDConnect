import attendanceWalkthrough from '../../modules/attendance/walkthrough/af.json';
import programmeWalkthrough from '../../modules/programme/walkthrough/af.json';
import incomeStatementsWalkthrough from '../../modules/income-statements/walkthrough/af.json';
import progressWalkthrough from '../../modules/progress/walkthrough/af.json';

export const AF = {
  translation: {
    ...attendanceWalkthrough,
    ...programmeWalkthrough,
    ...incomeStatementsWalkthrough,
    ...progressWalkthrough,
  },
};
