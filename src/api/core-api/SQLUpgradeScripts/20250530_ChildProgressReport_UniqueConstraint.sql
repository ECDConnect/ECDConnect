/*
  Migration: Prevent duplicate active ChildProgressReports for the same child + reporting period.

  This supports the "multiple concurrent sessions" feature (EC-4459).
  A practitioner logged in on two devices can now no longer create two separate
  progress reports for the same child in the same reporting period.

  Strategy:
  1. Clean up any existing duplicates (keep the most recently modified active report).
  2. Add a partial unique index that only enforces uniqueness on active records.
*/

BEGIN;

-- ============================================================================
-- STEP 1: De-duplicate existing data
-- For any (ChildId, ChildProgressReportPeriodId) that has more than one active row,
-- keep only the most recently updated one and deactivate the rest.
-- ============================================================================

WITH ranked_reports AS (
    SELECT 
        "Id",
        "ChildId",
        "ChildProgressReportPeriodId",
        ROW_NUMBER() OVER (
            PARTITION BY "ChildId", "ChildProgressReportPeriodId"
            ORDER BY 
                COALESCE("UpdatedDate", "InsertedDate") DESC,
                "InsertedDate" DESC
        ) AS rn
    FROM "ChildProgressReport"
    WHERE "IsActive" = true
)
UPDATE "ChildProgressReport" AS c
SET 
    "IsActive" = false,
    "UpdatedDate" = NOW(),
    "UpdatedBy" = 'dedup-migration-20250530'
FROM ranked_reports r
WHERE 
    c."Id" = r."Id" 
    AND r.rn > 1;

-- ============================================================================
-- STEP 2: Add partial unique index
-- This guarantees at most one active report per (Child + Period) going forward.
-- Deactivated (historical/soft-deleted) reports are allowed to have duplicates.
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS "UX_ChildProgressReport_ChildId_Period_Active"
    ON "ChildProgressReport" ("ChildId", "ChildProgressReportPeriodId")
    WHERE "IsActive" = true;

COMMIT;

-- Post-deployment note:
-- After running this script, any previously created duplicate reports for the same
-- child+period will have been deactivated. The UI will only see the "winning" one
-- (the most recently edited). This is acceptable for the rare duplicate case.