-- Move admin comment from back referral to visit data status
ALTER TABLE public."VisitBackReferral" DROP column "AdminComment";
ALTER TABLE public."VisitDataStatus" ADD "BackReferralAdminComment" text NULL;


-- Add Referral Type table and linking table to visit data status
CREATE TABLE public."ReferralType" (
    "Id" uuid NOT null,
    "IsActive" bool NOT NULL,
    "InsertedDate" timestamp NOT NULL,
    "UpdatedDate" timestamp NOT NULL,
    "UpdatedBy" text NULL,
    "Name" text NULL,
    "TenantId" uuid NULL,
    CONSTRAINT "PK_ReferralType" PRIMARY KEY ("Id")
);

CREATE TABLE public."VisitDataStatusReferralType" (
    "Id" uuid NOT null,
    "IsActive" bool NOT NULL,
    "InsertedDate" timestamp NOT NULL,
    "UpdatedDate" timestamp NOT NULL,
    "UpdatedBy" text NULL,
    "TenantId" uuid NULL,
    "ReferralTypeId" uuid not NULL,
    "VisitDataStatusId" uuid not NULL,
    CONSTRAINT "PK_VisitDataStatusReferralType" PRIMARY KEY ("Id")
);
ALTER TABLE public."VisitDataStatusReferralType" ADD CONSTRAINT "FK_VisitDataStatusReferralType_ReferralTypeId" FOREIGN KEY ("ReferralTypeId") REFERENCES "ReferralType"("Id");
ALTER TABLE public."VisitDataStatusReferralType" ADD CONSTRAINT "FK_VisitDataStatusReferralType_VisitDataStatusId" FOREIGN KEY ("VisitDataStatusId") REFERENCES "VisitDataStatus"("Id");


-- Insert referral type
INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Early identification of pregnancy', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Child support grant', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Developmental delays', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Maternal distress', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Severly underweight', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Vitamin A not up to date', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Clinic visits not up to date', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Danger signs - child''s mother', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Danger signs - pregnant mom', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Maternal malnutrition', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Substance abuse', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Danger signs - child', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Caregiver ID book', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Severe acute malnutrition', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Severly stunted', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Low birth weight', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Growth faltering', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Underweight', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Overweight', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Obese', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Low birth length', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Stunted', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Moderate acute malnutrition', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Deworming not up to date', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Immunisation not up to date', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."ReferralType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "TenantId")
VALUES(uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', 'Child birth certificate', '39077d0e-e443-4076-aaf2-978dc6805aa0');
