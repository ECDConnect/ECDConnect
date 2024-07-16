-- ########################################################################
-- INSERT AGE GROUPINGS

do $$
-- Insert content type fields
declare
    content_type_field_name_id integer;
   	content_type_field_start_id integer;
    content_type_field_end_id integer;
  	content_id integer;
begin

-- Insert content type
INSERT INTO public."ContentType" ("Id", "Name", "Description", "MetaData", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(37, 'ProgressTrackingAgeGroup', 'Progress tracking age category', null, true, CURRENT_DATE, CURRENT_DATE, '', null, false, '-1'::integer);
	
-- Add new age group field to skills
INSERT INTO public."ContentTypeField" ("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(6, 'ageGroups', 4, true, 'ProgressTrackingAgeGroup', 7, CURRENT_DATE, CURRENT_DATE, '', null, 'Age groups this skill applies to', false, false, false);

INSERT INTO public."ContentTypeField" ("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(1, 'name', 1, true, '', 37, CURRENT_DATE, CURRENT_DATE, '', null, 'Age group name', false, false, false) returning "Id" into content_type_field_name_id;

INSERT INTO public."ContentTypeField" ("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(2, 'startAgeInMonths', 1, true, '', 37, CURRENT_DATE, CURRENT_DATE, '', null, 'Starting age in months', false, false, false) returning "Id" into content_type_field_start_id;

INSERT INTO public."ContentTypeField" ("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(3, 'endAgeInMonths', 1, true, '', 37, CURRENT_DATE, CURRENT_DATE, '', null, 'End age in months', false, false, false) returning "Id" into content_type_field_end_id;

-- ########################################################################
-- 0-5 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '0-5 months', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '0', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '5', null, null, CURRENT_DATE, CURRENT_DATE);

-- ########################################################################
-- 6-11 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '6-11 months', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '6', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '11', null, null, CURRENT_DATE, CURRENT_DATE);

-- ########################################################################
-- 12-17 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '12-17 months (1 year)', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '12', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '17', null, null, CURRENT_DATE, CURRENT_DATE);

-- ########################################################################
-- 18-23 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '18-23 months (1.5 years)', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '18', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '23', null, null, CURRENT_DATE, CURRENT_DATE);

-- ########################################################################
-- 24-29 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '24-29 months (2 years)', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '24', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '29', null, null, CURRENT_DATE, CURRENT_DATE);

-- ########################################################################
-- 30-35 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '30-35 months (2.5 years)', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '30', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '35', null, null, CURRENT_DATE, CURRENT_DATE);

-- ########################################################################
-- 36-47 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '36-47 months (3 years)', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '36', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '47', null, null, CURRENT_DATE, CURRENT_DATE);

-- ########################################################################
-- 48-60 months
-- ########################################################################

-- Insert content for first age group
INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
VALUES(37, true, CURRENT_DATE, CURRENT_DATE, '', null, false) returning "Id" into content_id;

-- Insert content values for first age group (Just current categories for testing) NEED TO GET ContentId and the field Ids...
INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_name_id, '48-60 months (4-5 years)', null, null, CURRENT_DATE, CURRENT_DATE);  

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_start_id, '48', null, null, CURRENT_DATE, CURRENT_DATE);

INSERT INTO public."ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
VALUES(content_id, '9688cd08-adef-408c-9d34-5d75ae5c44df', content_type_field_end_id, '60', null, null, CURRENT_DATE, CURRENT_DATE);

end $$;

