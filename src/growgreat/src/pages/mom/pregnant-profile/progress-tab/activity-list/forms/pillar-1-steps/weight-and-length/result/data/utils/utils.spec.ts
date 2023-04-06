import { fillInMissingNumbers } from './utils';

export {};

describe('fillInMissingNumbers', () => {
  it('should return the array with interpolated values', () => {
    const arr = [undefined, 3, undefined, 7, undefined, undefined];
    const expected = [undefined, 3, 5, 7, undefined, undefined];
    const result = fillInMissingNumbers(arr);
    expect(result).toEqual(expected);
  });

  it('should return the same array if there are no numeric values', () => {
    const arr = [undefined, undefined, undefined];
    const expected = [undefined, undefined, undefined];
    const result = fillInMissingNumbers(arr);
    expect(result).toEqual(expected);
  });

  it('should return the same array if there is only one numeric value', () => {
    const arr = [undefined, undefined, 3, undefined, undefined];
    const expected = [undefined, undefined, 3, undefined, undefined];
    const result = fillInMissingNumbers(arr);
    expect(result).toEqual(expected);
  });

  it('should return the same array if all values are numeric', () => {
    const arr = [1, 2, 3, 4, 5];
    const expected = [1, 2, 3, 4, 5];
    const result = fillInMissingNumbers(arr);
    expect(result).toEqual(expected);
  });
});
