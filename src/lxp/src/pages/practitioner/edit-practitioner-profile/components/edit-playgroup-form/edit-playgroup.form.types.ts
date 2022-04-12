import { FormComponentProps } from '@ecdlink/core';
import { ButtonGroupOption } from '@ecdlink/ui';
import { EditPlaygroupModel } from '@schemas/practitioner/edit-playgroups';
import { Weekdays } from '@utils/practitioner/playgroups-utils';

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

export const dayTypes: ButtonGroupOption<boolean>[] = [
  { text: 'Half day', value: false },
  { text: 'Full day', value: true },
];

export interface EditPlaygroupProps
  extends FormComponentProps<EditPlaygroupModel> {
  isNew: boolean;
  playgroup?: EditPlaygroupModel;
  title: string;
  onDelete?: () => void;
}
