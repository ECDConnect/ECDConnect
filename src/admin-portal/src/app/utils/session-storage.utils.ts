import { SessionStorageKeys } from '@ecdlink/core';

export const getSessionItem = <T>(key: SessionStorageKeys): T | undefined => {
  let sessionValue: string | null;

  try {
    sessionValue = sessionStorage.getItem(key);
  } catch (error) {
    // Storage can be unavailable entirely (private mode, blocked site data).
    return undefined;
  }

  if (!sessionValue) return undefined;

  try {
    return JSON.parse(sessionValue) as T;
  } catch (error) {
    return undefined;
  }
};

export const setSessionItem = <T>(
  item: T,
  key: SessionStorageKeys
): boolean => {
  try {
    sessionStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    return false;
  }
};

export const removeSessionItem = (key: SessionStorageKeys): boolean => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
};
