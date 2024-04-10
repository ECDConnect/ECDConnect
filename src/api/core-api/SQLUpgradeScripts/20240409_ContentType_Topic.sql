INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(36, 'Topic', 'Topic', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', true, -1);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 1, 'title', 1, true, '', 36, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Title', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 2, 'topicTitle', 1, true, '', 36, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Knowledge sharing topic title', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 3, 'topicContent', 2, true, '', 36, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Knowledge sharing topic content', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 4, 'infoGraphic', 3, true, '', 36, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Add an infographic', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 5, 'knowledgeContent', 2, true, '', 36, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Check knowledge content', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 6, 'selfCareContent', 2, true, '', 36, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Self care tips content', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 7, 'availableLanguages', 5, true, 'Language', 36, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Languages', false, false, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 8, 'updatedDate', 1, true, '', 36, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Last updated', true, false, false);