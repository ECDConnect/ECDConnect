import { LocalStorageKeys } from '@ecdlink/core';

export const getStorageItem = <T>(key: LocalStorageKeys): T | undefined => {
  const storageValue = localStorage.getItem(key);

  if (!storageValue) return undefined;

  const parsedValue = JSON.parse(storageValue) as T;
  return parsedValue;
};

export const setStorageItem = (item: any, key: LocalStorageKeys): boolean => {
  try {
    localStorage.setItem(key, item);
    return true;
  } catch (error) {
    return false;
  }
};
