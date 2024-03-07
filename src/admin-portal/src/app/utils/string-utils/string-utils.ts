export function findObjectWithString(array, key, searchString) {
  return array?.find(
    (obj) => obj[key]?.toLowerCase() === searchString?.toLowerCase()
  );
}
