ALTER TABLE public."Visit" 
ADD COLUMN IF NOT EXISTS "CertificateName" text NULL;
ALTER TABLE public."Visit" 
ADD COLUMN IF NOT EXISTS "CertificateRegNr" text NULL;
ALTER TABLE public."Visit" 
ADD COLUMN IF NOT EXISTS "CertificateCreated" timestamp NULL;