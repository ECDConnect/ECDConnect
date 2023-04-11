import { ComponentBaseProps } from '@ecdlink/ui';

export interface ObservationCategoryCardProps extends ComponentBaseProps {
  categoryName: string;
  categoryColour: string;
  levelId?: number;
  childName: string;
  helpingSkillId: number;
  toDoNote: string;
  isCompetentWithCategory?: boolean;
  onEdit?: () => void;
}
