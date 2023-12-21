insert into "ContentFieldType" ("Id", "Name", "Description", "DataType", "AssemblyDataType", "GraphQLDataType", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId") 
values (8, 'DatePicker', 'A control to pick a date', 'date-picker', 'System.DateTime', 'DateTime', '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', '', '258a15e6-3736-45ea-875c-48d9377de4c8')


update "ContentTypeField" set "FieldTypeId" = 8 where "ContentTypeId" = 26 and "FieldName" = 'startDate'
update "ContentTypeField" set "FieldTypeId" = 8 where "ContentTypeId" = 26 and "FieldName" = 'endDate'