
create table public."ReasonForPractitionerLeavingProgramme" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"Description" text not null,
	CONSTRAINT "PK_ReasonForLeavingPractitionerPrograme" PRIMARY KEY ("Id")
);

INSERT INTO public."ReasonForPractitionerLeavingProgramme"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('279da107-c186-4976-9ba5-9f316c1964f5', true, NOW(), NOW(), null, null, 'Moving to another Smart Start programme');
INSERT INTO public."ReasonForPractitionerLeavingProgramme"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('d8fea570-6c50-43ce-846c-8a2a2c522da4', true, NOW(), NOW(), null, null, 'Moving to a non-Smart Start programme');
INSERT INTO public."ReasonForPractitionerLeavingProgramme"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('779871a1-4351-423d-86fe-949eb2200146', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Has taken a non-ECD job');
INSERT INTO public."ReasonForPractitionerLeavingProgramme"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('5c786db8-35a9-4731-b370-d70847eaf400', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Relocated');
INSERT INTO public."ReasonForPractitionerLeavingProgramme"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('f90e80b4-e9da-43c9-adcf-4d2c156a22b7', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Does not want to do this work anymore');
INSERT INTO public."ReasonForPractitionerLeavingProgramme"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('7049458d-cd48-4e74-883d-9b984e65feee', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Other');   

create table public."PractitionerRemovalHistory" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" text not null,
	"ClassroomId" uuid not null,
	"RemovedByUserId" text not null,
	"ReasonForPractitionerLeavingProgrammeId" uuid not null,
	"ReasonDetails" text not null,
	"DateOfRemoval" timestamp NOT NULL,
	CONSTRAINT "PK_PractitionerRemovalHistory" PRIMARY KEY ("Id")	
);

ALTER TABLE "PractitionerRemovalHistory" ADD CONSTRAINT "FK_PractitionerRemovalHistory_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;
ALTER TABLE "PractitionerRemovalHistory" ADD CONSTRAINT "FK_PractitionerRemovalHistory_RemovedByUserId" FOREIGN KEY ("RemovedByUserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;
ALTER TABLE "PractitionerRemovalHistory" ADD CONSTRAINT "FK_PractitionerRemovalHistory_ClassroomId" FOREIGN KEY ("ClassroomId") REFERENCES "Classroom"("Id") ON DELETE RESTRICT;
ALTER TABLE "PractitionerRemovalHistory" ADD CONSTRAINT "FK_PractitionerRemovalHistory_ReasonForPractitionerLeavingProgrammeId" FOREIGN KEY ("ReasonForPractitionerLeavingProgrammeId") REFERENCES "ReasonForPractitionerLeavingProgramme"("Id") ON DELETE RESTRICT;


ALTER TABLE public."Absentees" ADD "PractitionerRemovalHistoryId" uuid NULL;
ALTER TABLE public."Absentees" ADD CONSTRAINT "FK_Absentees_PractitionerRemovalHistory_PractitionerRemovalHistoryId" FOREIGN KEY ("PractitionerRemovalHistoryId") REFERENCES public."PractitionerRemovalHistory"("Id") ON DELETE RESTRICT;
