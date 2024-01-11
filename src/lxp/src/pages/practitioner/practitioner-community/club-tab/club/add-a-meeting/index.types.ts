export interface Step1Props {
  hasMeetingHappened: boolean;
  date: string;
}

export interface Step2Props {
  participants: { practitionerId: string; attended: boolean }[];
}

export interface Step3Props {
  coachAttend: boolean;
  meetingNotes?: string;
  createdResource: boolean;
}

export interface AddMeetingProps {
  step1?: Step1Props;
  step2?: unknown;
  setStep1?: (step1: Step1Props) => void;
  setStep2?: (step2: Step2Props) => void;
  setStep3?: (step3: Step3Props) => void;
  setIsEnabledButton: (isEnabledButton: boolean) => void;
}

export interface AddMeetingRouteState {
  eventId?: string;
}
