import { DailyProgrammeDto, ProgrammeRoutineItemDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ProgrammePlanningRoutineListItemProps
  extends ComponentBaseProps {
  day?: DailyProgrammeDto;
  routineItem: ProgrammeRoutineItemDto;
  selectedDate?: Date;
  storyBookId?: number;
  onClick: () => void;
  disabled?: boolean;
}
