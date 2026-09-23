CREATE TABLE public."UserFlag" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" uuid NOT NULL,
	"FlagKey" text NOT NULL,
	"FlagValue" text NULL,
	CONSTRAINT "PK_UserFlag" PRIMARY KEY ("Id")
);

ALTER TABLE public."UserFlag" ADD CONSTRAINT "FK_UserFlag_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;

-- setUserFlag looks a flag up by user and key on every call, and must not be
-- able to create a second row for the same pair.
CREATE UNIQUE INDEX "UX_UserFlag_UserId_FlagKey" ON public."UserFlag" ("UserId", "FlagKey");
