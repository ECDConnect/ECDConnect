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
	 ALTER TABLE public."IntegrationColumnMapping" ADD "EntityDataType" text NULL;

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



INSERT INTO "IntegrationEntityMapping" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","UserId","LocalEntity","RemoteEntity","LocalId","RemoteId","IntegrationSystem","LastUpdatedDate","LastCheckedDate","BeforeJSON","AfterJSON","TenantId","IsComplete","Notes","EntityGrouping") VALUES
	 ('6cb08e37-738a-517f-ed7b-2abb3a354bf8',true,'2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'ChildBirthCertificate','Child Birth Certificate','5c464272-2f22-438f-8154-4aa1ff8bf047','0d06836c-d2fa-ed11-8354-00155dee5a05','SmartLink','2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8',true,NULL,'DocumentType'),
	 ('fefbb983-9d0c-146d-2f1c-0b85e4b42b2e',true,'2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'ChildRegistrationForm','Child Registration Form','5c37eb53-b528-4dfc-9814-5d2aa14e5298','78ec9b65-20dd-ed11-8354-00155dee5a05','SmartLink','2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8',true,NULL,'DocumentType'),
	 ('f1e3843a-70f2-2389-1d1e-59b4514c09e4',true,'2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'AttendancePDF','Monthly Attendance Register','5258d1f1-f9b6-e571-cbbe-067f4a823c8c','0b887bae-f2ef-ed11-8354-00155dee5a05','SmartLink','2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8',true,NULL,'DocumentType'),
	 ('7f0a7d74-c44c-e2d8-5f56-9fbeff8f33ba',true,'2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'IncomeStatementPDF','Income Statement','9aae913e-47f8-45c7-a0ff-142dd425cf94','85de53bd-8426-ec11-834e-00155dee5a05','SmartLink','2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8',true,NULL,'DocumentType'),
	 ('d088a1c9-9112-2aed-bf31-62cc317ce812',true,'2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'Practitioner','Franchisee Agreement','2d8ee3b4-6bc5-473b-85c1-4c3214c15671','0d06836c-d2fa-ed11-8354-00155dee5a05','SmartLink','2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8',true,NULL,'DocumentType'),
	 ('edd1479a-55fb-ff82-a86f-a6efbbd3a531',true,'2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'Practitioner','Identity Document','2d8ee3b4-6bc5-473b-85c1-4c3214c15671','891d084f-9394-ec11-834e-00155dee5a05','SmartLink','2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8',true,NULL,'DocumentType'),
	 ('6b47bba4-fb36-22b9-126b-e555d6969c06',true,'2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'Practitioner','Stipend Agreement','2d8ee3b4-6bc5-473b-85c1-4c3214c15671','bf8ca50e-8526-ec11-834e-00155dee5a05','SmartLink','2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8',true,NULL,'DocumentType'),
	 ('01930d35-6dcf-6da2-8fde-448f873d1fb4',true,'2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'Practitioner','Attendance Register','2d8ee3b4-6bc5-473b-85c1-4c3214c15671','fc22a1a8-8226-ec11-834e-00155dee5a05','SmartLink','2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8',true,NULL,'DocumentType'),
	 ('82d0084e-367e-4790-4652-07265e4f65e4',true,'2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'Practitioner','Proof of Account','2d8ee3b4-6bc5-473b-85c1-4c3214c15671','7f1c1f22-a925-ec11-834e-00155dee5a05','SmartLink','2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8',true,NULL,'DocumentType'),
	 ('f42e13d2-8dd4-0a32-e2d1-764cb7501f5a',true,'2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'Practitioner','Proof of Site Address','2d8ee3b4-6bc5-473b-85c1-4c3214c15671','accea691-9394-ec11-834e-00155dee5a05','SmartLink','2023-05-27 22:50:37.794','2023-05-27 22:50:37.794',NULL,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8',true,NULL,'DocumentType');


	INSERT INTO "DocumentType" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Name","Description","EnumId","TenantId") VALUES
	 ('5c37eb53-b528-4dfc-9814-5d2aa14e5298',true,NOW(),NOW(),NULL,'ChildRegistrationForm','Child Registration Form',17,'258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('fe6c6e71-1eb7-424a-8844-5bab1c60104c',true,NOW(),NOW(),NULL,'ChildClinicCard','Child Clinic Card',18,'258a15e6-3736-45ea-875c-48d9377de4c8'),
	('5c464272-2f22-438f-8154-4aa1ff8bf047',true,NOW(),NOW(),NULL,'ChildBirthCertificate','Child Birth Certificate',19,'258a15e6-3736-45ea-875c-48d9377de4c8');


	update "Document" set "DocumentTypeId" = (select "Id" from "DocumentType" where "Name" = 'ChildRegistrationForm') where "DocumentTypeId" = (select "Id" from "DocumentType" where "Name" = 'Child') and "Name" = 'F4-registrationform.png';
update "Document" set "DocumentTypeId" = (select "Id" from "DocumentType" where "Name" = 'ChildBirthCertificate') where "DocumentTypeId" = (select "Id" from "DocumentType" where "Name" = 'Child') and "Name" = 'birthCertificate.png';
update "Document" set "DocumentTypeId" = (select "Id" from "DocumentType" where "Name" = 'ChildClinicCard') where "DocumentTypeId" = (select "Id" from "DocumentType" where "Name" = 'Child') and "Name" = 'clinicCard.png';
	 */