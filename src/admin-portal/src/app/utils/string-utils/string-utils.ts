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

export const getFirstWord = (str) => {
  return str.replace(/\s.*/, '');
};

export const isRemovedUser = (word) => {
  if (getFirstWord(word) === 'Removed:') {
    return true;
  } else {
    return false;
  }
};

export const hyphenRegex = /^-|-$/;
