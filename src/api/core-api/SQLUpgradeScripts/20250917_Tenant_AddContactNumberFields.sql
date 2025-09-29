
ALTER TABLE "Tenant" ADD IF NOT EXISTS "OrganisationHelpPhoneNumber" TEXT;
ALTER TABLE "Tenant" ADD IF NOT EXISTS "OrganisationHelpWhatsAppNumber" TEXT;

UPDATE "Tenant" SET "OrganisationHelpPhoneNumber" = '0800 014 817';
UPDATE "Tenant" SET "OrganisationHelpWhatsAppNumber" = '27834071970' WHERE "TenantTypeId" = 1;
