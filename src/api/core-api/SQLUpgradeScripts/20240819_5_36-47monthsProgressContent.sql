
do $$
-- Insert content type fields
declare
    content_id integer;
    content_type_field_name_id integer;
    content_type_field_value_id integer;
    content_type_field_image_id integer;
    content_type_field_reverse_id integer;
    content_type_field_ageGroups_id integer;
   
    content_type_subcategory_skills_id integer;
    content_type_subcategory_new_skills_ids text = '';
   
    content_age_group_36to47_id text = '';
    content_age_group_48to60_id text = '';
   
    content_age_group_36to47_48to60_id text = '';
begin
	
-- Need to get the relevant content field ids
select "Id" into content_type_field_name_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'name';
select "Id" into content_type_field_value_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'value';
select "Id" into content_type_field_ageGroups_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'ageGroups';
select "Id" into content_type_field_image_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'supportImage';
select "Id" into content_type_field_reverse_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'isReverseScored';

-- Get the age group content ids for the questions
select "ContentId" into content_age_group_36to47_id 
from "ContentValue" cv 
inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '36-47 months (3 years)';

select "ContentId" into content_age_group_48to60_id 
from "ContentValue" cv 
inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '48-60 months (4-5 years)';

select content_age_group_36to47_id || ',' || content_age_group_48to60_id into content_age_group_36to47_48to60_id;

