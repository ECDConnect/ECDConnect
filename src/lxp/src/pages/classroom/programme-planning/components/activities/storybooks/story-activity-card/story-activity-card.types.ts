import { ComponentBaseProps } from '@ecdlink/ui';

export interface StoryActivityCardProps extends ComponentBaseProps {
  activityId: number;
  storyBookId?: number;
  title: string;
  material: string;
  selected: boolean;
  warningText?: string;
  buttonText?: string;
  buttonIcon?: string;
  hideDetails?: boolean;
  hideRadio?: boolean;
  onSelected: () => void;
  onCleared: () => void;
  onStoryCleared?: () => void;
}
