
CREATE TABLE "PointsClinicSummary" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL DEFAULT true,
	"InsertedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"PointsCategoryId" uuid not null, 
	"DateScored" timestamp NOT NULL,
	"TimesScored" numeric NOT NULL,	
	"PointsTotal" numeric NOT NULL,	
	CONSTRAINT "PK_PointsClinicSummary" PRIMARY KEY ("Id")
);
ALTER TABLE public."PointsClinicSummary" ADD CONSTRAINT "FK_PointsClinicSummary_PointsCategoryId" FOREIGN KEY ("PointsCategoryId") REFERENCES "PointsCategory"("Id");

CREATE TABLE "BreastFeedingClub" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL DEFAULT true,
	"InsertedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"HealthCareWorkerId" uuid not null, 
	"MeetingDate" timestamp NOT NULL,
	"ClientsAttendedConfirmed" bool NOT NULL,	
	CONSTRAINT "PK_BreastFeedingClub" PRIMARY KEY ("Id")
);
ALTER TABLE public."BreastFeedingClub" ADD CONSTRAINT "FK_BreastFeedingClub_HealthCareWorkerId" FOREIGN KEY ("HealthCareWorkerId") REFERENCES "HealthCareWorker"("Id");

CREATE TABLE "BreastFeedingClubClient" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL DEFAULT true,
	"InsertedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"CaregiverId" uuid not null, 
	"BreastFeedingClubId" uuid not null, 
	CONSTRAINT "PK_BreastFeedingClubClient" PRIMARY KEY ("Id")
);
ALTER TABLE public."BreastFeedingClubClient" ADD CONSTRAINT "FK_BreastFeedingClubClient_CaregiverId" FOREIGN KEY ("CaregiverId") REFERENCES "Caregiver"("Id");
ALTER TABLE public."BreastFeedingClubClient" ADD CONSTRAINT "FK_BreastFeedingClubClient_BreastFeedingClubId" FOREIGN KEY ("BreastFeedingClubId") REFERENCES "BreastFeedingClub"("Id");