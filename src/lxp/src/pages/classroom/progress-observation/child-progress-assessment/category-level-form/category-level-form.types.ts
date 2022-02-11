import { ComponentBaseProps } from '@ecdlink/ui';
import { ProgressTrackingLevels } from '../../../../../enums/ProgressTrackingLevels';
import { CategoryLevelFormResult } from '../../../../../models/classroom/progress-observation/ChildProgressAssessment';

export interface CategoryLevelFormProps extends ComponentBaseProps {
  progressTrackingCategoryId: number;
  levelId: ProgressTrackingLevels;
  childId: string;
  optionSelected?: () => void;
  onSubmit: (result: CategoryLevelFormResult) => void;
}
