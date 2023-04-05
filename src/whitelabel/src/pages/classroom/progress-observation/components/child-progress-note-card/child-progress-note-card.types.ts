import { ComponentBaseProps } from '@ecdlink/ui';

export interface ChildProgressNoteCardProps extends ComponentBaseProps {
  note: string;
  onEdit: () => void;
}
