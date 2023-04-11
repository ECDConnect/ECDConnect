import { ProgrammeRoutineItemDto } from '@ecdlink/core';

export type StoryActivitySearchProps = {
  title: string;
  subtitle: string;
  routineItem: ProgrammeRoutineItemDto;
  programmeId?: string;
  preSelectedStoryId?: number;
  preSelectedActivityId?: number;
  submitButtonText?: string;
  onSave: (storyId?: number, activityId?: number) => void;
  onClose: () => void;
};
