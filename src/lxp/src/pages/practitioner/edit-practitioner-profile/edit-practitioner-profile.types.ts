export enum EditPractitionerSteps {
  welcomePage = 0,
  setupProgramme = 1,
  setupPrincipalPractitioners = 2,
  setupPractitioner = 3,
  setupClasses = 4,
  confirmClasses = 4,
  addPhoto = 6,
  setPlaygroupCount = 7,
}

export const isFullDayOptions = [
  { value: false, text: 'Half Day' },
  { value: true, text: 'Full Day' },
];
