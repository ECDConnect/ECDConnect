import { EntityBase } from '../entity-base';
import { ContentTypeFieldDto } from './content-type-field.dto';
import { ContentDto } from './content.dto';

export interface ContentTypeDto extends EntityBase {
  name: string;
  description: string;
  fields?: ContentTypeFieldDto[];
  content?: ContentDto[];
}
