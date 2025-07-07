import { EntityBase } from '../entity-base';
import { FieldTypeDto } from './field-type.dto';

export interface ContentTypeFieldDto extends EntityBase {
  dataLinkName: string;
  displayMainTable: boolean;
  displayName: string;
  displayPage: number;
  fieldName: string;
  fieldOrder: number;
  fieldType: FieldTypeDto;
  fieldTypeId: string;
  isActive: boolean;
  isRequired?: boolean;
}
