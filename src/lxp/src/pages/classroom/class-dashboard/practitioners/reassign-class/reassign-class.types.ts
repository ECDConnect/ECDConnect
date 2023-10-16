export interface ReassignClassPageState {
  practitionerId: number;
  childId: string;
  reportingDate?: string | any;
}

export const yesNoOptions = [
  { text: '1 day', value: true },
  { text: 'More than 1 day', value: false },
];
