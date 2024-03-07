import { format, getMonth } from 'date-fns';

export const getCommunityQuarterDescription = (date: Date) => {
  const quarters = [
    { startMonth: 9, endMonth: 11, quarter: 1, name: 'October to December' }, // Q1: Oct, Nov, Dec
    { startMonth: 0, endMonth: 2, quarter: 2, name: 'January to March' }, // Q2: Jan, Feb, Mar
    { startMonth: 3, endMonth: 5, quarter: 3, name: 'April to June' }, // Q3: Apr, May, Jun
    { startMonth: 6, endMonth: 8, quarter: 4, name: 'July to September' }, // Q4: Jul, Aug, Sep
  ];

  const month = getMonth(date);
  let quarterDescription = '';
  let quarter = quarters[0];

  quarters.forEach((currentQuarter) => {
    if (
      month >= currentQuarter.startMonth &&
      month <= currentQuarter.endMonth
    ) {
      const year = format(date, 'yyyy');
      quarterDescription = `Quarter ${currentQuarter.quarter}: ${currentQuarter.name} ${year}`;
      quarter = currentQuarter;
    }
  });

  return { quarterDescription, quarter };
};
