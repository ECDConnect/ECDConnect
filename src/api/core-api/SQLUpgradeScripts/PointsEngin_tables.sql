/*CREATE TABLE "PointsLibrary" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL DEFAULT true,
	"InsertedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"Activity" text NOT NULL,
	"SubActivity" text NOT NULL,
	"Points" numeric NULL,
	"MaxPointsIndividualMonthly" numeric NULL,
	"MaxPointsNonPrincipalMonthly" numeric NULL DEFAULT 0,
	"MaxPointsNonPrincipalYearly" numeric NULL DEFAULT 0,
	"MaxPointsPrincipalMonthly" numeric NULL DEFAULT 0,
	"MaxPointsPrincipalYearly" numeric NULL DEFAULT 0,
	"CalculatedAtMonthEnd" bool NOT NULL DEFAULT false,
	"CalculatedAtYearEnd" bool NOT NULL DEFAULT false,
	"Description" text NULL,
	CONSTRAINT "PK_PointsLibrary" PRIMARY KEY ("Id")
);

CREATE TABLE "PointsUser" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" text NOT NULL,
	"PointsLibraryId" uuid NOT NULL,
	"Month" numeric NOT NULL,
	"Year" numeric NOT NULL,
	"Points" numeric NULL,
	"Comment" text NULL,
	CONSTRAINT "PK_PointsUser" PRIMARY KEY ("Id")
);
ALTER TABLE "PointsUser" ADD CONSTRAINT "PK_PointsUser_PointsLibraryId" FOREIGN KEY ("PointsLibraryId") REFERENCES "PointsLibrary"("Id") ON DELETE RESTRICT;
ALTER TABLE "PointsUser" ADD CONSTRAINT "PK_PointsUser_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;


CREATE TABLE "PointsUserSummary" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" text NOT NULL,
	"PointsLibraryId" uuid NOT NULL,
	"Month" numeric NOT NULL,
	"Year" numeric NOT NULL,
	"PointsTotal" numeric NULL DEFAULT 0,
	"PointsYTD" numeric NULL DEFAULT 0,
	CONSTRAINT "PK_PointsUserSummary" PRIMARY KEY ("Id")
);

ALTER TABLE "PointsUserSummary" ADD CONSTRAINT "PK_PointsUserSummary_PointsLibraryId" FOREIGN KEY ("PointsLibraryId") REFERENCES "PointsLibrary"("Id") ON DELETE RESTRICT;
ALTER TABLE "PointsUserSummary" ADD CONSTRAINT "PK_PointsUserSummary_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;
*/