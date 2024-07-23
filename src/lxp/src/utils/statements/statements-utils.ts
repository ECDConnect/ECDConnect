import {
  BaseIncomeExpenseItem,
  ChildDto,
  IncomeStatementDto,
} from '@/../../../packages/core/lib';

export const moneyInputFormat = (val: string) => {
  const formattedValue = val.replace(/[^0-9.]/g, '');
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

export const getChildName = (childUserId: string, children: ChildDto[]) => {
  const child = children?.find((item) => item?.userId === childUserId);
  return !!child
    ? `${child?.user?.firstName} ${child?.user?.surname}`
    : 'Unknown';
};

export const formatCurrentValue = (value: number) => {
  if (value === 0) return `R ${numberWithSpaces(String(value.toFixed(2)))}`;

  if (value > 0) return `+ R ${numberWithSpaces(String(value.toFixed(2)))}`;

  if (value < 0)
    return `- R ${numberWithSpaces(String(Math.abs(value).toFixed(2)))}`;
};

export const getStatementIncomeTotal = (
  statement: IncomeStatementDto | undefined
) =>
  statement?.incomeItems.reduce((total, item) => {
    return total + item.amount;
  }, 0) ?? 0;

export const getStatementExpenseTotal = (
  statement: IncomeStatementDto | undefined
) =>
  statement?.expenseItems.reduce((total, item) => {
    return total + item.amount;
  }, 0) ?? 0;

export const getStatementBalance = (
  statement: IncomeStatementDto | undefined
) => getStatementIncomeTotal(statement) - getStatementExpenseTotal(statement);

export const getStatementsBalance = (statements: IncomeStatementDto[]) =>
  statements.reduce((total, current) => {
    return total + getStatementBalance(current);
  }, 0);
