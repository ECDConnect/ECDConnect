/*CREATE TABLE public."MeetingType" (
	"Id" uuid NOT NULL,
	"Name" text NOT NULL,
	"NormalizedName" text NULL,
	"Description" text NULL,
	"IsActive" bool NOT NULL DEFAULT true,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NOT NULL,
	CONSTRAINT "PK_MeetingType" PRIMARY KEY ("Id")
);

INSERT INTO public."MeetingType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('d1995f82-9314-445e-9f8a-48c6c2557273', 'coaching_circle', 'Coaching Circle', '', true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');

INSERT INTO public."MeetingType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('106532ea-2d00-44b1-84ac-0a36c95cc0b1', 'club_meeting', 'Club Meeting', '', true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');


*/
