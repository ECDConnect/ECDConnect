update "ContentTypeField" set "DisplayName" = 'Story type' where "ContentTypeId" = 10 and "FieldName" = 'type';

INSERT INTO "ContentTypeField" ("FieldOrder","FieldName","FieldTypeId","IsActive","DataLinkName","ContentTypeId","InsertedDate","UpdatedDate","UpdatedBy","TenantId","DisplayName","DisplayMainTable","DisplayPage","IsRequired") VALUES
	 (12,'translator',1,true,'',10,current_date,current_date,NULL,NULL,'Translator',false,true,false);

update "ContentTypeField" set "FieldOrder" = 5 where "ContentTypeId" = 10 and "FieldName" = 'translator';
update "ContentTypeField" set "FieldOrder" = 6 where "ContentTypeId" = 10 and "FieldName" = 'bookLocation';
update "ContentTypeField" set "FieldOrder" = 7, "IsRequired" = true where "ContentTypeId" = 10 and "FieldName" = 'keywords';
update "ContentTypeField" set "FieldOrder" = 8 where "ContentTypeId" = 10 and "FieldName" = 'storyBookParts';
update "ContentTypeField" set "FieldOrder" = 9 where "ContentTypeId" = 10 and "FieldName" = 'availableLanguages';
update "ContentTypeField" set "FieldOrder" = 10 where "ContentTypeId" = 10 and "FieldName" = 'shareContent';
update "ContentTypeField" set "FieldOrder" = 11 where "ContentTypeId" = 10 and "FieldName" = 'updatedDate';
update "ContentTypeField" set "FieldOrder" = 12 where "ContentTypeId" = 10 and "FieldName" = 'themes';

