import { EntityStaticBase } from '../entity-static-base';

export interface NoteTypeDto extends EntityStaticBase {
  name: string;
  normalizedName: string;
  description: string;
}
