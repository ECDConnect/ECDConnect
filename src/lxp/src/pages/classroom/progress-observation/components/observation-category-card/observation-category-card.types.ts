import { ComponentBaseProps } from '@ecdlink/ui';

export interface ObservationCategoryCardProps extends ComponentBaseProps {
  categoryImageUrl: string;
  categoryName: string;
  categoryColour: string;
  levelId?: number;
  childName: string;
  helpingSkillId: number;
  toDoNote: string;
  isCompetentWithCategory?: boolean;
  onEdit?: () => void;
}
