ALTER TABLE public."AppLog" 
ADD COLUMN IF NOT EXISTS "Type" text NULL;
ALTER TABLE public."AppLog" 
ADD COLUMN IF NOT EXISTS "Message" text NULL;
ALTER TABLE public."AppLog" 
ADD COLUMN IF NOT EXISTS "Payload" text NULL;
ALTER TABLE public."AppLog" 
ADD COLUMN IF NOT EXISTS "ClientUrl" text NULL;
ALTER TABLE public."AppLog" 
ADD COLUMN IF NOT EXISTS "IsOnline" bool NULL DEFAULT false;
ALTER TABLE public."AppLog" 
ADD COLUMN IF NOT EXISTS "RequestPayload" text NULL;
ALTER TABLE public."AppLog" 
ADD COLUMN IF NOT EXISTS "UserAgent" text NULL;
