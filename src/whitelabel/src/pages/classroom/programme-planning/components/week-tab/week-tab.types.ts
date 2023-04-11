import { DailyProgrammeDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';
export interface WeekDayBreakdown {
  date: Date;
  programmeDay?: DailyProgrammeDto;
  weekDay: string;
  isCompleted?: boolean;
  completedIcon?: string;
  isHoliday?: boolean;
  isDisabled?: boolean;
}

export interface WeekTabProps extends ComponentBaseProps {
  steps: WeekDayBreakdown[];
  activeStepIndex?: number;
  onStepChanged: (index: number) => void;
}
