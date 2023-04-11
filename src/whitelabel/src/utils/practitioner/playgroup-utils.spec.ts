import { calculateSelectedDaysFromBitwise } from './playgroups-utils';

describe('playgroups util', () => {
  describe('calculateSelectedDaysFromBitwise', () => {
    test('should return array with mon and wed', () => {
      const results = calculateSelectedDaysFromBitwise(6);
      const expectedResult = [2, 4];
      expect(results).toEqual(expectedResult);
    });
  });
});
