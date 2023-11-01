import { EntityBase } from '../entity-base';
import { FieldTypeDto } from './field-type.dto';

export interface ContentTypeFieldDto extends EntityBase {
  fieldOrder: number;
  fieldName: string;
  fieldTypeId: string;
  fieldType: FieldTypeDto;
  isActive: boolean;
  dataLinkName: string;
  displayMainTable: boolean;
}
