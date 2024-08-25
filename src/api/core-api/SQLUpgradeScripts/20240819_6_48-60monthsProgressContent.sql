
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
   
    content_age_group_48to60_id text = '';
begin
	
-- Need to get the relevant content field ids
select "Id" into content_type_field_name_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'name';
select "Id" into content_type_field_value_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'value';
select "Id" into content_type_field_ageGroups_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'ageGroups';
select "Id" into content_type_field_image_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'supportImage';
select "Id" into content_type_field_reverse_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'isReverseScored';

-- Get the age group content ids for the questions
select "ContentId" into content_age_group_48to60_id 
from "ContentValue" cv 
inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '48-60 months (4-5 years)';

-- ########################################################################
-- Can [childFirstName] organise and manage her/himself?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] organise and manage her/himself?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can organise and manage her/himself', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] focus and concentrate on activities?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] focus and concentrate on activities?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can focus and concentrate on activities', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] predict what may happen as a result of an action (e.g. ‘If I climb down this step, then I will be able to reach the ball.’)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] predict what may happen as a result of an action (e.g. ‘If I climb down this step, then I will be able to reach the ball.’)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can predict what may happen as a result of an action (e.g. ‘If I climb down this step, then I will be able to reach the ball.’)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] carry out instructions e.g. 'go to the shelf, fetch the book about animals, and bring it to me.'?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, E'Can [childFirstName] carry out instructions e.g. \'go to the shelf, fetch the book about animals, and bring it to me.\'?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, E'Can carry out instructions e.g. \'go to the shelf, fetch the book about animals, and bring it to me.\'', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- If you ask [childFirstName] to give you five objects (e.g., stones, beans), does [childFirstName] give you the correct number?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'If you ask [childFirstName] to give you five objects (e.g., stones, beans), does [childFirstName] give you the correct number?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'If you ask the child to give you five objects (e.g., stones, beans), they give you the correct number', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Number, shape, size, pattern';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- If you ask [childFirstName] to give you ten objects (e.g., stones, beans), does [childFirstName] give you the correct number?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'If you ask [childFirstName] to give you ten objects (e.g., stones, beans), does [childFirstName] give you the correct number?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'If you ask the child to give you ten objects (e.g., stones, beans), they give you the correct number', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Number, shape, size, pattern';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] identify five different shapes (e.g. circle, square, triangle, rectangle, diamond)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] identify five different shapes (e.g. circle, square, triangle, rectangle, diamond)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can identify five different shapes (e.g. circle, square, triangle, rectangle, diamond)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Number, shape, size, pattern';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] recognise different three-dimensional shapes for example, cone, cylinder, box, ball in illustrations and in the environment?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] recognise different three-dimensional shapes for example, cone, cylinder, box, ball in illustrations and in the environment?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can recognise different three-dimensional shapes for example, cone, cylinder, box, ball in illustrations and in the environment', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Number, shape, size, pattern';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] listen attentively to simple questions and announcements and respond appropriately?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] listen attentively to simple questions and announcements and respond appropriately?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can listen attentively to simple questions and announcements and respond appropriately', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] talk about things that will happen in the future using correct language (e.g., ‘Tomorrow I will play with my friend’ or ‘When I go to Grade R, I will be six’)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] talk about things that will happen in the future using correct language (e.g., ‘Tomorrow I will play with my friend’ or ‘When I go to Grade R, I will be six’)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can talk about things that will happen in the future using correct language (e.g., ‘Tomorrow I will play with my friend’ or ‘When I go to Grade R, I will be six’)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] draw recognisable detailed pictures and tell you what they are about?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] draw recognisable detailed pictures and tell you what they are about?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can  draw recognisable detailed pictures and tell you what they are about?', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] continue patterns and draw new patterns (e.g. stripes, zigzags and wave shapes?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] continue patterns and draw new patterns (e.g. stripes, zigzags and wave shapes?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can continue patterns and draw new patterns (e.g. stripes, zigzags and wave shapes', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] identify direction of shapes, for example, b and d; b and p?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] identify direction of shapes, for example, b and d; b and p?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can identify direction of shapes, for example, b and d; b and p', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Does [childFirstName] understand that writing and drawing are different?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] understand that writing and drawing are different?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Understands that writing and drawing are different', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] turn the pages of a book one by one using thumb and forefinger?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] turn the pages of a book one by one using thumb and forefinger?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can turn the pages of a book one by one using thumb and forefinger', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Emergent reading & writing';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] jump, crawl, climb over & under obstacles?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] jump, crawl, climb over & under obstacles?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can jump, crawl, climb over & under obstacles', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] throw and catch a beanbag?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] throw and catch a beanbag?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can throw and catch a beanbag', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Gross motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] dress him/herself for example, put on pants, shirt, shoes, socks independently?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] dress him/herself for example, put on pants, shirt, shoes, socks independently?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can dress themself for example, put on pants, shirt, shoes, socks independently', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Fine motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Can [childFirstName] use scissors to cut straight and curved shapes with confidence?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Can [childFirstName] use scissors to cut straight and curved shapes with confidence?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Can use scissors to cut straight and curved shapes with confidence', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Fine motor';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- ########################################################################
-- Does [childFirstName] show an interest in and respect for other people’s cultural processes and celebrations e.g. religious hiolidays, routines for meals and hygiene?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] show an interest in and respect for other people’s cultural processes and celebrations e.g. religious hiolidays, routines for meals and hygiene?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Shows an interest in and respect for other people’s cultural processes and celebrations e.g. religious holidays, routines for meals and hygiene', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Social';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

end $$;