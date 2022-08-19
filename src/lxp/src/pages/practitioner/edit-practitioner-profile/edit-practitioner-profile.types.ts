export enum EditPractitionerSteps {
  welcomePage = 0,
  setupProgramme = 1,
  setConfirmPractitioners = 2,
  setupClasses = 3,
  confirmClasses = 4,
  addPhoto = 5,
  setPlaygroupCount = 6,
}

export const isFullDayOptions = [
  { value: false, text: 'Half Day' },
  { value: true, text: 'Full Day' },
];
