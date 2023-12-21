

--select max("Id") from public."ContentTypeField"

-- Connect
INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(27, 'Connect', 'Connect ', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null, true, -1);
INSERT INTO public."ContentTypeField"
("Id", "FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(384, 1, 'name', 1, true, 1, 27, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null);

-- ConnectItem
INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(28, 'ConnectItem', 'Connect Item', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null, true, -1);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(385, 1, 'buttonText', 1, true, '', 28, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(386, 2, 'link', 1, true, '', 28, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(387, 3, 'linkedConnect', 4, true, 'Connect', 28, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null);


update public."ContentType" set "IsActive" = false where "Id" in (21,22,23,24);