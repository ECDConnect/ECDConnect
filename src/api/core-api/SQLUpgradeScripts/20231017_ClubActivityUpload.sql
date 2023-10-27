
CREATE TABLE public."ClubActivityUpload" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"ClubId" uuid NOT NULL,
	"Description" text NULL,
	"DocumentId" uuid NOT NULL,
	"ActivityType" text NULL,
	"Month" int4 NULL,
	"Year" int4 NULL,
	"ImageApproved" bool NULL DEFAULT false,
	CONSTRAINT "PK_ClubActivityUpload" PRIMARY KEY ("Id")
);


-- public."ClubActivityUpload" foreign keys

ALTER TABLE public."ClubActivityUpload" ADD CONSTRAINT "FK_ClubActivityUpload_ClubId" FOREIGN KEY ("ClubId") REFERENCES public."Club"("Id");
ALTER TABLE public."ClubActivityUpload" ADD CONSTRAINT "FK_ClubActivityUpload_DocumentId" FOREIGN KEY ("DocumentId") REFERENCES public."Document"("Id");