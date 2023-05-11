
ALTER TABLE "AspNetUsers" ADD "WhatsAppNumber" text NULL;
ALTER TABLE "SiteAddress" ADD "Municipality" text NULL;
ALTER TABLE "SiteAddress" ADD "Area" text NULL;
ALTER TABLE "Practitioner" ADD "IsClubOwner" bool NULL;

ALTER TABLE "AspNetUsers" ADD "PreferredCommunicationLanguage" text NULL;
ALTER TABLE "AspNetUsers" ADD "NextOfKinFirstName" text NULL;
ALTER TABLE "AspNetUsers" ADD "NextOfKinSurname" text NULL;
ALTER TABLE "AspNetUsers" ADD "NextOfKinContactNumber" text NULL;

ALTER TABLE "Child" ADD "StartDate" timestamp NULL;
ALTER TABLE "Child" ADD "PlaygroupGroup" varchar NULL;
ALTER TABLE "Child" ADD "InactiveDate" timestamp NULL;
ALTER TABLE "Child" ADD "InactiveReason" text NULL;
ALTER TABLE "Child" ADD "InactivityComments" text NULL;

ALTER TABLE "IntegrationAudit" ADD "RelatedId" text NOT NULL;
ALTER TABLE "AspNetUsers" ADD "IsImported" bool NULL;
ALTER TABLE "IntegrationEntityMapping" ADD "Notes" text NULL;