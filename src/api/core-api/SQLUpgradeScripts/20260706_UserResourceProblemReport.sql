CREATE TABLE public."UserResourceProblemReport" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" uuid NOT NULL,
	"ContentId" int NOT NULL,
	"ProblemType" text NOT NULL,
	"AdditionalDetails" text NULL,
	"DataFreeAtReport" text NULL,
	"LinkAtReport" text NULL,
	CONSTRAINT "PK_UserResourceProblemReport" PRIMARY KEY ("Id")
);

ALTER TABLE public."UserResourceProblemReport" ADD CONSTRAINT "FK_UserResourceProblemReport_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;