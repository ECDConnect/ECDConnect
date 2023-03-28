const getDataPerTime = (data: number[], daysPerTime: number[]) => {
  let timeData: number[] = [];

  if (daysPerTime.length > 0) {
    daysPerTime.reduce(
      (acc, val) => {
        let yearData = data.slice(acc[0], acc[0] + val);
        if (yearData.length > 0) {
          let sum = yearData.reduce((a, b) => a + b);
          let avg = sum / val;
          timeData.push(avg);
        }
        return [acc[0] + val];
      },
      [0]
    );
  }

  return timeData;
};

export const getDataPerMonth = (data: number[]) => {
  const daysPerMonth = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 28, 31, 30, 31, 30, 31,
    31, 30, 31, 30, 31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 28, 31, 30, 31, 30, 31, 31, 30,
    31, 30, 31, 31,
  ];

  let monthlyData: number[] = [];

  if (daysPerMonth.length > 0) {
    daysPerMonth.reduce(
      (acc, val) => {
        let sum = data.slice(acc[0], acc[0] + val).reduce((a, b) => a + b);
        let avg = sum / val;
        monthlyData.push(avg);
        return [acc[0] + val];
      },
      [0]
    );

    return monthlyData;
  }
};

export const getDataPerYear = (data: number[]) => {
  const daysPerYear = [365, 365, 365, 365, 365];

  let yearlyData: number[] = [];

  if (daysPerYear.length > 0) {
    daysPerYear.reduce(
      (acc, val) => {
        let yearData = data.slice(acc[0], acc[0] + val);
        if (yearData.length > 0) {
          let sum = yearData.reduce((a, b) => a + b);
          let avg = sum / val;
          yearlyData.push(avg);
        }
        return [acc[0] + val];
      },
      [0]
    );
  }

  return yearlyData;
};

export const getDataPerWeek = (data: number[]) => {
  const daysPerWeek = new Array(265).fill(7);

  return getDataPerTime(data, daysPerWeek);
};

export function fillInMissingNumbers(
  arr: (number | undefined)[]
): (number | undefined)[] {
  const numericIndices = arr
    .map((value, index) => ({ value, index }))
    .filter(({ value }) => typeof value === 'number')
    .map(({ index }) => index);

  numericIndices.slice(0, -1).forEach((startIndex, segmentIndex) => {
    const endIndex = numericIndices[segmentIndex + 1];
    const startValue = arr[startIndex] as number;
    const endValue = arr[endIndex] as number;
    const segmentLength = endIndex - startIndex;

    const interpolatedValues = Array.from(
      { length: segmentLength - 1 },
      (_, valueIndex) => {
        const alpha = (valueIndex + 1) / segmentLength;
        return startValue + (endValue - startValue) * alpha;
      }
    );

    arr.splice(startIndex + 1, segmentLength - 1, ...interpolatedValues);
  });

  return arr;
}
