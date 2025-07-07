import attendanceWalkthrough from '../../modules/attendance/walkthrough/st.json';
import programmeWalkthrough from '../../modules/programme/walkthrough/st.json';
import incomeStatementsWalkthrough from '../../modules/income-statements/walkthrough/st.json';
import progressWalkthrough from '../../modules/progress/walkthrough/st.json';

export const ST = {
  translation: {
    ...attendanceWalkthrough,
    ...programmeWalkthrough,
    ...incomeStatementsWalkthrough,
    ...progressWalkthrough,
  },
};
