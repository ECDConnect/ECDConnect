import { ProgrammeRoutineItemDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface MessageBoardProps extends ComponentBaseProps {
  message?: string;
  date?: Date;
  routineItem?: ProgrammeRoutineItemDto;
  disabled?: boolean;
  onClose: () => void;
  onSave: (message: string) => void;
}
