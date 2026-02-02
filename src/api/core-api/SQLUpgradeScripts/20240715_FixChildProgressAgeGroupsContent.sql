-- ########################################################################
-- UPDATE DESCRIPTION

do $$
-- Insert content type fields
declare
    content_type_field_description_id integer;
begin

select ctf."Id" into content_type_field_description_id
from "ContentTypeField" ctf 
where ctf."ContentTypeId" = '37' and ctf."FieldName" = 'description';

UPDATE "ContentValue" SET "Value" = '61-65 months' WHERE "ContentTypeFieldId" = content_type_field_description_id and "Value" = '61-65 months (5 years)';
UPDATE "ContentValue" SET "Value" = '66-69 months' WHERE "ContentTypeFieldId" = content_type_field_description_id and "Value" = '66-69 months (5.5 years)';
UPDATE "ContentValue" SET "Value" = '70-74 months' WHERE "ContentTypeFieldId" = content_type_field_description_id and "Value" = '70-74 months (6 years)';
UPDATE "ContentValue" SET "Value" = '75-78 months' WHERE "ContentTypeFieldId" = content_type_field_description_id and "Value" = '75-78 months (6.5 years)';

end $$;

