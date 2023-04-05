import { ButtonGroupOption } from '@ecdlink/ui';
import { Weekdays } from '@/utils/practitioner/playgroups-utils';

export const isFullDayOptions = [
  { value: false, text: 'Half Day' },
  { value: true, text: 'Full Day' },
];

export const buttonDays: ButtonGroupOption<Weekdays>[] = [
  {
    text: 'Monday',
    value: Weekdays.mon,
  },
  {
    text: 'Tuesday',
    value: Weekdays.tue,
  },
  {
    text: 'Wednesday',
    value: Weekdays.wed,
  },
  {
    text: 'Thursday',
    value: Weekdays.thu,
  },
  {
    text: 'Friday',
    value: Weekdays.fri,
  },
];
