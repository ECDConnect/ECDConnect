
CREATE TABLE public."CoachContact" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"UserId" uuid NOT NULL,
	"TenantId" uuid NULL,
	"PractitionerId" uuid NOT NULL,
	"CoachId" uuid NOT NULL,
	"ActionItemType" int NOT NULL,
	"Period" timestamp NOT NULL,
	"ContactedDate" timestamp NOT NULL,
	CONSTRAINT "PK_CoachContact" PRIMARY KEY ("Id")
);

CREATE UNIQUE INDEX idx_coach_contacts_unique
    ON "CoachContact" ("CoachId", "PractitionerId", "ActionItemType", "Period");

ALTER TABLE public."CoachContact" ADD CONSTRAINT "FK_CoachContact_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id") ON DELETE RESTRICT;
ALTER TABLE public."CoachContact" ADD CONSTRAINT "FK_CoachContact_CoachId" FOREIGN KEY ("CoachId") REFERENCES public."Coach"("Id") ON DELETE RESTRICT;
ALTER TABLE public."CoachContact" ADD CONSTRAINT "FK_CoachContact_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;
