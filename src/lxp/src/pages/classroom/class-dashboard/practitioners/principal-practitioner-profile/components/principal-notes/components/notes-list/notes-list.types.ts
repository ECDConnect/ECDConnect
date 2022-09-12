import { NoteDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface NotesListProps extends ComponentBaseProps {
  notes: NoteDto[];
  handleListScroll?: (scrollTop: number) => void;
  viewToNote?: (note: NoteDto) => void;
}
