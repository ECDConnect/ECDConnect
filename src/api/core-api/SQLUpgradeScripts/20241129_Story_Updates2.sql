
INSERT INTO "ContentTypeField" ("Id", "FieldOrder","FieldName","FieldTypeId","IsActive","DataLinkName","ContentTypeId","InsertedDate","UpdatedDate","UpdatedBy","TenantId","DisplayName","DisplayMainTable","DisplayPage","IsRequired") VALUES
	 (nextval('public."ContentTypeField_Id_seq"'), 13,'bookLocationLink',1,true,'',10,current_date,current_date,NULL,NULL,'Link',false,true,false);

update "ContentTypeField" set "DisplayName" = 'Text', "FieldTypeId"=1 where "ContentTypeId" = 10 and "FieldName" = 'bookLocation';
update "ContentTypeField" set "FieldOrder" = 7 where  "ContentTypeId" = 10 and "FieldName" = 'bookLocationLink';
update "ContentTypeField" set "FieldOrder" = 8 where  "ContentTypeId" = 10 and "FieldName" = 'keywords';
update "ContentTypeField" set "FieldOrder" = 9 where  "ContentTypeId" = 10 and "FieldName" = 'storyBookParts';
update "ContentTypeField" set "FieldOrder" = 10 where  "ContentTypeId" = 10 and "FieldName" = 'shareContent';
update "ContentTypeField" set "FieldOrder" = 11 where  "ContentTypeId" = 10 and "FieldName" = 'themes';
update "ContentTypeField" set "FieldOrder" = 12 where  "ContentTypeId" = 10 and "FieldName" = 'availableLanguages';
update "ContentTypeField" set "FieldOrder" = 13 where  "ContentTypeId" = 10 and "FieldName" = 'updatedDate';








