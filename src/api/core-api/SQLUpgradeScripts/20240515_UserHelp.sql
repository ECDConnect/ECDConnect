create table public."UserHelp" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" uuid null,
	"Subject" text null,
	"Description" text null,
	"ContactPreference" text null,
	"CellNumber" text null,
	"Email" text null,
	"IsLoggedIn" bool default true,
	CONSTRAINT "PK_UserHelp" PRIMARY KEY ("Id")
);

ALTER TABLE "UserHelp" ADD CONSTRAINT "FK_UserHelp_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;
 