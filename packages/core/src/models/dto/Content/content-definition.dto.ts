export interface ContentDefinitionModelDto {
  contentName: string;
  identifier: string;
  fields: FieldDefinitionModelDto[];
}

export interface FieldDefinitionModelDto {
  name: string;
  dataType: string;
  fieldTypeId: number;
  graphDataTypeName: string;
  assemblyDataTypeName: string;
  displayName: string;
  displayMainTable: boolean;
  displayPage: boolean;
  isRequired?: boolean;
}
