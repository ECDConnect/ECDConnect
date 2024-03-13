import { useCallback } from 'react';

export function findObjectWithString(array, key, searchString) {
  return array?.find(
    (obj) => obj?.[key]?.toLowerCase() === searchString?.toLowerCase()
  );
}

export const filterByValue = (array, value) => {
  return array?.filter(
    (data) =>
      JSON?.stringify(data)?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1
  );
};
