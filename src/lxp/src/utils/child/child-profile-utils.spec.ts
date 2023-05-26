import {
  getAge,
  getChildAttendancePercentageAtPlaygroup,
  hasMonthPassed,
} from './child-profile-utils';
import {
  attendance,
  childUserId,
  classProgrammes,
  classroomGroupId,
} from './child-profile-utils.mock';

describe('child-profile-utils', () => {
  describe('getChildAttendancePercentageAtPlaygroup', () => {
    test('it should return the weekly attendance status', () => {
      const result = getChildAttendancePercentageAtPlaygroup(
        childUserId,
        attendance,
        classroomGroupId,
        classProgrammes,
        'practitioner'
      );

      expect(result).toStrictEqual({
        daysAttended: 1,
        daysExpected: 5,
        percentage: 100,
      });
    });

    test('it should return the monthly attendance status', () => {
      const result = getChildAttendancePercentageAtPlaygroup(
        childUserId,
        attendance,
        classroomGroupId,
        classProgrammes,
        'coach'
      );

      expect(result).toStrictEqual({
        daysAttended: 2,
        daysExpected: 20,
        percentage: 100,
      });
    });
  });

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
