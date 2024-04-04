import { SmartSpaceVisitData } from '@/store/trainee/trainee.types';

export enum SmartSpaceChecklisstStepsSteps {
  INITIAL = 1,
  PROGRAMME_DETAILS = 2,
  HEALTH_SANITATION_SAFETY = 3,
  SAFETY_STRUCTURE_AREA = 4,
  SPACE_EMERGENCY_PLANNING = 5,
}

export interface SmartSpaceChecklistProps {
  visitId: string;
  setActiveStep: (value: SmartSpaceChecklisstStepsSteps) => void;
  handleNextSection: () => void;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
