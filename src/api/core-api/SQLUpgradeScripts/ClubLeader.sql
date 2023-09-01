CREATE TABLE public."ClubLeader" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"ClubId" uuid not NULL,
	"PractitionerId" uuid not NULL,
	"DateAssigned" timestamp null,
	"DateAccepted" timestamp null,
	CONSTRAINT "PK_ClubLeader" PRIMARY KEY ("Id")
);

ALTER TABLE public."ClubLeader" ADD CONSTRAINT "FK_ClubLeader_ClubId" FOREIGN KEY ("ClubId") REFERENCES public."Club"("Id");
ALTER TABLE public."ClubLeader" ADD CONSTRAINT "FK_ClubLeader_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");