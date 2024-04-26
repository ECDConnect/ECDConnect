import { format } from 'date-fns';

const today = new Date();
const yearDate = format(today, 'y');

export const ReportMonths = [
  { label: `January ${yearDate}`, value: '1' },
  { label: `February ${yearDate}`, value: '2' },
  { label: `March ${yearDate}`, value: '3' },
  { label: `April ${yearDate}`, value: '4' },
  { label: `May ${yearDate}`, value: '5' },
  { label: `June ${yearDate}`, value: '6' },
  { label: `July ${yearDate}`, value: '7' },
  { label: `August ${yearDate}`, value: '8' },
  { label: `September ${yearDate}`, value: '9' },
  { label: `October ${yearDate}`, value: '10' },
  { label: `November ${yearDate}`, value: '11' },
  { label: `December ${yearDate}`, value: '12' },
];

export const monthsNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
