export const moneyInputFormat = (val: string) => {
  return Number(val.slice(1));
};

export const isNumber = (val: string) => {
  return /^\d+$/.test(val?.slice(1)!);
};
