import { AddPractitionerModel } from '@/schemas/practitioner/add-practitioner';
import React from 'react';

export enum PractitionerSetupSteps {
  WELCOME = 0,
  SELECT_PRACTITIONER_ROLE = 1,
  SETUP_PROGRAMME = 2,
  CONFIRM_PRACTITIONERS = 3,
  CONFIRM_CLASSES = 4,
  ADD_SIGNATURE = 5,
  ADD_PHOTO = 6,
  OA_CONFIRM_CLASSES = 3,
}

export enum ConfirmPractitionersSteps {
  CONFIRM_PRACTITIONERS = 1,
  ADD_PRACTITIONER = 2,
  EDIT_PRACTITIONER = 3,
}

export enum ConfirmClassesSteps {
  CONFIRM_CLASSES = 1,
  ADD_CLASS = 2,
  EDIT_CLASS = 3,
}

export type OnNext = React.Dispatch<
  React.SetStateAction<PractitionerSetupSteps>
>;

export type RegisterPractitioner = AddPractitionerModel & {
  isRegistered?: boolean;
};
