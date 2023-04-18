export const limitStringLength = (string = '', limit = 0) => {
  if (string.trim().length > 50) {
    return string.substring(0, limit) + '...';
  } else {
    return string.substring(0, limit);
  }
};
