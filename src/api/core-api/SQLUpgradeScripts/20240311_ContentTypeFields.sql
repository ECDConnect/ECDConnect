-- consent
INSERT INTO public."ContentTypeField"
("Id", "FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 7, 'updatedDate', 1, true, '', 14, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null, 'GT - Date Updated', true, false, false);

INSERT INTO public."ContentTypeField"
("Id", "FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 6, 'availableLanguages', 5, true, 'Language', 14, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null, 'GT - Available Languages', true, false, false);

-- more info 
INSERT INTO public."ContentTypeField"
("Id", "FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 30, 'updatedDate', 1, true, '', 15, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null, 'GT - Date Updated', true, false, false);
