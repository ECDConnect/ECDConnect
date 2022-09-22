import { AddPractitionerModel } from '@/schemas/practitioner/add-practitioner';
import React from 'react';

export enum PractitionerSetupSteps {
  WELCOME = 0,
  SETUP_PROGRAMME = 1,
  CONFIRM_PRACTITIONERS = 2,
  CONFIRM_CLASSES = 3,
  ADD_PHOTO = 4,
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
  redirectedFromPractitionersList?: boolean;
};
