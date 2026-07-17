-- Attendance uniqueness is per programme/user/week/year (not date).
-- Adding Year prevents collisions across calendar years for the same week number.

-- Backfill Year from AttendanceDate where missing or zero
UPDATE public."Attendance"
SET "Year" = EXTRACT(YEAR FROM "AttendanceDate")::int
WHERE "Year" IS NULL OR "Year" = 0;

-- Drop existing composite PK and recreate including Year
ALTER TABLE public."Attendance" DROP CONSTRAINT IF EXISTS "PK_Attendance";

ALTER TABLE public."Attendance"
ADD CONSTRAINT "PK_Attendance"
PRIMARY KEY ("ClassroomProgrammeId", "UserId", "WeekOfYear", "Year");
