import { EntityStaticBase } from '../entity-static-base';

export interface DocumentTypeDto extends EntityStaticBase {
  name: string;
  description: string;
}
