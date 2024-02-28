CREATE TABLE public."District" (
    "Id" uuid NOT null,
    "IsActive" bool NOT NULL,
    "InsertedDate" timestamp NOT NULL,
    "UpdatedDate" timestamp NOT NULL,
    "UpdatedBy" text NULL,
    "Name" text NULL,
    "ProvinceId" uuid not NULL,
    "TenantId" uuid NULL,
    CONSTRAINT "PK_District" PRIMARY KEY ("Id")
);
ALTER TABLE public."District" ADD CONSTRAINT "FK_District_ProvinceId" FOREIGN KEY ("ProvinceId") REFERENCES "Province"("Id");

CREATE TABLE public."SubDistrict" (
    "Id" uuid NOT null,
    "IsActive" bool NOT NULL,
    "InsertedDate" timestamp NOT NULL,
    "UpdatedDate" timestamp NOT NULL,
    "UpdatedBy" text NULL,
    "Name" text NULL,
    "DistrictId" uuid not NULL,
    "TenantId" uuid NULL,
    CONSTRAINT "PK_SubDistrict" PRIMARY KEY ("Id")
);
ALTER TABLE public."SubDistrict" ADD CONSTRAINT "FK_SubDistrict_DistrictId" FOREIGN KEY ("DistrictId") REFERENCES "District"("Id");

CREATE TABLE public."ClinicTeamLead" (
    "Id" uuid NOT null,
    "IsActive" bool NOT NULL,
    "InsertedDate" timestamp NOT NULL,
    "UpdatedDate" timestamp NOT NULL,
    "UpdatedBy" text NULL,
    "ClinicId" uuid not NULL,
    "TeamLeadId" uuid not NULL,
    "TenantId" uuid NULL,
    CONSTRAINT "PK_ClinicTeamLead" PRIMARY KEY ("Id")
);
ALTER TABLE public."ClinicTeamLead" ADD CONSTRAINT "FK_ClinicTeamLead_ClinicId" FOREIGN KEY ("ClinicId") REFERENCES "Clinic"("Id");
ALTER TABLE public."ClinicTeamLead" ADD CONSTRAINT "FK_ClinicTeamLead_TeamLeadId" FOREIGN KEY ("TeamLeadId") REFERENCES "TeamLead"("Id");

-- We want to keep history on clinics and leagues 
CREATE TABLE public."ClinicLeague" (
    "Id" uuid NOT null,
    "IsActive" bool NOT NULL,
    "InsertedDate" timestamp NOT NULL,
    "UpdatedDate" timestamp NOT NULL,
    "UpdatedBy" text NULL,
    "ClinicId" uuid not NULL,
    "LeagueId" uuid not NULL,
    "TenantId" uuid NULL,
    CONSTRAINT "PK_ClinicLeague" PRIMARY KEY ("Id")
);
ALTER TABLE public."ClinicLeague" ADD CONSTRAINT "FK_ClinicLeague_ClinicId" FOREIGN KEY ("ClinicId") REFERENCES "Clinic"("Id");
ALTER TABLE public."ClinicLeague" ADD CONSTRAINT "FK_ClinicLeague_LeagueId" FOREIGN KEY ("LeagueId") REFERENCES "League"("Id");

ALTER TABLE public."Clinic" ADD "SubDistrictId" uuid NULL;
ALTER TABLE public."Clinic" ADD CONSTRAINT "FK_Clinic_SubDistrictId" FOREIGN KEY ("SubDistrictId") REFERENCES "SubDistrict"("Id");

ALTER TABLE public."HealthCareWorker" ADD "ClinicId" uuid NULL;
ALTER TABLE public."HealthCareWorker" ADD CONSTRAINT "FK_HealthCareWorker_ClinicId" FOREIGN KEY ("ClinicId") REFERENCES "Clinic"("Id");
alter table public."HealthCareWorker" add "ClickedTeamTab" bool not null default false;

ALTER TABLE public."League" ADD "StartDate" timestamp NULL;
ALTER TABLE public."League" ADD "EndDate" timestamp NULL;

ALTER TABLE public."TeamLead" DROP column "ClinicId";
ALTER TABLE public."HealthCareWorker" DROP column "TeamLeadId";