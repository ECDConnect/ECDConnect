alter table "Content" 
add column if not exists "Sections" text null,
add column if not exists "IsReadOnly" bool null;


-- TODO: Is a lookup needed?

--CREATE TABLE "ContentSection"(
--	"Id" int NOT NULL GENERATED ALWAYS AS IDENTITY
--	"Name" text NULL,
--	"Description" text NULL,
--	"IsActive" bool NOT null default true,
--	"InsertedDate" timestamp NOT NULL DEFAULT NOW();
--	"UpdatedDate" timestamp NOT NULL,
--	"UpdatedBy" text NULL,
--	"TenantId" uuid NULL,
--);

--CREATE TABLE "ContentContentSection"(
--	"ContentId" int NOT NULL
--	"ContentSectionId" int NOT NULL
--	"TenantId" uuid NULL,
--);
--
---- SmartStart
--insert into "ContentSection" ("Name", "TenantId")
--values (
--('CHW Registration')
--'Client Registration - Pregant Mom',
--'Client Registration - Child',
--'Administrator Registration',
--'Practitioner & trainee registration',
--'Child registration',
--'Complete Your Profile',
--'Trainee Onboarding - Franchisee Agreement',
--'Trainee Onboarding - SmartStart Checklist',
--'Community - Accept Club Leader Role'
--)
--
---- Set tenant Id
--update "ContentSection" 
--set "TenantId" = (select "Id" from "Tenant" t where t."ApplicationName" = 'Funda')
--
---- GrowGreat
--insert into "ContentSection" ("Name")
--values (
--'CHW Registration',
--'Client Registration - Pregant Mom',
--'Client Registration - Child',
--'Administrator Registration',
--'Practitioner & trainee registration',
--'Child registration',
--'Complete Your Profile',
--'Trainee Onboarding - Franchisee Agreement',
--'Trainee Onboarding - SmartStart Checklist',
--'Community - Accept Club Leader Role'
--)
--
---- Set tenant Id
--update "ContentSection" 
--set "TenantId" = (select "Id" from "Tenant" t where t."ApplicationName" = 'GrowGreat')
--where "TenantId" != (select "Id" from "Tenant" t where t."ApplicationName" = 'Funda')
--
