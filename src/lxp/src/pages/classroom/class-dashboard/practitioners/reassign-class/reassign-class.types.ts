export interface ReassignClassPageState {
  practitionerId: number;
  childId: string;
  reportingDate?: string | any;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
