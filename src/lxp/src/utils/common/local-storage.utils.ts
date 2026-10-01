import { LocalStorageKeys } from '@ecdlink/core';

/**
 * Reads a value written by `setStorageItem`.
 *
 * Values are stored as JSON. Anything that fails to parse is returned as the
 * raw string: `setStorageItem` used to write values without serialising them,
 * so devices in the field still hold unquoted strings under some keys.
 */
export const getStorageItem = <T>(key: LocalStorageKeys): T | undefined => {
  let storageValue: string | null;

  try {
    storageValue = localStorage.getItem(key);
  } catch (error) {
    // Storage can be unavailable entirely (private mode, blocked site data).
    return undefined;
  }

  if (!storageValue) return undefined;

  try {
    return JSON.parse(storageValue) as T;
  } catch (error) {
    return storageValue as unknown as T;
  }
};

export const setStorageItem = <T>(item: T, key: LocalStorageKeys): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    // Quota exceeded, or storage unavailable.
    return false;
  }
};
