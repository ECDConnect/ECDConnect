-- TODO: Run on merge of branch:

update "ContentType" ct 
set "TenantId" = null
where ct."Name" = 'MoreInformation';

-- Remove incorrect DataLink assignment
update "ContentTypeField" ctf
set "DataLinkName" = ''
where "DataLinkName" = 'Consent Image';

-- Fix "SS" Consent Sections
alter table "Content" drop column "Sections";

insert into "ContentTypeField"
("FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
values
(3, 'section', 1, true, '', (select "Id" from "ContentType" c where c."Name" = 'Consent'), '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', 'System', (select "Id" from "Tenant" t where t."ApplicationName" = 'Funda'))
;
