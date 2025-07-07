import { NoteDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ViewNoteProps extends ComponentBaseProps {
  note: NoteDto;
  onDelete?: (deletedNote: NoteDto) => void;
  onBack?: () => void;
}
