import { ComponentBaseProps } from '@ecdlink/ui';
import { NoteTypeEnum } from '@ecdlink/graphql';

export interface RemovePractionerReasonsProps extends ComponentBaseProps {
  noteType: NoteTypeEnum;
  userId: string;
  titleText?: string;
  onSuccess: Function;
}
