import { BaseIncomeExpenseItem, ChildDto } from '@/../../../packages/core/lib';

export const moneyInputFormat = (val: string) => {
  const formattedValue = Number(val?.split(',')?.join('').replace(/\s/g, ''));
  return formattedValue;
};

export const isNumber = (val: string) => {
  return /^[0-9.,]+$/.test(val);
};

export function numberWithSpaces(x: string) {
  return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const sumIncomeOrExpenseItems = (items: BaseIncomeExpenseItem[]) => {
  return items.reduce((sum: number, current) => {
    return sum + current.amount;
  }, 0);
};

export const formatCurrency = (value: number) => {
  return numberWithSpaces(value.toFixed(2));
};

export const getChildName = (childId: string, children: ChildDto[]) => {
  const childName: ChildDto =
    children?.find((item) => item?.id === childId) || {};
  return (
    childName?.user?.fullName ||
    `${childName?.user?.firstName} ${childName?.user?.surname}`
  );
};

export const formatCurrentValue = (value: number) => {
  if (value === 0) return `R ${numberWithSpaces(String(value.toFixed(2)))}`;

  if (value > 0) return `+ R ${numberWithSpaces(String(value.toFixed(2)))}`;

  if (value < 0)
    return `- R ${numberWithSpaces(String(Math.abs(value).toFixed(2)))}`;
};
