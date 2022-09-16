-- Drop table
-- DROP TABLE public."HealthCareWorker";
CREATE TABLE public."HealthCareWorker" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"ConsentForPhoto" bool NULL,
	"UserId" text NULL,
	"LanguageId" uuid NULL,
	"SiteAddressId" uuid NULL,
	"TeamLeadId" text NULL,
	"EmergancyContactPerson" text NULL,
	"EmergancyContactNumber" text NULL,
	CONSTRAINT "PK_HealthCareWorker" PRIMARY KEY ("Id")
);
-- public."HealthCareWorker" foreign keys
ALTER TABLE public."HealthCareWorker" ADD CONSTRAINT "FK_HealthCareWorker_Language_LanguageId" FOREIGN KEY ("LanguageId") REFERENCES public."Language"("Id") ON DELETE RESTRICT;
ALTER TABLE public."HealthCareWorker" ADD CONSTRAINT "FK_HealthCareWorker_SiteAddress_SiteaddresId" FOREIGN KEY ("SiteAddressId") REFERENCES public."SiteAddress"("Id") ON DELETE RESTRICT;
-- public."Mother" definition
-- Drop table
-- DROP TABLE public."Mother";
CREATE TABLE public."Mother" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"SiteAddressId" uuid NULL,
	"ExpectedDateOfDelivery" timestamp NULL,
	"HealthCareWorkerId" uuid NULL,
	"WhatsAppNumber" text NULL,
	"Age" text NULL,
	"UserId" text NULL,
	CONSTRAINT pk_mother PRIMARY KEY ("Id")
);
-- public."Mother" foreign keys
ALTER TABLE public."Mother" ADD CONSTRAINT "FK_Mother_HealthCareWorker" FOREIGN KEY ("HealthCareWorkerId") REFERENCES public."HealthCareWorker"("Id");
ALTER TABLE public."Mother" ADD CONSTRAINT "FK_Mother_SiteAddres_SiteAddressId" FOREIGN KEY ("SiteAddressId") REFERENCES public."SiteAddress"("Id");
-- public."Infant" definition
-- Drop table
-- DROP TABLE public."Infant";
CREATE TABLE public."Infant" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"WeightAtBirth" numeric NULL,
	"LengthAtBirth" numeric NULL,
	"GenderId" uuid NULL,
	"UserId" text NULL,
	"CaregiverId" uuid NULL,
	CONSTRAINT "PK_Child_1" PRIMARY KEY ("Id")
);
-- public."Infant" foreign keys
ALTER TABLE public."Infant" ADD CONSTRAINT "FK_Infant_CareGiverId" FOREIGN KEY ("CaregiverId") REFERENCES public."Caregiver"("Id");
ALTER TABLE public."Infant" ADD CONSTRAINT "FK_Infant_GenderId" FOREIGN KEY ("GenderId") REFERENCES public."Gender"("Id");
-- public."Caregiver" definition
-- Drop table
-- DROP TABLE public."Caregiver";
ALTER TABLE public."Caregiver"
ADD	"HealthCareWorkerId" uuid null,
ADD	"Age" text null,
ADD	"WhatsAppNumber" text null;
-- public."Caregiver" foreign keys
ALTER TABLE public."Caregiver" ADD CONSTRAINT "FK_Caregiver_HealthCareWorkerId" FOREIGN KEY ("HealthCareWorkerId") REFERENCES public."HealthCareWorker"("Id");


ALTER TABLE public."HealthCareWorker" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Mother" ADD COLUMN IF NOT exists "TenantId" uuid NULL;
ALTER TABLE public."Infant" ADD COLUMN IF NOT exists "TenantId" uuid NULL;

update public."HealthCareWorker" set "TenantId" = (select "Id" from "Tenant" where "ApplicationName" = 'GrowGreat');
update public."HealthCareWorker" set "TenantId" = (select "Id" from "Tenant" where "ApplicationName" = 'GrowGreat');
update public."HealthCareWorker" set "TenantId" = (select "Id" from "Tenant" where "ApplicationName" = 'GrowGreat');