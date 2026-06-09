
--find the content type field
select * from "ContentTypeField" WHERE "FieldName" = 'canSkip' and "ContentTypeId" = '41' -- 660 / true

--updat the description
--update "ContentValue" cv set "Value" = 'Calculate classroom capacity' where "Value" = 'Calculate capacity for each classroom'
-- add the description instead
update "ContentValue" cv set "Value" = 'Health, sanitation & safety' where "Value" = 'Health, sanitation and safety'
update "ContentValue" cv set "Value" = 'Structure & area' where "Value" = 'Structure, space and area'
update "ContentValue" cv set "Value" = 'Space & emergency planning' where "Value" = 'Space and emergency planning'
update "ContentValue" cv set "Value" = 'Next steps' where "Value" = 'Notes or next steps'

--insert new field into content type
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),10, 'nameDescription', 1, true, '', 42, current_date, current_date, NULL, NULL, 'Name description', true, true, true);

--------------------------------------
--insert new content type field and data
-------------------------------------
--get the values for next steps
select * from "ContentValue" cv where cv."Value" = 'Next steps'

 INSERT INTO public."ContentValue" ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
 VALUES (nextval('public."ContentValue_Id_seq"'), '207006', '9688cd08-adef-408c-9d34-5d75ae5c44df', '704', 'Optional', 'e8f571eb-1972-4e71-a20f-347c65d059bb', now(), now());

 INSERT INTO public."ContentValue" ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
 VALUES (nextval('public."ContentValue_Id_seq"'), '206979', '9688cd08-adef-408c-9d34-5d75ae5c44df', '704', 'Optional', '258a15e6-3736-45ea-875c-48d9377de4c8', now(), now());

-- get the ids for assistants
select * from "ContentValue" cv where cv."Value" = 'How many assistants support this class?'

 INSERT INTO public."ContentValue" ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
 VALUES (nextval('public."ContentValue_Id_seq"'), '207009', '9688cd08-adef-408c-9d34-5d75ae5c44df', '704', 'Any classroom with more than 10 children must have an assistant.', 'e8f571eb-1972-4e71-a20f-347c65d059bb', now(), now());

 INSERT INTO public."ContentValue" ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
 VALUES (nextval('public."ContentValue_Id_seq"'), '206982', '9688cd08-adef-408c-9d34-5d75ae5c44df', '704', 'Any classroom with more than 10 children must have an assistant.', '258a15e6-3736-45ea-875c-48d9377de4c8', now(), now());

 --add the description in for classroom questions
 --get the content values
    select * from "ContentValue" cv where cv."Value" = 'How many cms is the short side of the room?' -- update to e.g. 410
    select * from "ContentValue" cv where cv."Value" = 'How many cms is the long side of the room?' -- update to e.g. 410

 INSERT INTO public."ContentValue" ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
 VALUES (nextval('public."ContentValue_Id_seq"'), '207007', '9688cd08-adef-408c-9d34-5d75ae5c44df', '704', 'Any classroom with more than 10 children must have an assistant.', 'e8f571eb-1972-4e71-a20f-347c65d059bb', now(), now());

 INSERT INTO public."ContentValue" ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
 VALUES (nextval('public."ContentValue_Id_seq"'), '206980', '9688cd08-adef-408c-9d34-5d75ae5c44df', '704', 'Any classroom with more than 10 children must have an assistant.', '258a15e6-3736-45ea-875c-48d9377de4c8', now(), now());

--update the assistants description
select * from "ContentValue" cv where cv."Value" = 'How many assistants support this class?' --get the description value, update to e.g. 2

