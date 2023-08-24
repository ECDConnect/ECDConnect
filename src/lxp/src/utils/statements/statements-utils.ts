import { ChildDto } from '@/../../../packages/core/lib';

export const moneyInputFormat = (val: string) => {
  const formattedValue = Number(val?.split(',')?.join(''));
  return formattedValue;
};

export const isNumber = (val: string) => {
  return /^[0-9.,]+$/.test(val);
};

export function numberWithSpaces(x: string) {
  return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const incomesValueFunc = (item: any) => {
  const total: any = item?.reduce(function (prev: any, current: any) {
    return prev + +current?.amount;
  }, 0);

  return numberWithSpaces(total.toFixed(2));
};

export const getChildName = (childId: string, children: ChildDto[]) => {
  const childName: ChildDto =
    children?.find((item) => item?.id === childId) || {};
  return (
    childName?.user?.fullName ||
    `${childName?.user?.firstName} ${childName?.user?.surname}`
  );
};
