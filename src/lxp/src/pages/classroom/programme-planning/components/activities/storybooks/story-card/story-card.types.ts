import { LanguageDto } from '@ecdlink/core/';
import { ComponentBaseProps } from '@ecdlink/ui/';

export interface StoryCardProps extends ComponentBaseProps {
  storyBookId: number;
  activityId?: number;
  title: string;
  type: string;
  languages: LanguageDto[];
  selected: boolean;
  buttonText?: string;
  buttonIcon?: string;
  hideDetails?: boolean;
  radioEnabled?: boolean;
  onSelected: () => void;
  onCleared: () => void;
  onActivityCleared?: () => void;
}
