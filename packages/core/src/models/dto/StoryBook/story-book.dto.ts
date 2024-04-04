import { LanguageDto } from '../StaticData/language.dto';

export interface StoryBookDto {
  id: number;
  name: string;
  type: string;
  author: string;
  illustrator: string;
  bookLocation: string; // Markdown
  keywords: string;
  storyBookParts: StoryBookPartDto[];
  availableLanguages: LanguageDto[];
}

export interface StoryBookPartDto {
  id: number;
  name: string;
  part: string;
  partText: string; // Markdown
  storyBookPartQuestions: StoryBookQuestionDto[];
  idx?: number;
}

export interface StoryBookQuestionDto {
  id: number;
  name: string;
  question: string; // Markdown
  idx?: number;
}
