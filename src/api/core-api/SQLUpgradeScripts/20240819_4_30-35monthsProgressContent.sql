
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
   
    content_age_group_30to35_id text = '';
    content_age_group_36to47_id text = '';
    content_age_group_48to60_id text = '';
   
    content_age_group_30to35_36to47_48to60_id text = '';
begin
	
-- Need to get the relevant content field ids
select "Id" into content_type_field_name_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'name';
select "Id" into content_type_field_value_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'value';
select "Id" into content_type_field_ageGroups_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'ageGroups';
select "Id" into content_type_field_image_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'supportImage';
select "Id" into content_type_field_reverse_id from "ContentTypeField" where "ContentTypeId" = 7 and "FieldName" = 'isReverseScored';

-- Get the age group content ids for the questions
select "ContentId" into content_age_group_30to35_id 
from "ContentValue" cv 
inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '30-35 months (2.5 years)';

select "ContentId" into content_age_group_36to47_id 
from "ContentValue" cv 
inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '36-47 months (3 years)';

select "ContentId" into content_age_group_48to60_id 
from "ContentValue" cv 
inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '48-60 months (4-5 years)';

select content_age_group_30to35_id || ',' || content_age_group_36to47_id || ',' || content_age_group_48to60_id into content_age_group_30to35_36to47_48to60_id;

-- ########################################################################
-- Does [childFirstName] frequently act impulsively or without thinking (e.g., running into the street without looking)?
-- ########################################################################

-- Insert content for question
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(7, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for skill
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, 'Does [childFirstName] frequently act impulsively or without thinking (e.g., running into the street without looking)?', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_value_id, 'Does not frequently act impulsively or without thinking (e.g., running into the street without looking)', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_ageGroups_id, content_age_group_30to35_36to47_48to60_id, null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_reverse_id, 'true', null, null, CURRENT_DATE, CURRENT_DATE);  

-- update subcategory skills
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

end $$;