import { ActivityDto, StoryBookDto } from '@ecdlink/core';

export type StoryActivitySelectViewProps = {
  story: StoryBookDto;
  selectedActivityId?: number;
  programmeId?: string;
  onClearStory: () => void;
  onActivitySelected: (activity?: ActivityDto) => void;
  onActivityCleared: () => void;
  setSelectedStory?: any;
  filteredActivities?: ActivityDto[];
};
