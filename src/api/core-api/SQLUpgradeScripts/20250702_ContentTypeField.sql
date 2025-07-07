INSERT INTO public."ContentTypeField"
("Id", "FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 8, 'defaultName', 1, true, '', 8, current_date, current_date, '', NULL, '', false, false, false);

-- todo: Manually adding the above field to themes to all current tenants