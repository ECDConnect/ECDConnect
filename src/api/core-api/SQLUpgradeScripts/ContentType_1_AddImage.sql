perform (select SETVAL('public."ContentTypeField_Id_seq"', COALESCE(MAX("Id"), 0)) FROM public."ContentTypeField");

insert into "ContentTypeField" ("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
values (4, 'image', (select "Id" from "ContentFieldType" where "Name" = 'Image'), true, 'Consent Image', (select "Id" from "ContentType" where "Name" = 'Consent'), now(), now(), 'System', null);
