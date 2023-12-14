
-- Connect
INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(27, 'Connect', 'Connect ', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null, true, -1);
INSERT INTO public."ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(1, 'name', 1, true, 1, 27, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null);

-- ConnectItem
INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(28, 'ConnectItem', 'Connect ', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null, true, -1);

INSERT INTO public."ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(1, 'buttonText', 1, true, '', 28, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null);
INSERT INTO public."ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(2, 'link', 1, true, '', 28, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null);
INSERT INTO public."ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(3, 'linkedConnect', 4, true, 'Connect', 28, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null);
