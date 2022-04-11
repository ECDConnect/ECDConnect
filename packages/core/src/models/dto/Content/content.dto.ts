import { EntityBase } from '../entity-base';
import { ContentTypeDto } from './content-type.dto';
import { ContentValueDto } from './content-value.dto';

export interface ContentDto extends EntityBase {
  contentType: ContentTypeDto;
  contentTypeId: string;
  contentValues: ContentValueDto[];
  isActive: boolean;
}
