
ALTER TABLE public."EcdRegistration"
    ADD COLUMN IF NOT EXISTS "InitialCertificates" text NULL;
