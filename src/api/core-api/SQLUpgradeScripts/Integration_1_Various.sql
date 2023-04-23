/*

CREATE TABLE "IntegrationColumnMapping" (
	"Id" uuid NOT NULL,
	"LocalColumn" text NULL,
	"RemoteColumn" text NULL,
	"IntegrationSystem" text NULL,
	"LocalEntity" text NULL,
	"RemoteEntity" text NULL,
	CONSTRAINT "PK_IntegrationSSColumnMapping" PRIMARY KEY ("Id")
);

CREATE TABLE "IntegrationAudit" (
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

CREATE TABLE "IntegrationEntityMapping" (
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

INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.UrlShortner','General.Proxies.UrlShortner.RedirectUrl','RedirectUrl','https://ecd-connect-develop-api.azurewebsites.net',true,true,'2023-04-03 13:56:51.790','2023-04-03 13:56:51.790',NULL,'ded52f9f-2603-40d8-ae49-0525121096e6'),
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.BaseUrl','BaseUrl','https://devapi.smartstart.org.za/v1/',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8'),
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.Mode','Mode','PushPull',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.MaskDataMode','MaskDataMode','MaskEmailsAndNumbers',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.MaskDataNumber','MaskDataNumber','0626725196',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8'),
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.MaskDataEmail','MaskDataEmail','tiaan@ecdconnect.co.za',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8'),
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.Proxies.Integration.SmartLinkApi','General.Proxies.Integration.SmartLinkApi.MaskDataIdNumber','MaskDataIdNumber','0000000000081',true,true,'2022-10-31 07:39:37.330','2022-10-31 07:39:37.330',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
	




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


	 */