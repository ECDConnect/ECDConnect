import { EntityBase } from '../entity-base';

export interface LanguageDto extends EntityBase {
  locale: string;
  description: string;
}
