import { SA_ID_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface ChildInformationFormModel {
  firstname?: string;
  surname?: string;
  playgroupId: string;
  childIdField?: string;
  dobDay: number;
  dobMonth: number;
  dobYear: number;
  dob?: Date;
  dobValid?: boolean;
}

export const childInformationFormSchema = Yup.object().shape({
  dobValid: Yup.bool().isTrue().required(),
  childIdField: Yup.lazy((value: string) => {
    if (!!value)
      return Yup.string().matches(
        SA_ID_REGEX,
        'Please enter a valid ID number'
      );

    return Yup.string();
  }),
});

export const childInformationFormSchemaCaregiver = Yup.object().shape({
  firstname: Yup.string().required(),
  surname: Yup.string().required(),
  dobValid: Yup.bool().isTrue().required(),
  childIdField: Yup.lazy((value: string) => {
    if (!!value)
      return Yup.string().matches(
        SA_ID_REGEX,
        'Please enter a valid ID number'
      );

    return Yup.string();
  }),
});

export const dobYearsBetweenHigher = 7;

export const idMismatchMessage = 'ID number and date of birth do not match.';
export const idMismatchList = [
  'Check the ID number and date of birth for mistakes',
  "If the ID number on the child's documentation is incorrect, you can still submit the registration form",
];

export const yearsHeading = (age: number) => {
  return `${age} years old.`;
};

export const invalidDateMessage = 'Please enter a valid date of birth';

export const invalidDateList = [
  "Date of birth cannot be today's date or a future date",
];

export const olderMessage = (age: number) => {
  return `${age} years old - check date of birth`;
};
export const olderList = [
  'You can only add children who are 7 years old or younger.',
];
