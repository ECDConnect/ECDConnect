create table public."ChildProgressReportPeriod" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"ClassroomId" uuid NOT NULL,
	"StartDate" timestamp NOT NULL,
	"EndDate" timestamp NOT NULL,	
	CONSTRAINT "PK_ChildProgressReportPeriod" PRIMARY KEY ("Id")
);

ALTER TABLE "ChildProgressReportPeriod" ADD CONSTRAINT "FK_ChildProgressReportPeriod_ClassroomId" FOREIGN KEY ("ClassroomId") REFERENCES "Classroom"("Id") ON DELETE RESTRICT;
 