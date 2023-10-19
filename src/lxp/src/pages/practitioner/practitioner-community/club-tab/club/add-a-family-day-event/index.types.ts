export interface Step1Props {
  hasMeetingHappened: boolean;
  date: string;
}

// TODO: update types
export interface AddMeetingProps {
  step1?: Step1Props;
  step2?: unknown;
  setStep1?: (step1: Step1Props) => void;
  setStep2?: (step2: unknown) => void;
  setStep3?: (step3: unknown) => void;
  setIsEnabledButton: (isEnabledButton: boolean) => void;
}
