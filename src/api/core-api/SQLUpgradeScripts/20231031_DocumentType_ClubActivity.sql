INSERT INTO "DocumentType" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Name","Description","EnumId","TenantId") VALUES
('c71f3ca2-5d72-4a76-a456-f6c07a217bf2',true,'2023-10-31','2023-10-31',NULL,'ClubActivityUpload','Club Activity Upload',25,'258a15e6-3736-45ea-875c-48d9377de4c8');


CREATE TABLE public."ClubActivityUploadType" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"Name" text NULL,
	"Description" text NULL,
	"EnumId" int4 NOT NULL,
	"TenantId" uuid NULL,
	CONSTRAINT "PK_ClubActivityUploadType" PRIMARY KEY ("Id")
);

INSERT INTO public."ClubActivityUploadType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "Description", "EnumId", "TenantId")
VALUES('fbdb6ead-e88f-4cff-8743-f62c6f4ae939', true, current_timestamp, current_timestamp, '', 'BeCreative', 'Be creative', 0, '258a15e6-3736-45ea-875c-48d9377de4c8');


ALTER TABLE public."ClubActivityUpload" RENAME COLUMN "ActivityType" TO "ClubActivityUploadTypeId";
ALTER TABLE public."ClubActivityUpload" ALTER COLUMN "ClubActivityUploadTypeId" TYPE uuid USING "ClubActivityUploadTypeId"::uuid::uuid;
ALTER TABLE public."ClubActivityUpload" ADD CONSTRAINT "FK_ClubActivityUpload_ClubActivityUploadTypeId" FOREIGN KEY ("ClubActivityUploadTypeId") REFERENCES "ClubActivityUploadType"("Id");


ALTER TABLE public."ClubActivityUpload" ADD "ImageRating" numeric NOT NULL DEFAULT '-100000000000'::bigint;