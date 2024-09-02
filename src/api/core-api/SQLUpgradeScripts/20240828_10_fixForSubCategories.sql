do $$
declare	
    content_id integer;

    content_type_subcategory_skills_id integer;   
    content_type_subcategory_new_skills_ids text = '';
begin

--APPROACHES TO LEARNING!!!
-- Missing skills
-- 200129 -> Asks you for help using signs or words when they cannot do something on their own (e.g., to reach an object up high)
	
select "ContentId" into content_id ci 
from "ContentValue" cv 
where cv."Value" = 'Asks you for help using signs or words when they cannot do something on their own (e.g., to reach an object up high)';
	
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Approaches to learning';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;



-- Communication: speaking & listening
-- 200130 -> Can follow simple directions (e.g., “Stand up" or "Come here”)	
select "ContentId" into content_id ci 
from "ContentValue" cv 
where cv."Value" = 'Can follow simple directions (e.g., “Stand up" or "Come here”)';
	
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- 200132 -> Can point to a person or object when asked (e.g., “Where is mama?" or "Where is the ball?")
select "ContentId" into content_id ci 
from "ContentValue" cv 
where cv."Value" = 'Can point to a person or object when asked (e.g., “Where is mama?" or "Where is the ball?")';
	
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- 200143 - Communication: speaking & listening - Can answer simple questions (e.g., “Do you want water?”) by saying "yes" or "no", rather than nodding
select "ContentId" into content_id ci 
from "ContentValue" cv 
where cv."Value" = 'Can answer simple questions (e.g., “Do you want water?”) by saying "yes" or "no", rather than nodding';
	
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- 200145 - Communication: speaking & listening - Can correctly name at least one family member other than mom and dad (e.g., name of brother, sister, aunt, uncle)
select "ContentId" into content_id ci 
from "ContentValue" cv 
where cv."Value" = 'Can correctly name at least one family member other than mom and dad (e.g., name of brother, sister, aunt, uncle)';
	
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- 200146 - Communication: speaking & listening - Can ask for something (e.g., food, water) by name when they want it
select "ContentId" into content_id ci 
from "ContentValue" cv 
where cv."Value" = 'Can ask for something (e.g., food, water) by name when they want it';
	
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- 200148 - Communication: speaking & listening - If you show them an object they know well (e.g., a cup or animal), they can consistently name it
select "ContentId" into content_id ci 
from "ContentValue" cv 
where cv."Value" = 'If you show them an object they know well (e.g., a cup or animal), they can consistently name it';
	
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

-- 200149 - Communication: speaking & listening - Can say ten or more separate words (e.g., names like "Mama" or objects like "ball")
select "ContentId" into content_id ci 
from "ContentValue" cv 
where cv."Value" = 'Can say ten or more separate words (e.g., names like "Mama" or objects like "ball")';
	
select cvs."Id", cvs."Value" || ',' || content_id into content_type_subcategory_skills_id, content_type_subcategory_new_skills_ids
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" 
	and cvn."Value" = 'Communication: Speaking & listening';

update "ContentValue" set "Value" = content_type_subcategory_new_skills_ids where "Id" = content_type_subcategory_skills_id;

end $$;