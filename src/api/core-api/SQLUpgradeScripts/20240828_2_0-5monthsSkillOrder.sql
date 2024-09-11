
do $$
declare	
    content_id_age_group integer;

    content_id integer;
    content_type_field_skills integer;
   
    content_skills_ids text = '';
begin
	-- Get age group skills field id
	select cft."Id" into content_type_field_skills
	from "ContentTypeField" cft 
	where "FieldName" = 'skills' and "ContentTypeId" = 37;
	
	-- Get content id of age group
	select cv."ContentId" into content_id_age_group
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '0-5 months';
	
	--#####################################################################################################
	-- Smiles when others smile at them
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Smiles when others smile at them';
	
	-- append skill to current order
	select content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Grasps onto a small object (e.g., your finger, a spoon) when put in their hand
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Grasps onto a small object (e.g., your finger, a spoon) when put in their hand';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Recognises you or other family members (e.g., smile when they enter a room or move toward them)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Recognises you or other family members (e.g., smile when they enter a room or move toward them)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Shows interest in new objects by trying to put them in their mouth
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Shows interest in new objects by trying to put them in their mouth';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- When lying on their stomach, can hold their head and chest off the ground using only their hands and arms for support
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'When lying on their stomach, can hold their head and chest off the ground using only their hands and arms for support';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can pick up a small object (e.g., a small toy or small stone) using just one hand
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can pick up a small object (e.g., a small toy or small stone) using just one hand';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- When lying on their back, grabs their feet
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'When lying on their back, grabs their feet';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Looks at an object when someone says "look!" and points to it
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Looks at an object when someone says "look!" and points to it';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Looks for an object of interest when it is removed from sight or hidden from them (e.g., put under a cover, behind another object)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Looks for an object of interest when it is removed from sight or hidden from them (e.g., put under a cover, behind another object)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Intentionally moves or changes their position to get objects that are out of reach
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Intentionally moves or changes their position to get objects that are out of reach';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Plays by tapping an object on the ground or a table
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Plays by tapping an object on the ground or a table';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can hold themself in a sitting position without help or support for longer than a few seconds
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can hold themself in a sitting position without help or support for longer than a few seconds';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can pick up and eat small pieces of food with their fingers
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can pick up and eat small pieces of food with their fingers';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can transfer a small object (e.g., a small toy or small stone) from one hand to the other
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can transfer a small object (e.g., a small toy or small stone) from one hand to the other';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can use gestures to indicate what they want (e.g., put arms up to indicate that they want to be held, or point to water)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can use gestures to indicate what they want (e.g., put arms up to indicate that they want to be held, or point to water)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can crawl, roll, or scoot forward on their own
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can crawl, roll, or scoot forward on their own';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can throw a small ball or small stone in a forward direction using their hand
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can throw a small ball or small stone in a forward direction using their hand';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can pick up and drop a small object (e.g., a small toy or small stone) into a bucket or bowl while sitting
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can pick up and drop a small object (e.g., a small toy or small stone) into a bucket or bowl while sitting';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can say one or more words (e.g., names like "Mama" or "ba" for "ball")
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can say one or more words (e.g., names like "Mama" or "ba" for "ball")';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can walk several steps while holding on to a person or object (e.g., wall or furniture)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can walk several steps while holding on to a person or object (e.g., wall or furniture)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Insert order onto age group
	INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
	VALUES(content_id_age_group, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_skills, content_skills_ids, null, null, CURRENT_DATE, CURRENT_DATE);  	
end $$;
