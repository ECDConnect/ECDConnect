ALTER TABLE "AspNetUsers" ADD "WhatsAppNumber" text NULL;
ALTER TABLE "SiteAddress" ADD "Municipality" text NULL;
ALTER TABLE "SiteAddress" ADD "Area" text NULL;
ALTER TABLE "Practitioner" ADD "IsClubOwner" bool NULL;

ALTER TABLE "AspNetUsers" ADD "PreferredCommunicationLanguage" text NULL;
ALTER TABLE "AspNetUsers" ADD "NextOfKinFirstName" text NULL;
ALTER TABLE "AspNetUsers" ADD "NextOfKinSurname" text NULL;
ALTER TABLE "AspNetUsers" ADD "NextOfKinContactNumber" text NULL;