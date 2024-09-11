
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
	where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '30-35 months (2.5 years)';
	
	--#####################################################################################################
	-- Can say ten or more separate words (e.g., names like "Mama" or objects like "ball")
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can say ten or more separate words (e.g., names like "Mama" or objects like "ball")';
	
	-- append skill to current order
	select content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can jump with both feet leaving the ground
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can jump with both feet leaving the ground';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can speak using sentences of three or more words that go together (e.g., "I want water" or "The house is big")
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can speak using sentences of three or more words that go together (e.g., "I want water" or "The house is big")';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can sing a short song or repeat parts of a rhyme from memory by him/herself
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can sing a short song or repeat parts of a rhyme from memory by themselves';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can correctly ask questions using any of the words "what," "which," "where," or "who"
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can correctly ask questions using any of the words "what," "which," "where," or "who"';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Asks about familiar people other than parents when they are not there (e.g., "Where is the neighbour")
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Asks about familiar people other than parents when they are not there (e.g., "Where is the neighbour")';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can correctly use any of the words "I," "you," "she," or "he" (e.g., "I go to store," or "He eats rice")
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can correctly use any of the words "I," "you," "she," or "he" (e.g., "I go to store," or "He eats rice")';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can count up to five objects (e.g., fingers, people)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can count up to five objects (e.g., fingers, people)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can identify at least one colour (e.g., red, blue, yellow)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can identify at least one colour (e.g., red, blue, yellow)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- If you show them two objects or people of different size, they can tell you which one is the big one and which is the small one
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'If you show them two objects or people of different size, can he/she tell you which one is the big one and which is the small one';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- If you point to an object, they can correctly use the words "on," "in," or "under" to describe where it is (e.g., "The cup is on the table" instead of "The cup is in the table.")
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'If you point to an object, they can correctly use the words "on," "in," or "under" to describe where it is (e.g., "The cup is on the table" instead of "The cup is in the table.")';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can explain in words what common objects like a cup or chair are used for
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can explain in words what common objects like a cup or chair are used for';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can dress themself (e.g., put on their pants and shirt without help)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can dress themself (e.g., put on their pants and shirt without help)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Asks "why" questions (e.g., "Why are you tall")
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Asks "why" questions (e.g., "Why are you tall")';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- If you ask them to give you three objects (e.g., stones, beans), they give you the correct amount
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'If you ask them to give you three objects (e.g., stones, beans), do they give you the correct amount';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Does not often kick, bite, or hit other children or adults
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Does not often kick, bite, or hit other children or adults';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Does not become extremely withdrawn or shy in new situations
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Does not become extremely withdrawn or shy in new situations';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Does not frequently act impulsively or without thinking (e.g., running into the street without looking)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Does not frequently act impulsively or without thinking (e.g., running into the street without looking)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can say what others like or dislike (e.g., "Mama doesn't like fruit," "Papa likes football")
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = E'Can say what others like or dislike (e.g., "Mama doesn\'t like fruit," "Papa likes football")';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can talk about things that have happened in the past using correct language (e.g., "Yesterday I played with my friend" or "Last week she went to the market")
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can talk about things that have happened in the past using correct language (e.g., "Yesterday I played with my friend" or "Last week she went to the market")';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Insert order onto age group
	INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
	VALUES(content_id_age_group, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_skills, content_skills_ids, null, null, CURRENT_DATE, CURRENT_DATE);  	
end $$;
