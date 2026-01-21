-- Script questions for the 61-65 month age category

do $$
-- Insert content type fields
declare
   content_id integer;
    content_type_field_name_id integer;
    content_type_field_value_id integer;
    content_type_field_ageGroups_id integer;
	content_type_field_skills integer;
   
    content_type_subcategory_skills_id integer;
    content_type_subcategory_new_skills_ids text = '';
   
    content_age_group_id integer;
	content_skills_ids text = '';

	--tenant_id public."Tenant"."Id"%TYPE = '258a15e6-3736-45ea-875c-48d9377de4c8';
	tenant_id public."Tenant"."Id"%TYPE = 'e8f571eb-1972-4e71-a20f-347c65d059bb';
begin
	
-- Need to get the relevant content field ids
select "Id" into content_type_field_name_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'name';
select "Id" into content_type_field_value_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'value';
select "Id" into content_type_field_ageGroups_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'ageGroups';
select "Id" into content_type_field_skills	from "ContentTypeField" where "FieldName" = 'skills' and "ContentTypeId" = 37;

-- Get the age group content ids for the questions
select "ContentId" into content_age_group_id 
from "ContentValue" cv 
inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '70-74 months (6 years)'  and cv."TenantId" = tenant_id;

-- ########################################################################
-- Draws pictures to convey a message about a personal experience and uses this as a starting point for writing
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

