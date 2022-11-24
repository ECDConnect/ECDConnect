export enum EditPractitionerSteps {
  WELCOME = 0,
  SETUP_PRACTITIONER = 1,
  ADD_PHOTO = 2,
}

export enum SetupPractitionersPage {
  confirmPractitioners = 1,
  addPractitioners = 2,
  editPractitioners = 3,
}

export type PractitionerFormData = {
  practitionerToProgramme: boolean;
  allowPermissions: boolean;
};
export const isFullDayOptions = [
  { value: false, text: 'Half Day' },
  { value: true, text: 'Full Day' },
];

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
