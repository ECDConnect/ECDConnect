import attendanceWalkthrough from '../../modules/attendance/walkthrough/en-za.json';
import programmeWalkthrough from '../../modules/programme/walkthrough/en-za.json';
import incomeStatementsWalkthrough from '../../modules/income-statements/walkthrough/en-za.json';
import progressWalkthrough from '../../modules/progress/walkthrough/en-za.json';

export const EN_ZA = {
  translation: {
    ...attendanceWalkthrough,
    ...programmeWalkthrough,
    ...incomeStatementsWalkthrough,
    ...progressWalkthrough,
  },
};
