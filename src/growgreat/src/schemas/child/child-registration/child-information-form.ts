import { ProgrammeAttendanceReasonDto } from '@ecdlink/core';
import { SA_ID_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface ChildInformationFormModel {
  firstname: string;
  surname: string;
  reason?: ProgrammeAttendanceReasonDto;
  otherReason: string;
  playgroupId: string;
  childIdField?: string;
  dobDay: number;
  dobMonth: number;
  dobYear: number;
  dob?: Date;
  dobValid?: boolean;
}

export const childInformationFormSchema = Yup.object().shape({
  firstname: Yup.string().required(),
  surname: Yup.string().required(),
  playgroupId: Yup.string().required(),
  otherReason: Yup.string(),
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
  otherReason: Yup.string(),
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

export const dobYearsLess = 3;
export const dobYearsBetweenLower = 5;
export const dobYearsBetweenHigher = 10;

export const idMismatchMessage = 'ID number and date of birth do not match.';
export const idMismatchList = [
  'Check the ID number and date of birth for mistakes',
  "If the ID number on the child's documentation is incorrect, you can still submit the registration form",
];

export const yearsHeading = (age: number) => {
  return `${age} years old.`;
};
export const yearsMessage = 'Please check date of birth.';
export const yearsLessList = [
  'Note that SmartStart programmes are designed for 3-5 year olds.',
  'Children 0-18 months should have their own class and teacher and adhere to DSD guidelines on ratios.',
];
export const yearsBetweenList = [
  `Note that SmartStart programmes are designed for ${dobYearsLess}-${dobYearsBetweenLower} year olds.`,
];

export const invalidDateMessage = 'Please enter a valid date of birth';

export const invalidDateList = [
  "Date of birth cannot be today's date or a future date",
];

export const olderMessage = 'Child is older than 10';

export const olderList = [
  `Note that SmartStart programmes are designed for ${dobYearsLess}-${dobYearsBetweenLower} year olds.`,
];
