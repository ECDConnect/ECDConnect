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

	tenant_id public."Tenant"."Id"%TYPE = '258a15e6-3736-45ea-875c-48d9377de4c8';
	--tenant_id public."Tenant"."Id"%TYPE = 'e8f571eb-1972-4e71-a20f-347c65d059bb';
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
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '75-78 months (6.5 years)' and cv."TenantId" = tenant_id;

-- ########################################################################
-- Can count forwards and backwards from 1 to 10
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

select content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can count forwards and backwards from 1 to 10', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can count forwards and backwards from 1 to 10', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Identifies number pictures and dot cards from 0 – 10
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Identifies number pictures and dot cards from 0 - 10', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Identifies number pictures and dot cards from 0 - 10', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Can build a 24-piece puzzle
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can build a 24-piece puzzle', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can build a 24-piece puzzle', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Is ready and looking forward to Grade 1
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Is ready and looking forward to Grade 1', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Is ready and looking forward to Grade 1', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Is adventurous when playing outside during outdoor play
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Is adventurous when playing outside during outdoor play', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Is adventurous when playing outside during outdoor play', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Can identify name and surname among others
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can identify name and surname among others', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can identify name and surname among others', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Cuts a simple picture e.g. house very neatly and correct on the lines
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Cuts a simple picture e.g. house very neatly and correct on the lines', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Cuts a simple picture e.g. house very neatly and correct on the lines', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Can click fingers fast and slow
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can click fingers fast and slow', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can click fingers fast and slow', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Likes to identify rhyming words after a rhyme
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Likes to identify rhyming words after a rhyme', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Likes to identify rhyming words after a rhyme', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Fasten own shoelaces
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Fasten own shoelaces', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Fasten own shoelaces', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Balances and walks confidently on uneven or raised surfaces (e.g., stilts, tyres)
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Balances and walks confidently on uneven or raised surfaces (e.g., stilts, tyres)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Balances and walks confidently on uneven or raised surfaces (e.g., stilts, tyres)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Looks at a picture card and acts out the activity shown (e.g. eating an ice cream)
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Looks at a picture card and acts out the activity shown (e.g. eating an ice cream)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Looks at a picture card and acts out the activity shown (e.g. eating an ice cream)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Catches different size balls (large, medium, small) at various distances or heights
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Catches different size balls (large, medium, small) at various distances or heights', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Catches different size balls (large, medium, small) at various distances or heights', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Create in 3D: use play dough modelling, pinching, pulling, rolling smaller pieces
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Create in 3D: use play dough modelling, pinching, pulling, rolling smaller pieces', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Create in 3D: use play dough modelling, pinching, pulling, rolling smaller pieces', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Uses language to develop concepts in all subjects: quantity, size, shape, direction, colour, speed, time, age and sequence
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Uses language to develop concepts in all subjects: quantity, size, shape, direction, colour, speed, time, age and sequence', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Uses language to develop concepts in all subjects: quantity, size, shape, direction, colour, speed, time, age and sequence', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Interprets pictures to construct ideas, make up own story and "read" the pictures
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Interprets pictures to construct ideas, make up own story and "read" the pictures', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Interprets pictures to construct ideas, make up own story and "read" the pictures', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Copies letters and numerals from the classroom environment when "writing"
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Copies letters and numerals from the classroom environment when "writing"', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Copies letters and numerals from the classroom environment when "writing"', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Can complete an "unfinished" picture drawing or identify the object by looking at the "partly" drawing
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can complete an "unfinished" picture drawing or identify the object by looking at the "partly" drawing', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can complete an "unfinished" picture drawing or identify the object by looking at the "partly" drawing', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- With a flat hand turn upwards: keep balloon in the air for 10 sec
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'With a flat hand turn upwards: keep balloon in the air for 10 sec', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'With a flat hand turn upwards: keep balloon in the air for 10 sec', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Understands ordinal numbers – first, second, third, fourth, fifth and sixth
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Understands ordinal numbers - first, second, third, fourth, fifth and sixth', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Understands ordinal numbers - first, second, third, fourth, fifth and sixth', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Can create or pack a pattern with different objects, e.g. shapes, seeds
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can create or pack a pattern with different objects, e.g. shapes, seeds', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can create or pack a pattern with different objects, e.g. shapes, seeds', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Enjoys to measure all kinds of objects, to compare and draw conclusion with piece of wool/ string
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Enjoys to measure all kinds of objects, to compare and draw conclusion with piece of wool/ string', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Enjoys to measure all kinds of objects, to compare and draw conclusion with piece of wool/ string', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Likes to compare practically the different volume water contains in different containers
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Likes to compare practically the different volume water contains in different containers', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Likes to compare practically the different volume water contains in different containers', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Recognises the line of symmetry in objects
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Recognises the line of symmetry in objects', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Recognises the line of symmetry in objects', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Orally solves addition and subtraction problems that involve numbers up to number 10
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Orally solves addition and subtraction problems that involve numbers up to number 10', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Orally solves addition and subtraction problems that involve numbers up to number 10', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Knows the number symbols (8, 9, 10 and 0)
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Knows the number symbols (8, 9, 10 and 0)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Knows the number symbols (8, 9, 10 and 0)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Enjoys listening to stories
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Enjoys listening to stories', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Enjoys listening to stories', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Can wait his/her turn when doing activities
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can wait his/her turn when doing activities', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can wait his/her turn when doing activities', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Knows his/her address & parent's cell number
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Knows his/her address & parents cell number', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Knows his/her address & parents cell number', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Can neatly and accurately fold a piece of paper so that the corners match up (e.g., folding in symmetry)
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can neatly and accurately fold a piece of paper so that the corners match up (e.g., folding in symmetry)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can neatly and accurately fold a piece of paper so that the corners match up (e.g., folding in symmetry)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- When blindfolded can identify from where the sound comes from by pointing in the right direction
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'When blindfolded can identify from where the sound comes from by pointing in the right direction', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'When blindfolded can identify from where the sound comes from by pointing in the right direction', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Can easily add and expand on sounds if he/she needs to e.g. what else begins with a "s" or "b"
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can easily add and expand on sounds if he/she needs to e.g. what else begins with a "s" or "b"', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can easily add and expand on sounds if he/she needs to e.g. what else begins with a "s" or "b"', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Can dribble a ball with left and right foot
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can dribble a ball with left and right foot', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can dribble a ball with left and right foot', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Recognises the number names (8, 9, 10 and 0)
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Recognises the number names (8, 9, 10 and 0)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Recognises the number names (8, 9, 10 and 0)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Has good manners
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Has good manners', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Has good manners', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Can work independently without any assistance
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can work independently without any assistance', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can work independently without any assistance', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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
-- Likes to play with activities such as pegboards, fingerboards, copy the pattern onto the dots etc.
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- append skill to current order
select content_skills_ids || ',' || content_id into content_skills_ids;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Likes to play with activities such as pegboards, fingerboards, copy the pattern onto the dots etc.', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Likes to play with activities such as pegboards, fingerboards, copy the pattern onto the dots etc.', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

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

-- Insert order onto age group
	INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
	VALUES(content_age_group_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_skills, content_skills_ids, null, tenant_id, CURRENT_DATE, CURRENT_DATE);  	

end $$;