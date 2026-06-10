/*
  Migration: Enforce only one active Learner per child at any time.

  Business rule:
  - A child (identified by UserId) may only have ONE active Learner record.
  - Active = IsActive = true AND StoppedAttendance IS NULL.

  This prevents duplicate active class assignments, which can occur
  when practitioners are logged in on multiple devices simultaneously
  (offline-first + no session limiting).

  Approach:
  1. Cleanup existing duplicates (keep the most recent active learner per child).
  2. Add a partial unique index that only applies to active learners.
*/

BEGIN;

-- ============================================================================
-- STEP 1: Clean up existing duplicate active learners
-- For each child (UserId), keep only the most recently started active learner.
-- Deactivate all others.
-- ============================================================================

WITH ranked_learners AS (
    SELECT 
        "Id",
        "UserId",
        "ClassroomGroupId",
        "StartedAttendance",
        ROW_NUMBER() OVER (
            PARTITION BY "UserId"
            ORDER BY "StartedAttendance" DESC, 
                     COALESCE("UpdatedDate", "InsertedDate") DESC
        ) AS rn
    FROM "Learner"
    WHERE "IsActive" = true 
      AND "StoppedAttendance" IS NULL
)
UPDATE "Learner" AS l
SET 
    "IsActive" = false,
    "StoppedAttendance" = NOW(),
    "UpdatedDate" = NOW(),
    "UpdatedBy" = 'dedup-migration-20250530'
FROM ranked_learners r
WHERE 
    l."Id" = r."Id" 
    AND r.rn > 1;

-- ============================================================================
-- STEP 2: Add partial unique index
-- This guarantees at most one active learner per child going forward.
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS "UX_Learner_OneActiveLearnerPerChild"
    ON "Learner" ("UserId")
    WHERE "IsActive" = true 
      AND "StoppedAttendance" IS NULL;

COMMIT;

-- Notes for ops:
-- - After running, any child that previously had multiple active learners
--   will now only have the one with the latest StartedAttendance marked active.
-- - Historical (stopped) learners are unaffected.
-- - This index works together with application-level logic for best results.