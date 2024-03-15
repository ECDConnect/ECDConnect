-- Natal
INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(29, 'Natal', 'Natal', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', true, -1);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 1, 'title', 1, true, '', 29, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Title', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 2, 'section', 1, true, '', 29, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Section', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 3, 'type', 4, true, 'NatalType', 29, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Type', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 4, 'info', 4, true, 'NatalInfo', 29, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Info', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 5, 'video', 4, true, 'NatalVideo', 29, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Video', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 6, 'graphic', 4, true, 'NatalGraphic', 29, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Infographic', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 7, 'health', 4, true, 'NatalHealth', 29, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Health promotion', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 8, 'availableLanguages', 5, true, 'Language', 29, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Languages', true, false, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 9, 'updatedDate', 1, true, '', 29, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Last updated', true, false, false);


-- NatalInfo
INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(30, 'NatalInfo', 'NatalInfo', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', false, -1);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 1, 'title', 1, true, '', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Title', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 2, 'section', 1, true, '', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Section', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 3, 'type', 4, true, 'NatalType', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Type', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 4, 'pollyTipText', 1, true, '', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Title', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 5, 'pollyTipContent', 1, true, '', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Content', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 6, 'contentSectionA', 2, true, '', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Content section', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 7, 'lightBuldSectionA', 2, true, '', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Lightbulb section', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 8, 'contentSectionB', 2, true, '', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Content section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 9, 'lightBuldSectionB', 2, true, '', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Lightbulb section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 10, 'contentSectionC', 2, true, '', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Content section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 11, 'lightBuldSectionC', 2, true, '', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Lightbulb section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 12, 'availableLanguages', 5, true, 'Language', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Languages', true, false, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 13, 'updatedDate', 1, true, '', 30, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Last updated', true, false, false);

-- NatalVideo 
INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(31, 'NatalVideo', 'NatalVideo', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', false, -1);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 1, 'title', 1, true, '', 31, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Title', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 2, 'section', 1, true, '', 31, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Section', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 3, 'type', 4, true, 'NatalType', 31, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Type', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 4, 'video', 7, true, '', 31, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Video', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 5, 'availableLanguages', 5, true, 'Language', 31, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Languages', true, false, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 6, 'updatedDate', 1, true, '', 31, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Last updated', true, false, false);

-- NatalGraphic
INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(32, 'NatalGraphic', 'NatalGraphic', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', false, -1);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 1, 'title', 1, true, '', 32, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Title', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 2, 'section', 1, true, '', 32, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Section', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 3, 'type', 4, true, 'NatalType', 32, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Type', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 4, 'image', 3, true, '', 32, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Image', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 5, 'availableLanguages', 5, true, 'Language', 32, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Languages', true, false, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 6, 'updatedDate', 1, true, '', 32, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Last updated', true, false, false);

-- NatalHealth
INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(33, 'NatalHealth', 'NatalHealth', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', false, -1);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 1, 'title', 1, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Title', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 2, 'section', 1, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Section', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 3, 'type', 4, true, 'NatalType', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Type', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 4, 'discussionA', 2, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Discussion Section', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 5, 'discussionB', 2, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Discussion Section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 6, 'discussionC', 2, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Discussion Section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 7, 'discussionD', 2, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Discussion Section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 8, 'discussionE', 2, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Discussion Section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 9, 'discussionF', 2, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Discussion Section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 10, 'discussionG', 2, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Discussion Section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 11, 'discussionH', 2, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Discussion Section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 12, 'discussionI', 2, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Discussion Section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 13, 'discussionJ', 2, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Discussion Section', false, true, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 14, 'availableLanguages', 5, true, 'Language', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Languages', true, false, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 15, 'updatedDate', 1, true, '', 33, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Last updated', true, false, false);


-- NatalType (PostNatal or Antenatal)
INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(34, 'NatalType', 'NatalType', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', false, -1);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 1, 'name', 1, true, '', 34, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Name', true, true, true);

/* NEED TO ADD THIS MANUALLY
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 34, true, current_timestamp, current_timestamp, '', '39077d0e-e443-4076-aaf2-978dc6805aa0', true);
INSERT INTO public."ContentValue"
("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "Id", "InsertedDate", "UpdatedDate")
VALUES(1805, '9688cd08-adef-408c-9d34-5d75ae5c44df', 453, 'Postnatal', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', nextval('public."ContentValue_Id_seq"'), now(), current_timestamp);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 34, true, current_timestamp, current_timestamp, '', '39077d0e-e443-4076-aaf2-978dc6805aa0', true);
INSERT INTO public."ContentValue"
("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "Id", "InsertedDate", "UpdatedDate")
VALUES(1806, '9688cd08-adef-408c-9d34-5d75ae5c44df', 453, 'Antenatal', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', nextval('public."ContentValue_Id_seq"'), now(), current_timestamp);
*/

-- Danger signs
INSERT INTO public."ContentType"
("Id", "Name", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(35, 'DangerSign', 'DangerSign', true, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', true, -1);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 1, 'section', 1, true, '', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Section', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 2, 'dangerSignA', 2, true, '', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Translation for: ', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 3, 'dangerSignB', 2, true, '', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Translation for: ', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 4, 'dangerSignC', 2, true, '', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Translation for: ', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 5, 'dangerSignD', 2, true, '', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Translation for: ', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 6, 'dangerSignE', 2, true, '', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Translation for: ', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 7, 'dangerSignF', 2, true, '', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Translation for: ', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 8, 'dangerSignG', 2, true, '', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Translation for: ', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 9, 'dangerSignH', 2, true, '', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Translation for: ', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 10, 'dangerSignI', 2, true, '', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Translation for: ', false, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 11, 'availableLanguages', 5, true, 'Language', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Languages', true, false, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName","DisplayMainTable","DisplayPage","IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 12, 'updatedDate', 1, true, '', 35, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, '39077d0e-e443-4076-aaf2-978dc6805aa0', 'Last updated', true, false, false);


