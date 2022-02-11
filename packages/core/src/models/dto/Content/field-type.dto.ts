import { EntityBase } from '../entity-base';

export interface FieldTypeDto extends EntityBase {
  name: string;
  description: string;
  dataType: string;
  assemblyDataType: string;
  graphQLDataType: string;
}
