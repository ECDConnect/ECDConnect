-- INSERT COLORS FOR AGE GROUPS
do $$

declare
    content_id integer;
    content_type_field_color_id integer;
    content_type_field_description_id integer;
    tenant_id public."Tenant"."Id"%TYPE;
begin

-- ########################################################################
-- get the needed ids
-- ########################################################################

select ctf."Id"   into content_type_field_color_id
from "ContentTypeField" ctf 
where ctf."ContentTypeId" = '37' and ctf."FieldName" = 'color';

select ctf."Id" into content_type_field_description_id
from "ContentTypeField" ctf 
where ctf."ContentTypeId" = '37' and ctf."FieldName" = 'description';

 -- Loop through all tenants
    FOR tenant_id IN
        SELECT DISTINCT t."Id"
        FROM public."Tenant" t
    LOOP

-- 61-65 months
select cv."ContentId" into content_id
from "ContentValue" cv 
inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '61-65 months (5 years)' and cv."TenantId" = tenant_id;

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_color_id, 'quatenary', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_description_id, '61-65 months (5 years)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

-- 66-69 months
select cv."ContentId" into content_id
from "ContentValue" cv 
inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '66-69 months (5.5 years)' and cv."TenantId" = tenant_id;

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_color_id, 'warning', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_description_id, '66-69 months (5.5 years)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

-- 70-74 months 
select cv."ContentId" into content_id
from "ContentValue" cv 
inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '70-74 months (6 years)' and cv."TenantId" = tenant_id;

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_color_id, 'primary', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_description_id, '70-74 months (6 years)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

-- 75-78 months
select cv."ContentId" into content_id
from "ContentValue" cv 
inner join "ContentTypeField" ctf on cv."ContentTypeFieldId" = ctf."Id" 
where ctf."ContentTypeId" = 37 and ctf."FieldName" = 'name' and cv."Value" = '75-78 months (6.5 years)' and cv."TenantId" = tenant_id;

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_color_id, 'secondary', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_description_id, '75-78 months (6.5 years)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

END LOOP;

end $$;