CREATE TABLE public."UserLanguages" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" uuid NOT NULL,
	"LanguageId" uuid NOT NULL,
	CONSTRAINT "PK_UserLanguages" PRIMARY KEY ("Id")
);


ALTER TABLE public."UserLanguages" ADD CONSTRAINT "FK_UserLanguages_LanguageId" FOREIGN KEY ("LanguageId") REFERENCES public."Language"("Id") ON DELETE RESTRICT;
ALTER TABLE public."UserLanguages" ADD CONSTRAINT "FK_UserLanguages_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;

-- populate table from child table
insert into "UserLanguages" ("Id", "LanguageId", "UserId", "TenantId", "InsertedDate", "UpdatedDate", "IsActive")
select uuid_generate_v4(), c."LanguageId", c."UserId", c."TenantId", c."InsertedDate", c."UpdatedDate", true
from "Child" c where c."LanguageId"  is not null

