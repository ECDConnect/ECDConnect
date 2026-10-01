-- 1. Make CompletedDate nullable
ALTER TABLE public."UserTrainingCourse" 
    ALTER COLUMN "CompletedDate" DROP NOT NULL;

-- 2. Add the new columns
ALTER TABLE public."UserTrainingCourse"
    ADD COLUMN "StartedDate"          timestamp     NULL,
    ADD COLUMN "ProgressPercentage"   numeric(5,2)  NOT NULL DEFAULT 0,
    ADD COLUMN "LastActivityDate"     timestamp     NULL,
    ADD COLUMN "ExternalCourseId"     varchar(50)   NULL,
    ADD COLUMN "Status"               varchar(20)   NOT NULL DEFAULT 'Completed';  -- existing rows were completed

-- 3. Back-fill StartedDate for existing completed records (best-effort)
UPDATE public."UserTrainingCourse"
SET "StartedDate" = "CompletedDate"   -- or leave NULL if you prefer
WHERE "StartedDate" IS NULL;

-- 4. Add the new indexes
CREATE INDEX "IX_UserTrainingCourse_TenantId_StartedDate" 
    ON public."UserTrainingCourse" USING btree ("TenantId", "StartedDate");

CREATE INDEX "IX_UserTrainingCourse_UserId_Status" 
    ON public."UserTrainingCourse" USING btree ("UserId", "Status");

CREATE INDEX "IX_UserTrainingCourse_ExternalCourseId" 
    ON public."UserTrainingCourse" USING btree ("ExternalCourseId");