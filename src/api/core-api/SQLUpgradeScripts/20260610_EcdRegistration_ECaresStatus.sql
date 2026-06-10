
ALTER TABLE public."EcdRegistration"
    ADD COLUMN IF NOT EXISTS "ECaresStatus" text NULL;
