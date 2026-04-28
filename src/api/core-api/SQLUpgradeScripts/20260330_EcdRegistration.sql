-- =============================================
-- ECD Registration Tables
-- =============================================

-- 1. Main Registration Table
CREATE TABLE IF NOT EXISTS public."EcdRegistration" (
    "Id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "IsActive" boolean NOT NULL DEFAULT true,
    "InsertedDate" timestamptz NOT NULL DEFAULT now(),
    "UpdatedDate" timestamptz NOT NULL DEFAULT now(),
    "UpdatedBy" text NOT NULL,
    "TenantId" uuid NULL,
    "UserId" uuid NULL,
    "PractitionerId" uuid NOT NULL,
    "Subsidy" text NOT NULL,
    "RegistrationType" text NULL,
    "Challenges" text NOT NULL,
    "ChallengesOtherReason" text NULL,
    "ProblemDescription" text NOT NULL,
    "HasBronzeCertificate" boolean NOT NULL DEFAULT false,
    "HasSilverCertificate" boolean NOT NULL DEFAULT false,
    "HasGoldCertificate" boolean NOT NULL DEFAULT false,

    CONSTRAINT "CK_EcdRegistration_ChallengesOther" 
        CHECK (
            ("Challenges" = 'Other' AND "ChallengesOtherReason" IS NOT NULL) 
            OR ("Challenges" != 'Other' AND "ChallengesOtherReason" IS NULL)
        )
);

ALTER TABLE public."EcdRegistration"
    ADD CONSTRAINT "FK_EcdRegistration_AspNetUsers" 
    FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE SET NULL;

ALTER TABLE public."EcdRegistration"
    ADD CONSTRAINT "FK_EcdRegistration_Practitioner" 
    FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "IX_EcdRegistration_PractitionerId" ON public."EcdRegistration"("PractitionerId");
CREATE INDEX IF NOT EXISTS "IX_EcdRegistration_Subsidy" ON public."EcdRegistration"("Subsidy");

CREATE TABLE IF NOT EXISTS public."EcdRegistrationHistory" (
    "Id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "IsActive" boolean NOT NULL DEFAULT true,
    "InsertedDate" timestamptz NOT NULL DEFAULT now(),
    "UpdatedDate" timestamptz NOT NULL DEFAULT now(),
    "UpdatedBy" text NOT NULL,
    "TenantId" uuid NULL,
    "EcdRegistrationId" uuid NOT NULL,
    "UserId" uuid NULL,
    "PropertyName" text NOT NULL,
    "OldValue" jsonb NULL,
    "NewValue" jsonb NULL,
    "ChangeReason" text NULL
);

ALTER TABLE public."EcdRegistrationHistory"
    ADD CONSTRAINT "FK_EcdRegistrationHistory_EcdRegistration" 
    FOREIGN KEY ("EcdRegistrationId") REFERENCES public."EcdRegistration"("Id") ON DELETE CASCADE;

ALTER TABLE public."EcdRegistrationHistory"
    ADD CONSTRAINT "FK_EcdRegistrationHistory_AspNetUsers" 
    FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE SET NULL;

-- =============================================
-- Indexes
-- =============================================

CREATE INDEX IF NOT EXISTS "IX_EcdRegistration_PractitionerId" 
    ON public."EcdRegistration"("PractitionerId");

CREATE INDEX IF NOT EXISTS "IX_EcdRegistration_UserId" 
    ON public."EcdRegistration"("UserId");

CREATE INDEX IF NOT EXISTS "IX_EcdRegistration_Subsidy" 
    ON public."EcdRegistration"("Subsidy");

CREATE INDEX IF NOT EXISTS "IX_EcdRegistrationHistory_EcdRegistrationId" 
    ON public."EcdRegistrationHistory"("EcdRegistrationId");

INSERT INTO "Permission" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Name","NormalizedName","Grouping","TenantId") VALUES
	 ('a320a46f-3e00-4a8e-b7c7-f09629ed5d07',true,current_date,current_date, NULL,'view_registration','View Registration','Registration',NULL),
	 ('06edbd89-60ca-409d-a65d-a8fc6283cc53',true,current_date,current_date,NULL,'update_registration','Update Registration','Registration',NULL),
	 ('affdd04f-85bc-4bb3-b123-e9a80bcbd56e',true,current_date,current_date,NULL,'create_registration','Create Registration','Registration',NULL),
	 ('87da9e98-c977-4a72-9da0-9e3df7932c4b',true,current_date,current_date,NULL,'delete_registration','Delete Registration','Registration',NULL);

INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', 'a320a46f-3e00-4a8e-b7c7-f09629ed5d07', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', '06edbd89-60ca-409d-a65d-a8fc6283cc53', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', 'affdd04f-85bc-4bb3-b123-e9a80bcbd56e', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', '87da9e98-c977-4a72-9da0-9e3df7932c4b', '258a15e6-3736-45ea-875c-48d9377de4c8');

INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('bb5e9e65-5ba0-432b-b917-a8b85d5d8f77', 'a320a46f-3e00-4a8e-b7c7-f09629ed5d07', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('bb5e9e65-5ba0-432b-b917-a8b85d5d8f77', '06edbd89-60ca-409d-a65d-a8fc6283cc53', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('bb5e9e65-5ba0-432b-b917-a8b85d5d8f77', 'affdd04f-85bc-4bb3-b123-e9a80bcbd56e', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('bb5e9e65-5ba0-432b-b917-a8b85d5d8f77', '87da9e98-c977-4a72-9da0-9e3df7932c4b', 'e8f571eb-1972-4e71-a20f-347c65d059bb');


-- notification
INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_generate_v4(),true,current_date,current_date,NULL,'hub','dbe-registration','DBE registration is the first step to getting the ECD subsidy. The app can guide you through the steps.',null,'Learn about DBE registration','[[DbeRegistration]]','Get started',NULL,'blue',20,'{"url":"/business","state":{"activeTabIndex":"2"}}');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_generate_v4(),true,current_date,current_date,NULL,'push','dbe-registration','DBE registration is the first step to getting the ECD subsidy. The app can guide you through the steps.',null,'Learn about DBE registration','[[DbeRegistration]]','Get started',NULL,'blue',20,'{"url":"/business","state":{"activeTabIndex":"2"}}');
