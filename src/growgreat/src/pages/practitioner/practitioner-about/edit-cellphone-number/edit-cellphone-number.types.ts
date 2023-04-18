import { UserDto } from '@/../../../packages/core/lib';

export interface EditCellPhoneNUmberProps {
  setEditiCellPhoneNumber?: any;
  user?: UserDto;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
