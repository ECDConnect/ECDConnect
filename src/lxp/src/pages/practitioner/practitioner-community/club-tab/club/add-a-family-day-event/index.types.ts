export interface Step1Props {
  meetingType: string;
  meetingNotes: string;
}

export interface Step2Props {
  participants: { practitionerId: string; attended: boolean }[];
}

export interface Step3Props {
  totalCaregiversAttended: number;
  fileType: string;
  imageBase64: string;
}

export interface AddMeetingProps {
  termConfig?: {
    term: string;
    initialMonth: string;
    lastMonth: string;
  };
  step1?: Step1Props;
  step2?: Step2Props;
  setStep1?: (step1: Step1Props) => void;
  setStep2?: (step2: Step2Props) => void;
  setStep3?: (step3: Step3Props) => void;
  setIsEnabledButton: (isEnabledButton: boolean) => void;
}
