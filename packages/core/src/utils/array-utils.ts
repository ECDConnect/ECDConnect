export const getArrayRange = (start: number, end: number) => {
  return Array(end - start + 1)
    .fill(0)
    .map((_, idx) => start + idx);
};

export const groupBy = <T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K
) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

export const sortDateFunction = (a: Date, b: Date) => {
  const dateA = new Date(a).getTime();
  const dateB = new Date(b).getTime();
  return dateA > dateB ? 1 : -1;
};

export const flatArray = (array: any[]): any[] => {
  return array.reduce((acc, val) => acc.concat(val), []);
};

export const mapArrayToObject = (array: any[], key: string) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return { ...obj, [item[key]]: item };
  }, initialValue);
};
