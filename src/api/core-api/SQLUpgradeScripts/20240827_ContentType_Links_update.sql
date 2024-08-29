INSERT INTO "ContentType" ("Id","Name","Description","MetaData","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","IsVisiblePortal","PortalDisplayOrder") VALUES
	 (38,'ResourceLink','Resource Link',NULL,true,'0001-01-01 00:00:00.000','0001-01-01 00:00:00.000',NULL,NULL,true,-1);

INSERT INTO "ContentTypeField" ("Id","FieldOrder","FieldName","FieldTypeId","IsActive","DataLinkName","ContentTypeId","InsertedDate","UpdatedDate","UpdatedBy","TenantId","DisplayName","DisplayMainTable","DisplayPage","IsRequired") VALUES
(597,1,'title',1,true,'',38,'0001-01-01 00:00:00.000','0001-01-01 00:00:00.000',NULL,NULL,'Title',false,true,false),
(598,2,'link',1,true,'',38,'0001-01-01 00:00:00.000','0001-01-01 00:00:00.000',NULL,NULL,'Link',false,true,false),
(599,3,'description',1,true,'',38,'0001-01-01 00:00:00.000','0001-01-01 00:00:00.000',NULL,NULL,'Description',false,true,false);



-- There are 5 resource links
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 38, true, current_date, current_date, '', '258a15e6-3736-45ea-875c-48d9377de4c8', false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 38, true, current_date, current_date, '', '258a15e6-3736-45ea-875c-48d9377de4c8', false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 38, true, current_date, current_date, '', '258a15e6-3736-45ea-875c-48d9377de4c8', false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 38, true, current_date, current_date, '', '258a15e6-3736-45ea-875c-48d9377de4c8', false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 38, true, current_date, current_date, '', '258a15e6-3736-45ea-875c-48d9377de4c8', false);

INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 38, true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 38, true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 38, true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 38, true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 38, true, current_date, current_date,  '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', false);


INSERT INTO public."ContentValue" 
("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "Id", "InsertedDate", "UpdatedDate")
select "Id", '9688cd08-adef-408c-9d34-5d75ae5c44df', 597, '', null, "TenantId" , nextval('public."ContentValue_Id_seq"'), current_date, current_date from "Content" c where "ContentTypeId" =38;
INSERT INTO public."ContentValue"
("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "Id", "InsertedDate", "UpdatedDate")
select "Id", '9688cd08-adef-408c-9d34-5d75ae5c44df', 598, '', null, "TenantId", nextval('public."ContentValue_Id_seq"'), current_date, current_date from "Content" c where "ContentTypeId" =38;
INSERT INTO public."ContentValue"
("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "Id", "InsertedDate", "UpdatedDate")
select "Id", '9688cd08-adef-408c-9d34-5d75ae5c44df', 599, '', null, "TenantId", nextval('public."ContentValue_Id_seq"'), current_date, current_date from "Content" c where "ContentTypeId" =38;
