import { LanguageDto } from '../StaticData/language.dto';
export interface ConsentDto {
  id: number;
  name: string;
  type: string;
  description: string;
  availableLanguages: LanguageDto[];
}
