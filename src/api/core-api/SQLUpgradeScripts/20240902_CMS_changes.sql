
-- consent
update "ContentTypeField" set "DisplayName" = 'Title', "DisplayPage" = false, "IsRequired" = false where "ContentTypeId" = 14 and "FieldName" = 'name';
update "ContentTypeField" set "DisplayName" = 'Section', "DisplayPage" = false, "IsRequired" = false where "ContentTypeId" = 14 and "FieldName" = 'section';
update "ContentTypeField" set "DisplayName" = 'Description' where "ContentTypeId" = 14 and "FieldName" = 'description';
update "ContentTypeField" set "DisplayName" = 'Logo' where "ContentTypeId" = 14 and "FieldName" = 'image';
update "ContentTypeField" set "DisplayName" = 'Available Languages' where "ContentTypeId" = 14 and "FieldName" = 'availableLanguages';
update "ContentTypeField" set "DisplayName" = 'Date Updated' where "ContentTypeId" = 14 and "FieldName" = 'updatedDate';

-- More information
update "ContentTypeField" set "DisplayName" = 'Title', "FieldOrder"=2, "DisplayPage" = false, "IsRequired" = false where "ContentTypeId" = 15 and "FieldName" = 'type';
update "ContentTypeField" set "DisplayName" = 'Section',"FieldOrder"=3, "DisplayPage" = false, "IsRequired" = false where "ContentTypeId" = 15 and "FieldName" = 'section';
update "ContentTypeField" set "DisplayName" = 'Description' where "ContentTypeId" = 15 and "FieldName" = 'descriptionA';
update "ContentTypeField" set "DisplayName" = 'Available Languages' where "ContentTypeId" = 15 and "FieldName" = 'availableLanguages';
update "ContentTypeField" set "DisplayName" = 'Date Updated' where "ContentTypeId" = 15 and "FieldName" = 'updatedDate';
