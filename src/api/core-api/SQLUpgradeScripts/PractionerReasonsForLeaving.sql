
create table public."ReasonForPractitionerLeaving" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"Description" text not null,
	CONSTRAINT "PK_ReasonForLeavingPractitioner" PRIMARY KEY ("Id")
);

INSERT INTO public."ReasonForPractitionerLeaving"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('06eefbbd-ee77-4d02-9dae-dea3608742c9', true, NOW(), NOW(), null, null, 'Could not find children');
INSERT INTO public."ReasonForPractitionerLeaving"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('512e06fb-5805-4207-9b87-4fba4ea00f12', true, NOW(), NOW(), null, null, 'Not interested in ECD');
INSERT INTO public."ReasonForPractitionerLeaving"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('d7c94ba2-9279-47cb-8d9d-f5b80b1fc70a', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Relocated');
INSERT INTO public."ReasonForPractitionerLeaving"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('eb87cca4-e28b-4398-910f-dc60dcbbfafb', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Problems with venue');
INSERT INTO public."ReasonForPractitionerLeaving"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('b86630e9-9a6d-43cf-8545-63a8b1ed62aa', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Moved to other CWP');
INSERT INTO public."ReasonForPractitionerLeaving"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('2611dab8-52a2-4212-910d-f203a05e1ea0', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Health issues');
INSERT INTO public."ReasonForPractitionerLeaving"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('951a0a16-5b95-4d6c-aa99-3a3a072e9b6c', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Went back to school');
INSERT INTO public."ReasonForPractitionerLeaving"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('258c3081-746c-4cf8-af7e-b2c8fa37820e', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Not enough income');
INSERT INTO public."ReasonForPractitionerLeaving"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('4ad4e79f-9446-4584-94d8-484e16c6336c', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Delicensed');
INSERT INTO public."ReasonForPractitionerLeaving"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('001b8ef4-92e5-4d29-8bb4-edb5332346ee', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Did not complete onboarding');
INSERT INTO public."ReasonForPractitionerLeaving"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Description")
VALUES('528d108a-b70a-4cbb-943e-f799cecceba6', true, NOW(), '0001-01-01 00:00:00.000', null, null, 'Other');    


ALTER TABLE public."Practitioner" ADD "ReasonForLeavingDetails" text NULL;
ALTER TABLE public."Practitioner" ADD "ReasonForPractitionerLeavingId" uuid NULL;
ALTER TABLE public."Practitioner" ADD CONSTRAINT "FK_Practitioner_ReasonForPractitionerLeaving_ReasonForPractitionerLeavingId" FOREIGN KEY ("ReasonForPractitionerLeavingId") REFERENCES public."ReasonForPractitionerLeaving"("Id") ON DELETE RESTRICT;
