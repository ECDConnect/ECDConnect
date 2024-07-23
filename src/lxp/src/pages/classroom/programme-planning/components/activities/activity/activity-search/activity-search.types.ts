import { ProgrammeRoutineItemDto } from '@ecdlink/core/';
import { RecommendedActivity } from '@hooks/useProgrammePlanningRecommendations';

export type ActivitySearchProps = {
  title: string;
  subtitle: string;
  date: Date;
  programmeId?: string;
  routineItem: ProgrammeRoutineItemDto;
  recommendedActivity?: RecommendedActivity;
  submitButtonText?: string;
  preSelectedActivityId?: number;
  onSave: (activityId?: number) => void;
  onClose: () => void;
};
