export function findObjectWithString(array, key, searchString, isEdit) {
  return array?.find(
    (obj) => obj[key]?.toLowerCase() === searchString?.toLowerCase() && !isEdit
  );
}
