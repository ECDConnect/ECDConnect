export const moneyInputFormat = (val: string) => {
  const formattedValue = Number(val.split(',').join(''));
  return formattedValue;
};

export const isNumber = (val: string) => {
  return /^[0-9.,]+$/.test(val);
};
