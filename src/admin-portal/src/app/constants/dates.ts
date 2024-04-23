export const DateFormats: DateFormatOption = {
  dayFullMonthYear: {
    day: 'numeric',
    weekday: 'long',
    month: 'long',
    year: 'numeric',
  },
  standardDate: { year: 'numeric', month: 'long', day: 'numeric' },
  monthName: { month: 'long' },
  shortMonthName: { month: 'short' },
  dayWithShortMonthName: { day: 'numeric', month: 'short' },
  dayWithLongMonthName: { day: 'numeric', weekday: 'long', month: 'long' },
  shortMonthNameAndYear: { month: 'short', year: 'numeric' },
  longMonthNameAndYear: { month: 'long', year: 'numeric' },
};

type DateFormatOption = {
  dayFullMonthYear: Intl.DateTimeFormatOptions;
  standardDate: Intl.DateTimeFormatOptions;
  monthName: Intl.DateTimeFormatOptions;
  shortMonthName: Intl.DateTimeFormatOptions;
  dayWithShortMonthName: Intl.DateTimeFormatOptions;
  dayWithLongMonthName: Intl.DateTimeFormatOptions;
  shortMonthNameAndYear: Intl.DateTimeFormatOptions;
  longMonthNameAndYear: Intl.DateTimeFormatOptions;
};

export const ShortMonths: ShortMonthType[] = [
  { label: 'Jan', value: 1 },
  { label: 'Feb', value: 2 },
  { label: 'Mar', value: 3 },
  { label: 'Apr', value: 4 },
  { label: 'May', value: 5 },
  { label: 'Jun', value: 6 },
  { label: 'Jul', value: 7 },
  { label: 'Aug', value: 8 },
  { label: 'Sep', value: 9 },
  { label: 'Oct', value: 10 },
  { label: 'Nov', value: 11 },
  { label: 'Dec', value: 12 },
];

type ShortMonthType = {
  label: string;
  value: number;
};

export const IncomeStatementDates = {
  SubmitStartDay: 25,
  SubmitEndDay: 7, // Reset back to 7 after testing!
};
