import { Step } from 'react-joyride';

export interface AppState {
  run: boolean;
  stepIndex: number;
  steps: Step[];
  tourActive: boolean;
  attendanceStatus: boolean;
  enableButton: boolean;
  isSmallScreen?: boolean;
}
