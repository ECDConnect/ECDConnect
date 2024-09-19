CREATE TABLE public."UserResourceLikes" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" uuid NULL,
	"ContentId" int NOT NULL,
	"ContentValueId" int NOT NULL,
	CONSTRAINT "PK_UserResourceLikes" PRIMARY KEY ("Id")
);

ALTER TABLE public."UserResourceLikes" ADD CONSTRAINT "FK_UserResourceLikes_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;
ALTER TABLE public."UserResourceLikes" ADD CONSTRAINT "FK_UserResourceLikes_ContentValueId" FOREIGN KEY ("ContentValueId") REFERENCES public."ContentValue"("Id") ON DELETE CASCADE;
