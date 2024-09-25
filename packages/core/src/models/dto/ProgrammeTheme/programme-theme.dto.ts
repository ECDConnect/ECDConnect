import { ActivityDto } from '../Activity/activity.dto';
import { StoryBookDto } from '../StoryBook/story-book.dto';

export interface ProgrammeThemeDto {
  id: number;
  name: string;
  color: string;
  imageUrl: string;
  themeLogo: string;
  themeDays: ProgrammeThemeDayDto[];
}

export interface ProgrammeThemeDayDto {
  id: number;
  name: string;
  day: string;
  largeGroupActivity: ActivityDto[];
  smallGroupActivity: ActivityDto[];
  storyActivity: ActivityDto[];
  storyBook: StoryBookDto[];
}
