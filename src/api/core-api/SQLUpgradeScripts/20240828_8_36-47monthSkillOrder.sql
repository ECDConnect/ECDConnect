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
	where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '36-47 months (3 years)';
	
	--#####################################################################################################
	-- Can predict what may happen as a result of an action (e.g. ‘If I climb down this step, then I will be able to reach the ball.’)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'name' and cv."Value" = 'Can [childFirstName] predict what may happen as a result of an action (e.g. ‘If I climb down this step, then I will be able to reach the ball.’)';
	
	-- append skill to current order
	select content_id into content_skills_ids;
	
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
	-- Keeps trying when they is faced with a challenge
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Keeps trying when they is faced with a challenge';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Asks lots of questions using words such as ‘what,’ ‘which,’ ‘where,’ or ‘who’ to investigate her/his world
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Asks lots of questions using words such as ‘what,’ ‘which,’ ‘where,’ or ‘who’ to investigate her/his world';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can carry out  instructions e.g. 'go to the shelf, fetch the book about animals, and bring it to me.'
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = E'Can carry out  instructions e.g. \'go to the shelf, fetch the book about animals, and bring it to me.\'';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- If you ask the child to give you seven objects (e.g., stones, beans), they give you the correct amount
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'If you ask the child to give you seven objects (e.g., stones, beans), they give you the correct amount';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can sort objects into different groups for example, colour, shape, size, number
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can sort objects into different groups for example, colour, shape, size, number';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can identify the sequence of the daily programme routines and activities (e.g. meals, naps, hygiene, outdoor play, creative art, music, story time)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can identify the sequence of the daily programme routines and activities (e.g. meals, naps, hygiene, outdoor play, creative art, music, story time)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can accurately describe different positions (in front, on top, under, next to, behind)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can accurately describe different positions (in front, on top, under, next to, behind)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can identify different shapes (e.g. circle, square, triangle)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can identify different shapes (e.g. circle, square, triangle)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can solve everyday number problems, (e.g. there are three children and six apples, so how many apples does each child get)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can solve everyday number problems, (e.g. there are three children and six apples, so how many apples does each child get)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Speaks in complex sentences and use grammar and words correctly
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Speaks in complex sentences and use grammar and words correctly';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can talk about things that have happened in the past using correct language (e.g., ‘Yesterday I played with my friend’ or ‘Last week she went to the market’)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can talk about things that have happened in the past using correct language (e.g., ‘Yesterday I played with my friend’ or ‘Last week she went to the market’)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Enjoys discussions, stories, songs and rhymes with new and amusing words and ideas
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Enjoys discussions, stories, songs and rhymes with new and amusing words and ideas';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Enjoys listening to stories and reading books
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Enjoys listening to stories and reading books';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Draws recognisable pictures and tells you what they are about
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Draws recognisable pictures and tells you what they are about';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can draw patterns (e.g. stripes, zigzags and wave shapes)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can draw patterns (e.g. stripes, zigzags and wave shapes)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Starts to write some letters and their own name (even if partly written)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Starts to write some letters and their own name (even if partly written)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can sound out syllables in words (e.g. ‘el-e-phant’ and her/his own name)
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can sound out syllables in words (e.g. ‘el-e-phant’ and her/his own name)';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Starts to write from the top of the page to the bottom and from left to right e.g. writing her/his name in the top left hand corner of a drawing or painting
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Starts to write from the top of the page to the bottom and from left to right e.g. writing her/his name in the top left hand corner of a drawing or painting';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can move freely and skilfully without bumping into things?
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can move freely and skilfully without bumping into things?';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can stand on one leg for about ten seconds?
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can stand on one leg for about ten seconds?';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can hit a ball with a stick or bat?
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can hit a ball with a stick or bat?';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can throw a big ball to a person and catch the bounced ball on return?
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can throw a big ball to a person and catch the bounced ball on return?';
	
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
	-- Can build a tower using bricks, large bottle tops or other easy-to-balance materials
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can build a tower using bricks, large bottle tops or other easy-to-balance materials';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Approaches new experiences confidently, without fear
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Approaches new experiences confidently, without fear';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;
	
	--#####################################################################################################
	-- Can resolve problems with other children without being aggressive
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'value' and cv."Value" = 'Can resolve problems with other children without being aggressive';
	
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
	-- Shows an interest in and respect for other people’s cultural processes and celebrations e.g. religious holidays, routines for meals and hygiene
	--#####################################################################################################
	select cv."ContentId" into content_id
	from "ContentValue" cv 
	inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
	where ctf."ContentTypeId" = 7 and ctf."FieldName" = 'name' and cv."Value" = 'Does [childFirstName] show an interest in and respect for other people’s cultural processes and celebrations e.g. religious holidays, routines for meals and hygiene?';
	
	-- append skill to current order
	select content_skills_ids || ',' || content_id into content_skills_ids;

	--#####################################################################################################
	-- Insert order onto age group
	INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
	VALUES(content_id_age_group, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_skills, content_skills_ids, null, null, CURRENT_DATE, CURRENT_DATE);  	
end $$;
