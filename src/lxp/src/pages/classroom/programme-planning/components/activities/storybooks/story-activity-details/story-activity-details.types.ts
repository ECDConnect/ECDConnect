export type StoryActivityDetailsProps = {
  selected: boolean;
  viewType: 'StoryBook' | 'StoryActivity';
  storyBookId?: number;
  disabled?: boolean;
  activityId?: number;
  onActivitySelected?: () => void;
  onActivitySwitched?: () => void;
  onStoryBookSelected?: () => void;
  onStoryBookSwitched?: () => void;
  onBack: () => void;
};
