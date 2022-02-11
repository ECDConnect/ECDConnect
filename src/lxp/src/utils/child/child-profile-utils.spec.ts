import { getAge, hasMonthPassed, isReportDue } from './child-profile-utils';

describe('child-profile-utils', () => {
  describe('getAge', () => {
    test('should return difference in age', () => {
      const result = getAge(new Date('2018-02-03'));
      expect(result).toBe('0');
    });
  });

  describe('hasMonthPassed', () => {
    test('should return true when time passed is more than a month from the current date', () => {
      const result = hasMonthPassed(new Date('2018-02-03'));
      expect(result).toBe(true);
    });

    test('should return false time when passed is less than a month from the current date', () => {
      const result = hasMonthPassed(new Date());
      expect(result).toBe(false);
    });
  });

  describe('isReportOverdueDate', () => {
    test('should return true current date is 1 July', () => {
      const result = isReportDue(new Date('2021-07-01'));
      expect(result).toBe(true);
    });

    test('should return true current date is 1 December', () => {
      const result = isReportDue(new Date('2021-12-01'));
      expect(result).toBe(true);
    });

    test('should return false if current date is not 1 December or 1 July', () => {
      const result = isReportDue(new Date('2021-06-01'));
      expect(result).toBe(false);
    });
  });

  // describe('getChildsAttendancePercentageAtPlaygroup', () => {
  //   test('it should return the % amound of attendance', () => {
  //     const attendance: RecursivePartial<Attendance>[] = [
  //       {
  //         classProgrammeId: 1,
  //         userId: '1',
  //         attended: true,
  //       },
  //       {
  //         classProgrammeId: 1,
  //         userId: '1',
  //         attended: false,
  //       },
  //       {
  //         classProgrammeId: 1,
  //         userId: '1',
  //         attended: false,
  //       },
  //       {
  //         classProgrammeId: 1,
  //         userId: '1',
  //         attended: false,
  //       },
  //     ];

  //     const result = getChildsAttendancePercentageAtPlaygroup(
  //       '1',
  //       attendance as Attendance[],
  //       ''
  //     );

  //     expect(result).toBe(25);
  //   });
  // });
});
