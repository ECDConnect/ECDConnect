import { LocalStorageKeys } from '@ecdlink/core';
import { getStorageItem, setStorageItem } from './local-storage.utils';

const key = LocalStorageKeys.acquisitionTracking;

describe('local-storage.utils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test('round trips booleans', () => {
    setStorageItem(true, key);
    expect(getStorageItem<boolean>(key)).toEqual(true);

    setStorageItem(false, key);
    expect(getStorageItem<boolean>(key)).toEqual(false);
  });

  test('round trips numbers', () => {
    setStorageItem(2026, key);

    expect(getStorageItem<number>(key)).toEqual(2026);
  });

  test('round trips strings', () => {
    setStorageItem('data:image/png;base64,AAAA', key);

    expect(getStorageItem<string>(key)).toEqual('data:image/png;base64,AAAA');
  });

  test('round trips objects', () => {
    setStorageItem({ a: 1, b: [2] }, key);

    expect(getStorageItem<{ a: number; b: number[] }>(key)).toEqual({
      a: 1,
      b: [2],
    });
  });

  test('returns undefined for a key that was never written', () => {
    expect(getStorageItem(key)).toBeUndefined();
  });

  test('stores booleans and numbers exactly as the previous implementation did', () => {
    // Guards the upgrade path: values already on devices must stay readable.
    setStorageItem(true, key);
    expect(localStorage.getItem(key)).toEqual('true');

    setStorageItem(2026, key);
    expect(localStorage.getItem(key)).toEqual('2026');
  });

  test('reads unserialised values left by the previous implementation', () => {
    localStorage.setItem(key, 'data:image/png;base64,AAAA');

    expect(getStorageItem<string>(key)).toEqual('data:image/png;base64,AAAA');
  });

  test('returns malformed values as-is rather than throwing', () => {
    localStorage.setItem(key, '{not json');

    expect(() => getStorageItem(key)).not.toThrow();
    expect(getStorageItem<string>(key)).toEqual('{not json');
  });

  test('returns false instead of throwing when the quota is exceeded', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(setStorageItem('x', key)).toEqual(false);
  });

  test('returns undefined instead of throwing when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    expect(getStorageItem(key)).toBeUndefined();
  });
});
