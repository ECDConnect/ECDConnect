
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
	where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '12-17 months (1 year)';
	
	--#####################################################################################################
	-- Can maintain a standing position on their own, without holding on or receiving support
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can maintain a standing position on their own, without holding on or receiving support';
	
	-- append skill to current order
	select content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can follow simple directions (e.g., “Stand up" or "Come here”)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can follow simple directions (e.g., “Stand up" or "Come here”)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Imitates others' behaviors (e.g., washing hands or dishes)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = E'Imitates others\' behaviors (e.g., washing hands or dishes)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can climb onto an object such as a chair or bench
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can climb onto an object such as a chair or bench';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Is kind to younger children (e.g., speaks to them nicely and touches them gently)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Is kind to younger children (e.g., speaks to them nicely and touches them gently)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Shows curiosity to learn new things (e.g., by asking questions or exploring a new area)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Shows curiosity to learn new things (e.g., by asking questions or exploring a new area)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can point to a person or object when asked (e.g., “Where is mama?" or "Where is the ball?")
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can point to a person or object when asked (e.g., “Where is mama?" or "Where is the ball?")';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can kick a ball or other round object forward using their foot
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can kick a ball or other round object forward using their foot';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Involves others in play (i.e., play interactive games with other children)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Involves others in play (i.e., play interactive games with other children)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Shows sympathy or looks concerned when others are hurt or sad
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Shows sympathy or looks concerned when others are hurt or sad';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can run more than a few steps without falling or bumping into objects
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can run more than a few steps without falling or bumping into objects';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can drink from a cup (without a lid) on their own without spilling
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can drink from a cup (without a lid) on their own without spilling';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can stack three or more small objects (e.g., blocks, cups, bottle caps) on top of each other
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can stack three or more small objects (e.g., blocks, cups, bottle caps) on top of each other';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can answer simple questions (e.g., “Do you want water?”) by saying "yes" or "no", rather than nodding
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can answer simple questions (e.g., “Do you want water?”) by saying "yes" or "no", rather than nodding';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Plays by pretending objects are something else (e.g., imagining a bottle is a doll, a stone is a car, or a spoon is an airplane)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Plays by pretending objects are something else (e.g., imagining a bottle is a doll, a stone is a car, or a spoon is an airplane)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can correctly name at least one family member other than mom and dad (e.g., name of brother, sister, aunt, uncle)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can correctly name at least one family member other than mom and dad (e.g., name of brother, sister, aunt, uncle)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can ask for something (e.g., food, water) by name when they want it
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can ask for something (e.g., food, water) by name when they want it';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can walk backwards
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can walk backwards';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- If you show them an object they know well (e.g., a cup or animal), they can consistently name it
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'If you show them an object they know well (e.g., a cup or animal), they can consistently name it';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can say ten or more separate words (e.g., names like "Mama" or objects like "ball")
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can say ten or more separate words (e.g., names like "Mama" or objects like "ball")';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
		

	--#####################################################################################################
	-- Insert order onto age group
	INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
	VALUES(content_id_age_group, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_skills, content_skills_ids, null, null, CURRENT_DATE, CURRENT_DATE);  	
end $$;
