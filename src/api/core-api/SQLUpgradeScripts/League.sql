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

ALTER TABLE public."League" ADD CONSTRAINT "FK_League_LeagueTypeId" FOREIGN KEY ("LeagueTypeId") REFERENCES "LeagueType"("Id") ON DELETE CASCADE;

INSERT INTO public."League"
("Id", "Name", "LeagueTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('3d983a39-989b-483e-ac5d-a919a6fffb5b', 'Purple', '5860171d-88e8-4973-a9ee-51bb74af2d2a' , true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');

INSERT INTO public."League"
("Id", "Name", "LeagueTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('64d39693-914c-4006-9edd-c74662908306', 'New Stars', '5860171d-88e8-4973-a9ee-51bb74af2d2a' , true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');

INSERT INTO public."League"
("Id", "Name", "LeagueTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('24674267-335a-4d77-95b0-93a54e7c1d91', 'Rising Stars', '5860171d-88e8-4973-a9ee-51bb74af2d2a' , true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');
*/