import { ProgrammeThemeDto } from '../ProgrammeTheme';
import { ProgressTrackingSubCategoryDto } from '../ProgressTracking/progress-tracking-sub-category.dto';
import { LanguageDto } from '../StaticData/language.dto';

export interface ActivityDto {
  id: number;
  name: string;
  type: string;
  subType: string;
  image: string;
  description: string; // MARKDOWN
  materials: string;
  notes: string; // MARKDOWN
  subCategories: ProgressTrackingSubCategoryDto[];
  availableLanguages: LanguageDto[];
  themes: ProgrammeThemeDto[];
}
