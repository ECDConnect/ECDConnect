/*

CREATE TABLE public."IntegrationColumnMapping" (
	"Id" uuid NOT NULL,
	"LocalColumn" text NULL,
	"RemoteColumn" text NULL,
	"IntegrationSystem" text NULL,
	"LocalEntity" text NULL,
	"RemoteEntity" text NULL,
	"IsActive" bool NOT NULL DEFAULT true,
	"UpdatedBy" text NULL,
	"UpdatedDate" timestamp NULL,
	"InsertedDate" timestamp NULL,
	"TenantId" uuid NULL,
	"UpdateDirection" text NULL DEFAULT 'Both'::text,
	"EntityGrouping" text NULL,
	CONSTRAINT "PK_IntegrationSSColumnMapping" PRIMARY KEY ("Id")
);

CREATE TABLE public."IntegrationAudit" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"UserId" text NULL,
	"Entity" text NOT NULL,
	"Property" text NULL,
	"Submitted" timestamp NULL,
	"ValueBefore" text NULL,
	"ValueAfter" text NULL,
	"TenantId" uuid NULL,
	"ChangeType" text NULL DEFAULT 'Update'::text,
	"RelatedId" text NOT NULL,
	CONSTRAINT "PK_IntegrationAudit" PRIMARY KEY ("Id")
);

CREATE TABLE public."IntegrationEntityMapping" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"UserId" text NULL,
	"LocalEntity" text NULL,
	"RemoteEntity" text NULL,
	"LocalId" text NULL,
	"RemoteId" text NULL,
	"IntegrationSystem" text NULL,
	"LastUpdatedDate" timestamp NOT NULL,
	"LastCheckedDate" timestamp NOT NULL,
	"BeforeJSON" text NULL,
	"AfterJSON" text NULL,
	"TenantId" uuid NULL,
	"IsComplete" bool NULL,
	"Notes" text NULL,
	CONSTRAINT "PK_IntegrationMapping" PRIMARY KEY ("Id")
);

CREATE TABLE public."IntegrationLog" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"UserId" text NULL,
	"TenantId" uuid NULL,
	"RelatedId" text NULL,
	"RelatedType" text NOT NULL,
	"LogNotes" text NULL,
	"LogResult" text NULL,
	CONSTRAINT "PK_IntegrationLog" PRIMARY KEY ("Id")
);

INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.UrlShortner','General.Proxies.UrlShortner.RedirectUrl','RedirectUrl','https://ecd-connect-develop-api.azurewebsites.net',true,true,'2023-04-03 13:56:51.790','2023-04-03 13:56:51.790',NULL,'ded52f9f-2603-40d8-ae49-0525121096e6'),
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.BaseUrl','BaseUrl','https://devapi.smartstart.org.za/v1/',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8'),
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.Mode','Mode','PushPull',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.MaskDataMode','MaskDataMode','MaskEmailsAndNumbers',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.MaskDataNumber','MaskDataNumber','0626725196',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8'),
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.MaskDataEmail','MaskDataEmail','tiaan@ecdconnect.co.za',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8'),
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.MaskDataIdNumber','MaskDataIdNumber','0000000000081',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
	

	ALTER TABLE public."AspNetUsers" ADD "ReasonForLeaving" text NULL;
ALTER TABLE public."AspNetUsers" ADD "ReasonForLeavingComments" text NULL;

ALTER TABLE public."Practitioner" ADD "AttendedChildProgress" bool NULL;
ALTER TABLE public."Practitioner" ADD "AttendedBusinessSkills" bool NULL;

	INSERT INTO "IntegrationColumnMapping" ("Id","LocalColumn","RemoteColumn","IntegrationSystem","LocalEntity","RemoteEntity","IsActive","UpdatedBy","UpdatedDate","InsertedDate","TenantId","UpdateDirection") VALUES
	(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'FullName','FullName','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'), 
	(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'FirstName ','FirstName ','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'Surname','Surname','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'IdNumber','IdNumber','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'Allergies','AllergyType','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'Disabilities','DisabilityType','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'Allergies','HealthConditions','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'OtherHealthConditions','AllergyType','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'EmergencyContactPhoneNumber','EmergencyContactNumber','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'EmergencyContactFirstName','EmergencyContactFirstName','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'EmergencyContactSurname','EmergencyContactSurname','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'EmergencyContactFullName','EmergencyContactFullName','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'StartDate','StartDate','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'PersonalInformationAgreement','CaregiverPopiaConsent','Smartlink','UserConsent','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'PhotoPermissions','CaregiverPhotographyAndFilmingConsent','Smartlink','UserConsent','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'IsSouthAfricanCitizen','IsSouthAfricanCitizen','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'RaceId','EthnicGroup','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'LanguageId','HomeLanguage','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'GrantId','GrantType','Smartlink','UserGrants','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
  	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'PlaygroupGroup','PlaygroupGroup','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'StartDate','StartDate','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'InactiveReason','InactiveReason','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'InactiveDate','InactiveDate','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'InactivityComments','InactivityComments','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'), 	 
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'GenderId','Gender','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both');
	 
		INSERT INTO "IntegrationColumnMapping" ("Id","LocalColumn","RemoteColumn","IntegrationSystem","LocalEntity","RemoteEntity","IsActive","UpdatedBy","UpdatedDate","InsertedDate","TenantId","UpdateDirection") VALUES
	(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'FullName','FullName','Smartlink','Caregiver','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'), 
	(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'FirstName ','FirstName ','Smartlink','Caregiver','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'Surname','Surname','Smartlink','Caregiver','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'IdNumber','IdNumber','Smartlink','Caregiver','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'PhoneNumber','ContactNumber','Smartlink','Caregiver','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'EmergencyContactSurname','EmergencyContactSurname','Smartlink','Caregiver','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'EmergencyContactFirstName','EmergencyContactFirstname','Smartlink','Caregiver','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'EmergencyContactPhoneNumber','EmergencyContactPhoneNumber','Smartlink','Caregiver','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'AddressLine1','HomeAddressLine1','Smartlink','SiteAddress','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'AddressLine2','HomeAddressLine2','Smartlink','SiteAddress','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'AddressLine3','HomeAddressLine3','Smartlink','SiteAddress','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'PostalCode','HomeAddressPostalCode','Smartlink','SiteAddress','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'ProvinceId','Province','Smartlink','SiteAddress','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'RelationId','RelationshipType','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'EducationId','HighestEducationLevel','Smartlink','UserConsent','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'LanguageId','Language','Smartlink','UserConsent','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
	 
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'IsActive','Status','Smartlink','Child','Child',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'IsActive','Status','Smartlink','Caregiver','Caregiver',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'IsActive','Status','Smartlink','Practitioner','Franchisee',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
  	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'IsActive','Status','Smartlink','Coach','Coach',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both'),
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'IsActive','Status','Smartlink','SiteAddress','SiteAddress',true,NULL,'2022-12-05 00:00:00.000','2022-12-05 00:00:00.000',NULL,'Both');

	 INSERT INTO public."ReasonForLeaving" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Description","TenantId") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Personal reasons',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Franchisee is uncontactable',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'No stipend or income',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Venue problems',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'ECD opportunities',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Not receiving support from coach',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'No children',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Went back to school',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Health problems',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'No longer interested',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Parents dont pay fees',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Other CWP',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Employment',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Relocated',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Red PQA',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Deceased',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Maternity leave',NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,'2022-01-31 07:39:36.986','0001-01-01 00:00:00.000',NULL,'Other',NULL);


	 ALTER TABLE public."IntegrationEntityMapping" ADD "EntityGrouping" text NULL;
	 ALTER TABLE public."Practitioner" ADD "StipendType" varchar NULL;

	 INSERT INTO "DocumentType" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Name","Description","EnumId","TenantId") VALUES
	 ('5258d1f1-f9b6-e571-cbbe-067f4a823c8c',true,'2023-05-10 12:04:40.889','2023-05-10 12:04:40.889',NULL,'AttendancePDF','Saving an attendance pdf',16,'258a15e6-3736-45ea-875c-48d9377de4c8');

	 CREATE TABLE public."Trainee" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"Hierarchy" text NULL,
	"StartDate" timestamp NULL,
	"TraineeConvertedDate" timestamp NULL,
	"ConsolidationMeetingDate" timestamp NULL,
	"ChildrenAddedDate" timestamp NULL,
	"UserId" text NULL,
	"LinkedPrincipalHierarchy" uuid NULL,
	"TenantId" uuid NULL,
	"Progress" numeric NOT NULL DEFAULT 0,
	"ProgrammeType" text NULL,
	"PractitionerId" uuid NOT NULL,
	"AttendedFirstAidCourse" bool NULL,
	"SiteVisitsCompleted" bool NULL,
	"ChildProgressTraining" bool NULL,
	"StarterLicenceReceived" bool NULL,
	"PlayKitReceived" bool NULL,
	"AdminFileReceived" bool NULL,
	"SmartSpaceVisitPassed" bool NULL,
	"AttendedStartUpTraining" bool NULL,
	"IsOnStipend" bool NULL,
	"IsSmartSpaceVisitValidated" bool NULL,
	"IsAdminFileAndPlaykitValidated" bool NULL,
	"HighestEducationLevel" text NULL,
	"SiteArea" text NULL,
	CONSTRAINT "PK_Trainee" PRIMARY KEY ("Id"),
	CONSTRAINT "FK_Trainee_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT
);
CREATE INDEX "IX_Trainee_UserId" ON public."Trainee" USING btree ("UserId");



INSERT INTO "IntegrationEntityMapping" ("Id","IsActive","InsertedDate","UpdatedDate","LastUpdatedDate", "LastCheckedDate", "LocalEntity","RemoteEntity","LocalId","RemoteId","IntegrationSystem","TenantId","IsComplete", "EntityGrouping") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NOW(),NOW(),'Child','Child Birth Certificate',(select "Id" from "DocumentType" where "Name" = 'Child'),'0d06836c-d2fa-ed11-8354-00155dee5a05','SmartLink','258a15e6-3736-45ea-875c-48d9377de4c8',true, 'DocumentType'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NOW(),NOW(),'Child','Child Registration Form',(select "Id" from "DocumentType" where "Name" = 'Child'),'78ec9b65-20dd-ed11-8354-00155dee5a05','SmartLink','258a15e6-3736-45ea-875c-48d9377de4c8',true, 'DocumentType'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NOW(),NOW(),'AttendancePDF','Monthly Attendance Register',(select "Id" from "DocumentType" where "Name" = 'AttendancePDF'),'0b887bae-f2ef-ed11-8354-00155dee5a05','SmartLink','258a15e6-3736-45ea-875c-48d9377de4c8',true, 'DocumentType'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NOW(),NOW(),'IncomeStatementPDF','Income Statement',(select "Id" from "DocumentType" where "Name" = 'IncomeStatementPDF'),'85de53bd-8426-ec11-834e-00155dee5a05','SmartLink','258a15e6-3736-45ea-875c-48d9377de4c8',true, 'DocumentType'),	 
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NOW(),NOW(),'Practitioner','Franchisee Agreement',(select "Id" from "DocumentType" where "Name" = 'Practitioner'),'0d06836c-d2fa-ed11-8354-00155dee5a05','SmartLink','258a15e6-3736-45ea-875c-48d9377de4c8',true, 'DocumentType'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NOW(),NOW(),'Practitioner','Identity Document',(select "Id" from "DocumentType" where "Name" = 'Practitioner'),'891d084f-9394-ec11-834e-00155dee5a05','SmartLink','258a15e6-3736-45ea-875c-48d9377de4c8',true, 'DocumentType'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NOW(),NOW(),'Practitioner','Stipend Agreement',(select "Id" from "DocumentType" where "Name" = 'Practitioner'),'bf8ca50e-8526-ec11-834e-00155dee5a05','SmartLink','258a15e6-3736-45ea-875c-48d9377de4c8',true, 'DocumentType'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NOW(),NOW(),'Practitioner','Attendance Register',(select "Id" from "DocumentType" where "Name" = 'Practitioner'),'fc22a1a8-8226-ec11-834e-00155dee5a05','SmartLink','258a15e6-3736-45ea-875c-48d9377de4c8',true, 'DocumentType'), 
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NOW(),NOW(),'Practitioner','Proof of Account',(select "Id" from "DocumentType" where "Name" = 'Practitioner'),'7f1c1f22-a925-ec11-834e-00155dee5a05','SmartLink','258a15e6-3736-45ea-875c-48d9377de4c8',true, 'DocumentType'),
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NOW(),NOW(),'Practitioner','Proof of Site Address',(select "Id" from "DocumentType" where "Name" = 'Practitioner'),'accea691-9394-ec11-834e-00155dee5a05','SmartLink','258a15e6-3736-45ea-875c-48d9377de4c8',true, 'DocumentType');
 	
	 */