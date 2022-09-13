-- public."Tenant" definition

-- Drop table

-- DROP TABLE public."Tenant";

CREATE TABLE public."Tenant" (
	"ApplicationName" text NULL,
	"SiteAddress" text NULL,
	"OrganisationName" text NULL,
	"Server" text NULL,
	"DbProvider" text NULL,
	"DatabaseName" text NULL,
	"ConnectionString" text NULL,
	"TenantType" int4 NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"Id" uuid NOT NULL,
	"ThemePathVar" varchar NULL,
	"Var1" varchar NULL,
	"Var2" varchar NULL,
	CONSTRAINT tenant_pk PRIMARY KEY ("Id")
);

INSERT INTO public."Tenant" ("ApplicationName","SiteAddress","OrganisationName","Server","DbProvider","DatabaseName","ConnectionString","TenantType","InsertedDate","UpdatedDate","UpdatedBy","Id","ThemePathVar","Var1","Var2") VALUES
	 ('ECD Connect','NonMatchingPlaceholderName','DGMT','','postgressql','',NULL,0,'2022-01-30 18:31:59.357339','2022-01-30 18:31:59.357408',NULL,'64e657c9-67cf-4769-84eb-a5a7d819dda8',NULL,NULL,NULL),
	 ('Funda','ecdconnect','SmartStart','ecd-connect.postgres.database.azure.com','postgressql','SmartStart','Server=ecd-connect.postgres.database.azure.com;Database=SmartStart;Port=5432;User Id=ecdconnectadmin;Password=8BHaK%U9@$15;Ssl Mode=Require;',1,'2022-01-30 18:37:47.58168','2022-01-30 18:37:47.581701',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8',NULL,NULL,NULL),
	 ('GrowGreat','growgreat','GrowGreat','ecd-connect.postgres.database.azure.com','postgressql','SmartStart','Server=ecd-connect.postgres.database.azure.com;Database=SmartStart;Port=5432;User Id=ecdconnectadmin;Password=8BHaK%U9@$15;Ssl Mode=Require;',1,'2022-01-30 18:37:47.581','2022-01-30 18:37:47.581',NULL,'39077d0e-e443-4076-aaf2-978dc6805aa0',NULL,NULL,NULL);

	
INSERT INTO public."AspNetUsers" ("Id","UserName","NormalizedUserName","Email","NormalizedEmail","EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp","PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled","LockoutEnd","LockoutEnabled","AccessFailedCount", "IsSouthAfricanCitizen","VerifiedByHomeAffairs", "DateOfBirth", "IsActive"   ) VALUES
	 ('ee77e565-3ff8-42e3-90ee-9902d581a2a4','GlobalAdmin','GLOBALADMIN',NULL,NULL,false,'AQAAAAEAACcQAAAAEAYGpaSr1UiVH1IAFd+KCy4mpnooCH3c/wt2qVqKa42RY7zgEoRQcjL4h9CeGodLDQ==','DVNV557F37WR4R4OSIPVIJPNJLH3VE4C','65676287-ebf3-41dc-b9e0-2ad7eb0359b7',NULL,false,false,NULL,true,0, false, false, '2022-12-31 00:00:00.000', true);


ALTER TABLE public."Absentees" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."AspNetRoleClaims" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."AspNetRoles" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."AspNetUserClaims" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."AspNetUserLogins" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."AspNetUserRoles" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."AspNetUserTokens" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Attendance" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."AuditLog" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."AuditLogType" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."CareGiverGrant" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Caregiver" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Child" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ChildProgressReport" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ClassProgramme" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Classroom" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ClassroomGroup" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Coach" ADD COLUMN IF NOT exists "TenantId" uuid NULL;

ALTER TABLE public."Document" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."DocumentType" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Education" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Franchisor" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Gender" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Grant" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Hierarchy" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."JobNotification" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Language" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Learner" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."MessageTemplate" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Navigation" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."NavigationPermission" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Note" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."NoteType" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Permission" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Practitioner" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Programme" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ProgrammeAttendanceReason" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ProgrammeDay" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ProgrammeType" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Province" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Race" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ReasonForLeaving" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Relation" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."RolePermission" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ShortUrl" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."SiteAddress" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."SystemSetting" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."UserConsent" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."UserGrants" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."UserHierarchy" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."WorkflowStatus" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."WorkflowStatusType" ADD COLUMN IF NOT exists "TenantId" uuid NULL;

ALTER TABLE public."AspNetUsers" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Content" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ContentFieldType" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ContentStatus" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ContentType" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ContentTypeField" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."ContentValue" ADD COLUMN IF NOT exists "TenantId" uuid NULL;


update public."Absentees" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."AspNetRoleClaims" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."AspNetRoles" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."AspNetUserClaims" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."AspNetUserLogins" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."AspNetUserRoles" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."AspNetUserTokens" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."AspNetUsers" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Attendance" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."CareGiverGrant" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Caregiver" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Child" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ChildProgressReport" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ClassProgramme" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Classroom" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ClassroomGroup" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Coach" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Content" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ContentFieldType" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ContentStatus" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ContentType" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ContentTypeField" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ContentValue" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Document" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."DocumentType" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Education" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Franchisor" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Hierarchy" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Learner" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."MessageTemplate" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Note" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Permission" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Practitioner" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Programme" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ProgrammeAttendanceReason" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ProgrammeDay" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."RolePermission" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ShortUrl" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."SiteAddress" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."UserConsent" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."UserGrants" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."UserHierarchy" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."JobNotification" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';

/*
update public."AuditLog" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."AuditLogType" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Gender" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Grant" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';

update public."Language" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Navigation" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."NavigationPermission" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."NoteType" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ProgrammeType" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Province" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Race" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."ReasonForLeaving" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."Relation" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."SystemSetting" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."WorkflowStatus" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update public."WorkflowStatusType" set "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
*/
update public."AuditLog" set "TenantId" = null;
update public."AuditLogType" set "TenantId" = null;
update public."Gender" set "TenantId" = null;
update public."Grant" set "TenantId" = null;
update public."Language" set "TenantId" = null;
update public."Navigation" set "TenantId" = null;
update public."NavigationPermission" set "TenantId" = null;
update public."NoteType" set "TenantId" = null;
update public."ProgrammeType" set "TenantId" = null;
update public."Province" set "TenantId" = null;
update public."Race" set "TenantId" = null;
update public."ReasonForLeaving" set "TenantId" = null;
update public."Relation" set "TenantId" = null;
update public."SystemSetting" set "TenantId" = null;
update public."WorkflowStatus" set "TenantId" = null;
update public."WorkflowStatusType" set "TenantId" = null;


-- now prepare the base values for ecdconnect but insert no TenantId, leave null


update "Tenant" set "SiteAddress" = 'localhost' where "ApplicationName" = 'Funda';