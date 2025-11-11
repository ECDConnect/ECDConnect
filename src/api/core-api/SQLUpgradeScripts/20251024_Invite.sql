CREATE TABLE public."Invite" (
    "Id" uuid NOT NULL,
    "InsertedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedBy" text NULL,
    "TenantId" uuid NULL,
    "IsActive" bool DEFAULT TRUE,
    "IsAccepted" bool NULL,
    "Status" text NOT NULL,
    "AcceptedDate" timestamp NULL,
    "RejectedDate" timestamp NULL,
    "PractitionerId" uuid NULL,
    "PrincipalId" uuid NOT NULL,
    "UserId" uuid NULL,
    CONSTRAINT "PK_Invite" PRIMARY KEY ("Id")
);

ALTER TABLE public."Invite" 
ADD CONSTRAINT "FK_Invite_Practitioner" 
FOREIGN KEY ("PractitionerId") 
REFERENCES public."Practitioner"("Id") 
ON DELETE RESTRICT;

ALTER TABLE public."Invite" 
ADD CONSTRAINT "FK_Invite_PrincipalPractitioner" 
FOREIGN KEY ("PrincipalId") 
REFERENCES public."Practitioner"("Id") 
ON DELETE RESTRICT;

ALTER TABLE public."Invite" 
ADD CONSTRAINT "FK_Invite_UserId" 
FOREIGN KEY ("UserId") 
REFERENCES public."AspNetUsers"("Id") 
ON DELETE RESTRICT;

CREATE INDEX "IX_Invite_UserId" ON public."Invite" ("UserId");
CREATE INDEX "IX_Invite_PrincipalId" ON public."Invite" ("PrincipalId");
CREATE INDEX "IX_Invite_Status" ON public."Invite" ("Status") WHERE "IsActive" = true;