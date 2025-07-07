import { ProgrammeRoutineItemDto } from '@ecdlink/core';

export type StoryActivitySearchProps = {
  subtitle: string;
  routineItem: ProgrammeRoutineItemDto;
  programmeId?: string;
  preSelectedStoryId?: number;
  preSelectedActivityId?: number;
  onSave: (storyId?: number, activityId?: number) => void;
  onClose: () => void;
};
