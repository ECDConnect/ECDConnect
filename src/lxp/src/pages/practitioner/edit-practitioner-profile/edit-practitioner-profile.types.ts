export enum EditPractitionerSteps {
  WELCOME = 0,
  SET_PRACTITIONER_DETAILS = 1,
  SETUP_PRACTITIONER = 2,
  ADD_SIGNATURE = 3,
  ADD_PHOTO = 4,
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
