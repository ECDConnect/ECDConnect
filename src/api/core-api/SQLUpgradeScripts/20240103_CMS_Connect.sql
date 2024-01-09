INSERT INTO public."ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayMainTable", "DisplayPage", "DisplayName")
VALUES(2, 'type', 1, true, '', 27, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null, true, true, 'Type');
INSERT INTO public."ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayMainTable", "DisplayPage", "DisplayName")
VALUES(3, 'hint', 1, true, '', 27, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null, true, true, 'Hint');


update "ContentType" set "IsVisiblePortal" = true where "Id" in (27,28)
update "ContentTypeField" set "DisplayMainTable" = true, "DisplayPage" = true where "ContentTypeId" in (27,28)