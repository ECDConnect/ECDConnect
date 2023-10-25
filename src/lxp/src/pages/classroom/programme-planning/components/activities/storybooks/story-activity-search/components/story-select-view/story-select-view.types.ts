import { StoryBookDto } from '@ecdlink/core';

export type StorySelectViewProps = {
  stories: StoryBookDto[];
  onStorySelected: (story: StoryBookDto) => void;
  selectedStoryBookId: number;
};
