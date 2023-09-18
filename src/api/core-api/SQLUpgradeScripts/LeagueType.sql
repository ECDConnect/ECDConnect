/*CREATE TABLE public."LeagueType" (
	"Id" uuid NOT NULL,
	"Name" text NOT NULL,
	"NormalizedName" text NULL,
	"Description" text NULL,
	"IsActive" bool NOT NULL DEFAULT true,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NOT NULL,
	CONSTRAINT "PK_LeagueType" PRIMARY KEY ("Id")
);

INSERT INTO public."LeagueType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('5860171d-88e8-4973-a9ee-51bb74af2d2a', 'sl', 'SL', '', true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');

INSERT INTO public."LeagueType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('1a396225-8465-4091-a974-9a76b02bf9df', 'fa', 'FA', '', true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');
*/
