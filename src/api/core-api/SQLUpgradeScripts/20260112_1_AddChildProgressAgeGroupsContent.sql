-- ########################################################################
-- INSERT AGE GROUPINGS

do $$
-- Insert content type fields
declare
    content_type_field_name_id integer;
   	content_type_field_start_id integer;
    content_type_field_end_id integer;
  	content_id integer;
    tenant_id public."Tenant"."Id"%TYPE;
begin

-- ########################################################################
-- get the needed ids
-- ########################################################################

select ctf."Id" into content_type_field_name_id
from "ContentTypeField" ctf 
where ctf."ContentTypeId" = '37' and ctf."IsActive"  and ctf."FieldName" = 'name';

select ctf."Id" into content_type_field_start_id
from "ContentTypeField" ctf 
where ctf."ContentTypeId" = '37' and ctf."IsActive"  and ctf."FieldName" = 'startAgeInMonths';

select ctf."Id" into content_type_field_end_id
from "ContentTypeField" ctf 
where ctf."ContentTypeId" = '37' and ctf."IsActive"  and ctf."FieldName" = 'endAgeInMonths';

 -- Loop through all tenants
    FOR tenant_id IN
        SELECT DISTINCT t."Id"
        FROM public."Tenant" t
    LOOP

-- ########################################################################
-- 61-65 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '61-65 months (5 years)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '61', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '65', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- ########################################################################
-- 66-69 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '66-69 months (5.5 years)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '66', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '69', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- ########################################################################
-- 70-74 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '70-74 months (6 years)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '70', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '74', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

-- ########################################################################
-- 75-78 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '75-78 months (6.5 years)', null, tenant_id, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '75', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '78', null, tenant_id, CURRENT_DATE, CURRENT_DATE);

END LOOP;

END $$;

