ALTER TABLE public."Attendance" 
ADD COLUMN IF NOT EXISTS "InsertedDate" timestamp NULL;
ALTER TABLE public."Attendance" 
ADD COLUMN IF NOT EXISTS "UpdatedDate" timestamp NULL;