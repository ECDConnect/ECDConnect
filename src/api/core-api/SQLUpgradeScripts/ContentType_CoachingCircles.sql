INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(26, 'CoachingCircleTopics', 'Coaching circle topics', false, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '258a15e6-3736-45ea-875c-48d9377de4c8', true, 5);

INSERT INTO public."ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(1, 'title', 1, false, '', 26, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(2, 'startDate', 1, false, '', 26, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(3, 'endDate', 1, false, '', 26, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(4, 'topicContent', 2, false, '', 26, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES(5, 'resource', 3, false, '', 26, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '258a15e6-3736-45ea-875c-48d9377de4c8');
