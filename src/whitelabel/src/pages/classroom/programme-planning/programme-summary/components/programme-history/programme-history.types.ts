import { ComponentBaseProps } from '@ecdlink/ui';
import { ProgrammeDto } from '@ecdlink/core';
export interface ProgrammeHistoryProps extends ComponentBaseProps {
  date?: Date;
  onViewItem: (programme: ProgrammeDto) => void;
}
