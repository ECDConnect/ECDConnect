delete from "ContentValue" cv where cv."ContentId" in (select "Id" from "Content" c where "ContentTypeId" in (27,28));
delete from "Content" where "ContentTypeId" in (27,28);


update "ContentType" set "IsActive" = false where "Id" = 27;
update "ContentTypeField" set "DisplayName" = 'Link',  "FieldOrder"=2, "DisplayMainTable"=false where "ContentTypeId" = 28 and "FieldName" = 'link';
update "ContentTypeField" set "FieldName" = 'description', "FieldOrder"=3, "DisplayMainTable"=false where "ContentTypeId" = 28 and "DisplayName" = 'description';
update "ContentTypeField" set "FieldName" = 'title', "FieldTypeId"=1, "FieldOrder"=1, "DataLinkName"=null, "DisplayMainTable"=false where "ContentTypeId" = 28 and "DisplayName" = 'type';

-- There are 5 resource links
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 28, true, current_date, current_date, '', null, false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 28, true, current_date, current_date, '', null, false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 28, true, current_date, current_date, '', null, false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 28, true, current_date, current_date, '', null, false);
INSERT INTO public."Content"
("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(nextval('public."Content_Id_seq"'), 28, true, current_date, current_date, '', null, false);

-- Add values for 5 resource links for each tenant
INSERT INTO public."ContentValue"
("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "Id", "InsertedDate", "UpdatedDate")
select c."Id", '9688cd08-adef-408c-9d34-5d75ae5c44df', 389, '', null, '258a15e6-3736-45ea-875c-48d9377de4c8', nextval('public."ContentValue_Id_seq"'), current_date, current_date from "Content" c where "ContentTypeId" =28;
INSERT INTO public."ContentValue"
("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "Id", "InsertedDate", "UpdatedDate")
select c."Id", '9688cd08-adef-408c-9d34-5d75ae5c44df', 388, '', null, '258a15e6-3736-45ea-875c-48d9377de4c8', nextval('public."ContentValue_Id_seq"'), current_date, current_date from "Content" c where "ContentTypeId" =28;
INSERT INTO public."ContentValue"
("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "Id", "InsertedDate", "UpdatedDate")
select c."Id", '9688cd08-adef-408c-9d34-5d75ae5c44df', 387, '', null, '258a15e6-3736-45ea-875c-48d9377de4c8', nextval('public."ContentValue_Id_seq"'), current_date, current_date from "Content" c where "ContentTypeId" =28;

INSERT INTO public."ContentValue"
("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "Id", "InsertedDate", "UpdatedDate")
select c."Id", '9688cd08-adef-408c-9d34-5d75ae5c44df', 389, '', null, 'e8f571eb-1972-4e71-a20f-347c65d059bb', nextval('public."ContentValue_Id_seq"'), current_date, current_date from "Content" c where "ContentTypeId" =28;
INSERT INTO public."ContentValue"
("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "Id", "InsertedDate", "UpdatedDate")
select c."Id", '9688cd08-adef-408c-9d34-5d75ae5c44df', 388, '', null, 'e8f571eb-1972-4e71-a20f-347c65d059bb', nextval('public."ContentValue_Id_seq"'), current_date, current_date from "Content" c where "ContentTypeId" =28;
INSERT INTO public."ContentValue"
("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "Id", "InsertedDate", "UpdatedDate")
select c."Id", '9688cd08-adef-408c-9d34-5d75ae5c44df', 387, '', null, 'e8f571eb-1972-4e71-a20f-347c65d059bb', nextval('public."ContentValue_Id_seq"'), current_date, current_date from "Content" c where "ContentTypeId" =28;