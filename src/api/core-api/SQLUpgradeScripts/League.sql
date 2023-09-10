/*CREATE TABLE public."League" (
	"Id" uuid NOT NULL,
	"Name" text NOT NULL,
	"LeagueTypeId" uuid not null,
	"IsActive" bool NOT NULL DEFAULT true,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NOT NULL,
	CONSTRAINT "PK_League" PRIMARY KEY ("Id")
);

ALTER TABLE public."League" ADD CONSTRAINT "FK_League_LeagueTypeId" FOREIGN KEY ("LeagueTypeId") REFERENCES "LeagueType"("Id");

*/