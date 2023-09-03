
CREATE TABLE public."ClubMember" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"ClubId" uuid not NULL,
	"PractitionerId" uuid not NULL,
	"IsNewInClub" bool not null default false,
	"DateClubJoined" timestamp NOT NULL,
	"WelcomeMessage" text null,
	CONSTRAINT "PK_ClubMember" PRIMARY KEY ("Id")
);

ALTER TABLE public."ClubMember" ADD CONSTRAINT "FK_ClubMember_ClubId" FOREIGN KEY ("ClubId") REFERENCES public."Club"("Id");
ALTER TABLE public."ClubMember" ADD CONSTRAINT "FK_ClubMember_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");
