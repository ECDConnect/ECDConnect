ALTER TABLE public."AppLog" 
ADD COLUMN IF NOT EXISTS "AppVersion" text NULL;