import { ComponentBaseProps } from '@ecdlink/ui';
import { NoteTypeEnum } from '@ecdlink/graphql';

export interface CreateNoteProps extends ComponentBaseProps {
  noteType: NoteTypeEnum;
  userId: string;
  titleText?: string;
  onCreated?: () => void;
  onBack?: () => void;
}
