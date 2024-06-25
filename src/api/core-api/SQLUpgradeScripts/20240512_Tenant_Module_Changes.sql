CREATE TABLE public."TenantType" (
	"Id" int4 NOT NULL,
	"Name" varchar(50) not null,
	"NormalizedName" varchar(50) not null,
	CONSTRAINT "PK_TenantType" PRIMARY KEY ("Id")
);

insert into "TenantType"
select 0, 'Host', 'HOST'
union select 1, 'OpenAcces', 'OPENACCESS'
union select 2, 'WhiteLabelTemplate', 'WHITELABELTEMPLATE'
union select 3, 'CHWConnect', 'CHWCONNECT'
union select 4, 'WhiteLabel', 'WHITELABEL'
union select 5, 'FundaApp', 'FUNDAAPP'
;

CREATE TABLE public."Module" (
	"Id" uuid not null,
	"Name" varchar(100) not null,
	"NormalizedName" varchar(100) not null,
	"Description" text,
	CONSTRAINT "PK_Module" PRIMARY KEY ("Id")
);

insert into "Module"
select '5153ef6e-f0cf-44a4-a893-b7ef33c1cb62'::uuid, 'Attendance', 'ATTENDANCE', ''
union select 'f64dadd6-a118-4624-b780-5d102a69bb58'::uuid, 'Progress', 'PROGRESS', ''
union select '1b78f12d-e8b5-4396-a809-47744cff7688'::uuid, 'Classroom Activities', 'CLASSROOM ACTIVITIES', ''
union select '5f71e5fb-9c89-4559-8c9d-878de2d0a3de'::uuid, 'Business', 'BUSINESS', ''
union select 'e790f271-b14e-42e9-8f91-665e139aff49'::uuid, 'Training', 'TRAINING', ''
union select '1b26bda2-0519-4a88-aa52-72b5e82aa4e9'::uuid, 'Calendar', 'CALENDAR', ''
union select '72653e65-40a2-4c57-a251-0e35797b107f'::uuid, 'Coach Role', 'COACH ROLE', ''
;

ALTER TABLE public."AspNetRoles" ADD "SystemName" varchar(256) NOT NULL DEFAULT '';

update "AspNetRoles" set "SystemName" = "Name" ;

CREATE TABLE public."TenantHasModule" (
	"TenantId" uuid not null,
	"ModuleId" uuid not null,
	CONSTRAINT "PK_TenantHasModule" PRIMARY KEY ("TenantId", "ModuleId")
);

select * from "AspNetRoles" anr ;

ALTER TABLE public."TenantHasModule" ADD CONSTRAINT "FK_TenantHasModule_Module_ModuleId" FOREIGN KEY ("ModuleId") REFERENCES public."Module"("Id") ON DELETE CASCADE;

select * from "Tenant" t ;

ALTER TABLE public."Tenant" DROP COLUMN "Server";
ALTER TABLE public."Tenant" DROP COLUMN "DbProvider";
ALTER TABLE public."Tenant" DROP COLUMN "DatabaseName";
ALTER TABLE public."Tenant" DROP COLUMN "ConnectionString";
ALTER TABLE public."Tenant" DROP COLUMN "Var1";
ALTER TABLE public."Tenant" DROP COLUMN "Var2";
alter table public."Tenant" rename column "TenantType" to "TenantTypeId";
alter table public."Tenant" rename column "ThemePathVar" to "ThemePath";
alter table public."Tenant" rename column "MoodleUrlVar" to "MoodleUrl";
alter table public."Tenant" rename column "MoodleConfigVar" to "MoodleConfig";

update "Tenant" set "TenantTypeId" = 3 where "Id" = '39077d0e-e443-4076-aaf2-978dc6805aa0';
update "Tenant" set "TenantTypeId" = 1 where "Id" = '258a15e6-3736-45ea-875c-48d9377de4c8';

insert into "TenantHasModule"("TenantId", "ModuleId")
select '258a15e6-3736-45ea-875c-48d9377de4c8', "Id" from "Module" ;

-- TENANT TABLE NEEDS MANUAL UPDATING