-- ########################################################################
-- Can [childFirstName] predict what may happen as a result of an action (e.g. ‘If I climb down this step, then I will be able to reach the ball.’)
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] predict what may happen as a result of an action (e.g. ‘If I climb down this step, then I will be able to reach the ball.’)', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can predict what may happen as a result of an action (e.g. ‘If I climb down this step, then I will be able to reach the ball.’)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Does [childFirstName] keep trying when he/she is faced with a challenge?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] keep trying when he/she is faced with a challenge?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Keeps trying when they is faced with a challenge', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Does [childFirstName] ask lots of questions using words such as ‘what,’ ‘which,’ ‘where,’ or ‘who’ to investigate her/his world?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] ask lots of questions using words such as ‘what,’ ‘which,’ ‘where,’ or ‘who’ to investigate her/his world?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Asks lots of questions using words such as ‘what,’ ‘which,’ ‘where,’ or ‘who’ to investigate her/his world', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] carry out  instructions e.g. 'go to the shelf, fetch the book about animals, and bring it to me.'?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, E'Can [childFirstName] carry out  instructions e.g. \'go to the shelf, fetch the book about animals, and bring it to me.\'?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, E'Can carry out  instructions e.g. \'go to the shelf, fetch the book about animals, and bring it to me.\'', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- If you ask [childFirstName] to give you seven objects (e.g., stones, beans), does [childFirstName] give you the correct amount?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'If you ask [childFirstName] to give you seven objects (e.g., stones, beans), does [childFirstName] give you the correct amount?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'If you ask the child to give you seven objects (e.g., stones, beans), they give you the correct amount', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Number, shape, size, pattern';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] sort objects into different groups for example, colour, shape, size, number?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] sort objects into different groups for example, colour, shape, size, number?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can sort objects into different groups for example, colour, shape, size, number', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Number, shape, size, pattern';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] identify the sequence of the daily programme routines and activities (e.g. meals, naps, hygiene, outdoor play, creative art, music, story time)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] identify the sequence of the daily programme routines and activities (e.g. meals, naps, hygiene, outdoor play, creative art, music, story time)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can identify the sequence of the daily programme routines and activities (e.g. meals, naps, hygiene, outdoor play, creative art, music, story time)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Number, shape, size, pattern';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] accurately describe different positions (in front, on top, under, next to, behind)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] accurately describe different positions (in front, on top, under, next to, behind)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can accurately describe different positions (in front, on top, under, next to, behind)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Number, shape, size, pattern';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] identify different shapes (e.g. circle, square, triangle)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] identify different shapes (e.g. circle, square, triangle)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can identify different shapes (e.g. circle, square, triangle)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Number, shape, size, pattern';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] solve everyday number problems, (e.g. there are three children and six apples, so how many apples does each child get)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] solve everyday number problems, (e.g. there are three children and six apples, so how many apples does each child get)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can solve everyday number problems, (e.g. there are three children and six apples, so how many apples does each child get)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Number, shape, size, pattern';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Does [childFirstName] speak in complex sentences and use grammar and words correctly?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] speak in complex sentences and use grammar and words correctly?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Speaks in complex sentences and use grammar and words correctly', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] talk about things that have happened in the past using correct language (e.g., ‘Yesterday I played with my friend’ or ‘Last week she went to the market’)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] talk about things that have happened in the past using correct language (e.g., ‘Yesterday I played with my friend’ or ‘Last week she went to the market’)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can talk about things that have happened in the past using correct language (e.g., ‘Yesterday I played with my friend’ or ‘Last week she went to the market’)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Does [childFirstName] enjoy discussions, stories, songs and rhymes with new and amusing words and ideas?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] enjoy discussions, stories, songs and rhymes with new and amusing words and ideas?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Enjoys discussions, stories, songs and rhymes with new and amusing words and ideas', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Does [childFirstName] enjoy listening to stories and reading books?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] enjoy listening to stories and reading books?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Enjoys listening to stories and reading books', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] draw recognisable pictures and tell you what they are about?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] draw recognisable pictures and tell you what they are about?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Draws recognisable pictures and tells you what they are about', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] draw patterns (e.g. stripes, zigzags and wave shapes)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] draw patterns (e.g. stripes, zigzags and wave shapes)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can draw patterns (e.g. stripes, zigzags and wave shapes)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Does [childFirstName] start to write some letters and his/her own name (even if partly written)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] start to write some letters and his/her own name (even if partly written)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Starts to write some letters and their own name (even if partly written)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] sound out syllables in words (e.g. ‘el-e-phant’ and her/his own name)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] sound out syllables in words (e.g. ‘el-e-phant’ and her/his own name)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can sound out syllables in words (e.g. ‘el-e-phant’ and her/his own name)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Does [childFirstName] start to write from the top of the page to the bottom and from left to right e.g. writing her/his name in the top left hand corner of a drawing or painting?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] start to write from the top of the page to the bottom and from left to right e.g. writing her/his name in the top left hand corner of a drawing or painting?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Starts to write from the top of the page to the bottom and from left to right e.g. writing her/his name in the top left hand corner of a drawing or painting', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] move freely and skilfully without bumping into things?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] move freely and skilfully without bumping into things?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can move freely and skilfully without bumping into things?', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] stand on one leg for about ten seconds?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] stand on one leg for about ten seconds?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can stand on one leg for about ten seconds?', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] hit a ball with a stick or bat?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] hit a ball with a stick or bat?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can hit a ball with a stick or bat?', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] throw a big ball to a person and catch the bounced ball on return?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] throw a big ball to a person and catch the bounced ball on return?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can throw a big ball to a person and catch the bounced ball on return?', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] build a tower using bricks, large bottle tops or other easy-to-balance materials?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] build a tower using bricks, large bottle tops or other easy-to-balance materials?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can build a tower using bricks, large bottle tops or other easy-to-balance materials', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Fine motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Does [childFirstName] approach new experiences confidently, without fear?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] approach new experiences confidently, without fear?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Approaches new experiences confidently, without fear', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Personal & emotional';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] resolve problems with other children without being aggressive?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] resolve problems with other children without being aggressive?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can resolve problems with other children without being aggressive', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Personal & emotional';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Does [childFirstName] show an interest in and respect for other people’s cultural processes and celebrations e.g. religious holidays, routines for meals and hygiene?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] show an interest in and respect for other people’s cultural processes and celebrations e.g. religious holidays, routines for meals and hygiene?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Shows an interest in and respect for other people’s cultural processes and celebrations e.g. religious holidays, routines for meals and hygiene', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Social';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

end $$;