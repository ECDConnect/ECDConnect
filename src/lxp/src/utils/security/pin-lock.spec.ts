import './test-webcrypto';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  INACTIVITY_TIMEOUT_MS,
  clearPin,
  getPinLength,
  hasPin,
  isInactive,
  isPinShape,
  savePin,
  touchActivity,
  verifyPin,
} from './pin-lock';

const fast = { iterations: 1000 };

describe('pin lock', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores a PIN for one user and checks it', async () => {
    await savePin('user-1', '1234', fast);

    expect(hasPin('user-1')).toBe(true);
    expect(hasPin('user-2')).toBe(false);
    expect(getPinLength('user-1')).toBe(4);
    expect(await verifyPin('user-1', '1234')).toBe(true);
    expect(await verifyPin('user-1', '9999')).toBe(false);
    expect(await verifyPin('user-2', '1234')).toBe(false);
    expect(localStorage.getItem('ecdlink.pinLock.v1')).not.toContain('1234');
  });

  it('accepts 4 to 6 digits only', async () => {
    expect(isPinShape('123')).toBe(false);
    expect(isPinShape('1234')).toBe(true);
    expect(isPinShape('123456')).toBe(true);
    expect(isPinShape('1234567')).toBe(false);
    expect(isPinShape('12a4')).toBe(false);
    await expect(savePin('user-1', '12', fast)).rejects.toThrow(/PIN/);
  });

  it('removes a PIN without removing another user', async () => {
    await savePin('user-1', '1234', fast);
    await savePin('user-2', '5678', fast);

    clearPin('user-1');

    expect(hasPin('user-1')).toBe(false);
    expect(await verifyPin('user-2', '5678')).toBe(true);
  });

  it('treats a missing or old last-active time as inactive', () => {
    expect(isInactive()).toBe(true);

    touchActivity(1_000);
    expect(
      isInactive(INACTIVITY_TIMEOUT_MS, 1_000 + INACTIVITY_TIMEOUT_MS - 1)
    ).toBe(false);
    expect(
      isInactive(INACTIVITY_TIMEOUT_MS, 1_000 + INACTIVITY_TIMEOUT_MS)
    ).toBe(true);
  });
});
