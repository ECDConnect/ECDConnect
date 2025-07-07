import { ContentTypeFieldDto } from './content-type-field.dto';

export interface ContentValueDto {
  localeId: string;
  contentTypeField: ContentTypeFieldDto;
  contentTypeFieldId: string;
  value: string;
  statusId?: string;
}
