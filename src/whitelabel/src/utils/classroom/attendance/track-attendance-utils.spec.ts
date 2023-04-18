import { ClassProgramme, Holiday } from '@ecdlink/graphql';
import { RecursivePartial } from '@ecdlink/core';

import {
  isAttendableDay,
  getMissedClassAttendance,
  getMonthName,
} from './track-attendance-utils';
import { Weekdays } from '../../practitioner/playgroups-utils';

const holidays: Holiday[] = [
  { day: new Date('01 Jan 2021') },
  { day: new Date('01 Jan 2021') },
  { day: new Date('02 Apr 2021') },
  { day: new Date('02 Apr 2021') },
  { day: new Date('02 Apr 2021') },
  { day: new Date('01 May 2021') },
];

describe('days-utils', () => {
  describe('isAttendableDay', () => {
    type AttendableDayCases = [Date, number[], boolean];

    const cases: AttendableDayCases[] = [
      [new Date('08/30/2021'), [1, 3, 5], true],
      [new Date('08/31/2021'), [1, 3, 5], false],
      [new Date('09/01/2021'), [1, 3, 5], true],
      [new Date('09/02/2021'), [1, 3, 5], false],
      [new Date('09/03/2021'), [1, 3, 5], true],
    ];
    test.each(cases)(
      'givin %date and %attendanceDays, return %isValidDay',
      (date, attendanceDays, isValidDay) => {
        const result = isAttendableDay(date, attendanceDays);
        expect(result).toEqual(isValidDay);
      }
    );
  });

  describe('isWorkingDay', () => {
    type WorkingDayCases = [Date, Holiday[], boolean];

    const cases: WorkingDayCases[] = [
      [new Date('02/09/2021'), holidays, true],
      [new Date('01 Jan 2021'), holidays, false],
      [new Date('05 Sep 2021'), holidays, false],
    ];
    test.each(cases)(
      'givin %date and %holidays, return %isValidDay',
      (date, holidays, isValidDay) => {
        const result = isWorkingDay(date, holidays);
        expect(result).toEqual(isValidDay);
      }
    );
  });

  describe('getMissedClassAttendance', () => {
    test('should return the class programmes that have no or empty attendance', () => {
      const classProgrammes: RecursivePartial<ClassProgramme>[] = [
        {
          id: 1,
          attendance: [
            {
              classProgrammeId: 1,
              attendanceDate: new Date('08/30/2021') as any,
              classProgramme: {
                classroomGroup: {
                  name: 'test group',
                },
              },
            },
          ],
          meetingDay: Weekdays.mon,
        },
        {
          id: 2,
          attendance: [],
          meetingDay: Weekdays.wed,
        },
        {
          id: 4,
          meetingDay: Weekdays.thu,
        },
        {
          id: 3,
          attendance: [
            {
              classProgrammeId: 3,
              attendanceDate: new Date('09/01/2021') as any,
              classProgramme: {
                classroomGroup: {
                  name: 'test group',
                },
              },
            },
          ],
          meetingDay: Weekdays.fri,
        },
      ];

      const result = getMissedClassAttendance(
        classProgrammes as ClassProgramme[]
      );

      expect(result).toEqual([
        { id: 2, attendance: [], meetingDay: 3 },
        {
          id: 4,
          meetingDay: Weekdays.thu,
        },
      ]);
    });
  });

  describe('getMonthName', () => {
    type getMonthCaseType = [number, string];

    const cases: getMonthCaseType[] = [
      [0, 'January'],
      [1, 'February'],
      [2, 'March'],
      [3, 'April'],
      [4, 'May'],
      [5, 'June'],
      [6, 'July'],
      [7, 'August'],
      [8, 'September'],
      [9, 'October'],
      [10, 'November'],
      [11, 'December'],
      [-1, 'Invalid month'],
      [13, 'Invalid month'],
    ];

    test.each(cases)(
      'givin %monthOfYear, return %monthName',
      (monthOfYear, monthName) => {
        const result = getMonthName(monthOfYear);

        expect(result).toEqual(monthName);
      }
    );
  });
});