select content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Draws pictures to convey a message about a personal experience and uses this as a starting point for writing', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Draws pictures to convey a message about a personal experience and uses this as a starting point for writing', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Recognise and names some letters of their own name
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Recognise and names some letters of their own name', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Recognise and names some letters of their own name', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can match words to objects
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can match words to objects', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can match words to objects', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- When you introduce a topic, the child participates and engages in discussion
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'When you introduce a topic, the child participates and engages in discussion', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'When you introduce a topic, the child participates and engages in discussion', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Using body percussion and/or percussion instruments to perform simple rhythm patterns
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Using body percussion and/or percussion instruments to perform simple rhythm patterns', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Using body percussion and/or percussion instruments to perform simple rhythm patterns', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can create art freely using a range of materials: small boxes, recyclable materials like buttons, egg boxes
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can create art freely using a range of materials: small boxes, recyclable materials like buttons, egg boxes', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can create art freely using a range of materials: small boxes, recyclable materials like buttons, egg boxes', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Simple obstacle course e.g. jumping, running, throwing, climbing, crawling, etc.
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Simple obstacle course e.g. jumping, running, throwing, climbing, crawling, etc.', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Simple obstacle course e.g. jumping, running, throwing, climbing, crawling, etc.', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can put 3 pictures of a story in a sequence
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can put 3 pictures of a story in a sequence', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can put 3 pictures of a story in a sequence', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Shows awareness of own body by participating in mirror and movement activities (e.g., correctly copying movements and identifying body parts)
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Shows awareness of own body by participating in mirror and movement activities (e.g., correctly copying movements and identifying body parts)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Shows awareness of own body by participating in mirror and movement activities (e.g., correctly copying movements and identifying body parts)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can identify colours when mixed to make another colour (example red and blue = purple)
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can identify colours when mixed to make another colour (example red and blue = purple)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can identify colours when mixed to make another colour (example red and blue = purple)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can match pictures or objects that go together e.g. bird - nest
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can match pictures or objects that go together e.g. bird - nest', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can match pictures or objects that go together e.g. bird - nest', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can gallop like a horse
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can gallop like a horse', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can gallop like a horse', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can roll a ball from left to right on the floor as well as against the wall, both hands on the ball, crossing the midline
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can roll a ball from left to right on the floor as well as against the wall, both hands on the ball, crossing the midline', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can roll a ball from left to right on the floor as well as against the wall, both hands on the ball, crossing the midline', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can select/identify an object between others e.g. a bead between many other objects on a tray
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can select/identify an object between others e.g. a bead between many other objects on a tray', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can select/identify an object between others e.g. a bead between many other objects on a tray', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Is a friendly learner and helps when it is cleaning up time
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Is a friendly learner and helps when it is cleaning up time', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Is a friendly learner and helps when it is cleaning up time', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Social';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can complete tasks given
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can complete tasks given', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can complete tasks given', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can throw and catch a beanbag
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can throw and catch a beanbag', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can throw and catch a beanbag', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can demonstrate position regarding space: behind, in front, under, on top, at the side, first, middle, last
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can demonstrate position regarding space: behind, in front, under, on top, at the side, first, middle, last', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can demonstrate position regarding space: behind, in front, under, on top, at the side, first, middle, last', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Distinguishes between more, less and equal, many and few up to 7
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Distinguishes between more, less and equal, many and few up to 7', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Distinguishes between more, less and equal, many and few up to 7', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Numbers, shapes & sizes';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Identifies number pictures and dot cards 5, 6 and 7
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Identifies number pictures and dot cards 5, 6 and 7', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Identifies number pictures and dot cards 5, 6 and 7', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Numbers, shapes & sizes';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Knows the position of two or more objects in relation to each other
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Knows the position of two or more objects in relation to each other', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Knows the position of two or more objects in relation to each other', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Numbers, shapes & sizes';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Understands the concepts of “light, heavy, lighter, heavier, lightest, heaviest”
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Understands the concepts of “light, heavy, lighter, heavier, lightest, heaviest”', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Understands the concepts of “light, heavy, lighter, heavier, lightest, heaviest”', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Numbers, shapes & sizes';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Understands the concepts of “empty, full, more than, less than”
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Understands the concepts of “empty, full, more than, less than”', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Understands the concepts of “empty, full, more than, less than”', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Numbers, shapes & sizes';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Able to collect, sort, draw, read and represent (analyse) objects according to one attribute
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Able to collect, sort, draw, read and represent (analyse) objects according to one attribute', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Able to collect, sort, draw, read and represent (analyse) objects according to one attribute', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Numbers, shapes & sizes';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Knows the direction on arrow chart
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Knows the direction on arrow chart', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Knows the direction on arrow chart', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Numbers, shapes & sizes';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Listens attentively to questions and gives answers
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Listens attentively to questions and gives answers', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Listens attentively to questions and gives answers', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can describe the character in a story, and give a reason why he/she likes/dislikes the person
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can describe the character in a story, and give a reason why he/she likes/dislikes the person', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can describe the character in a story, and give a reason why he/she likes/dislikes the person', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Shows original ideas and imagination during art activities (e.g., drawing, painting, crafting)
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Shows original ideas and imagination during art activities (e.g., drawing, painting, crafting)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Shows original ideas and imagination during art activities (e.g., drawing, painting, crafting)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can jump over and move under obstacles and weave through obstacles (obstacle course)
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can jump over and move under obstacles and weave through obstacles (obstacle course)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can jump over and move under obstacles and weave through obstacles (obstacle course)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Pronounces words well when speaking
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Pronounces words well when speaking', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Pronounces words well when speaking', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can identify numbers and join the dots correctly
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can identify numbers and join the dots correctly', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can identify numbers and join the dots correctly', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Numbers, shapes & sizes';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can skip over a swinging rope
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can skip over a swinging rope', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can skip over a swinging rope', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Loves to play in the fantasy area e.g. kitchen
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Loves to play in the fantasy area e.g. kitchen', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Loves to play in the fantasy area e.g. kitchen', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can take responsibility for his/her own actions
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can take responsibility for his/her own actions', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can take responsibility for his/her own actions', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Personal & emotional';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Knows the number symbols 5, 6 and 7
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Knows the number symbols 5, 6 and 7', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Knows the number symbols 5, 6 and 7', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Numbers, shapes & sizes';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can convey a simple message
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can convey a simple message', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can convey a simple message', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can easily walk sideways and backwards on a raised beam, rope or masking tape
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can easily walk sideways and backwards on a raised beam, rope or masking tape', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can easily walk sideways and backwards on a raised beam, rope or masking tape', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Uses good sentence structure when he/she is speaking
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Uses good sentence structure when he/she is speaking', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Uses good sentence structure when he/she is speaking', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Easily completes an 18-piece puzzle
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Easily completes an 18-piece puzzle', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Easily completes an 18-piece puzzle', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Fine motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can balance on one foot for 5 seconds on the left and for 5 seconds on the right
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can balance on one foot for 5 seconds on the left and for 5 seconds on the right', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can balance on one foot for 5 seconds on the left and for 5 seconds on the right', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can handle conflict situations well
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can handle conflict situations well', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can handle conflict situations well', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Personal & emotional';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Recognises the number names five, six and seven
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Recognises the number names five, six and seven', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Recognises the number names five, six and seven', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_id, null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 
and cvs."ContentTypeFieldId" = 26 
and cvn."TenantId" = tenant_id
and cvs."TenantId" = tenant_id
and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' 
and c."IsActive"
	and cvn."Value" = 'Numbers, shapes & sizes';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- Insert order onto age group
	INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
	VALUES(content_age_group_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_skills, content_skills_ids, null, tenant_id, CURRENT_DATE, CURRENT_DATE);  	
end $$;