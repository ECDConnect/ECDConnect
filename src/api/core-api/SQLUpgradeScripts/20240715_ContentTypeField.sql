update "ContentTypeField" set "DisplayName" = 'Activity title' where "ContentTypeId" =13 and "DisplayName" ='GT - Activity Title';
update "ContentTypeField" set "DisplayName" = 'Type' where "ContentTypeId" =13 and "DisplayName" ='GT - Activity Type *';
update "ContentTypeField" set "DisplayName" = 'Story types' where "ContentTypeId" =13 and "DisplayName" ='GT - For Story Types';
update "ContentTypeField" set "DisplayName" = 'Instructions (What do I do?)' where "ContentTypeId" =13 and "DisplayName" ='GT - Instructions (What do I do?)';
update "ContentTypeField" set "DisplayName" = 'Image' where "ContentTypeId" =13 and "DisplayName" ='GT - Image';
update "ContentTypeField" set "DisplayName" = 'Tips (optional)' where "ContentTypeId" =13 and "DisplayName" ='GT - Tips (optional)';
update "ContentTypeField" set "DisplayName" = 'Skills' where "ContentTypeId" =13 and "DisplayName" ='GT - Skills';
update "ContentTypeField" set "DisplayName" = 'Materials (What do I need?)' where "ContentTypeId" =13 and "DisplayName" ='GT - Materials (What do I need?)';
update "ContentTypeField" set "DisplayName" = 'Available Languages' where "ContentTypeId" =13 and "DisplayName" ='GT - Available Languages';

update "ContentTypeField" set "FieldOrder" = '4' where "ContentTypeId" =13 and "FieldName" ='themes';
update "ContentTypeField" set "FieldOrder" = '6' where "ContentTypeId" =13 and "FieldName" ='availableLanguages';
update "ContentTypeField" set "FieldOrder" = '9' where "ContentTypeId" =13 and "FieldName" ='subCategories';

update "ContentTypeField" set "IsRequired" = "false" where "ContentTypeId" =8 and "FieldName" ='themeDays';
