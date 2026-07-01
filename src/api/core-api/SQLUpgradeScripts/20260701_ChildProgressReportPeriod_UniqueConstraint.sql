/*
  Migration: Prevent duplicate active ChildProgressReportPeriods for the same
  classroom + reporting window.

  This supports the "multiple concurrent sessions" feature (EC-4459), extending
  the report-level guard added in 20250530_ChildProgressReport_UniqueConstraint.sql
  to the reporting periods themselves.

  A practitioner logged in on two devices could each create a separate SET of
  reporting periods for the same classroom (each device generating its own GUIDs).
  Because reports are keyed by ChildProgressReportPeriodId, the two devices would
  then write reports against different period ids and the report-level unique index
  would NOT recognise them as duplicates. Collapsing duplicate periods is therefore
  a prerequisite for the report-level guard to hold.

  Strategy:
  1. Rank active periods per (ClassroomId, StartDate); the most recently modified wins.
  2. Repoint any reports on a losing period to the winning period, deactivating the
     report instead if the child already has an active report on the winner (so we
     never introduce a duplicate that violates UX_ChildProgressReport_...).
  3. Deactivate the losing periods.
  4. Add a partial unique index that only enforces uniqueness on active periods.
*/

BEGIN;

-- ============================================================================
-- STEP 1: Rank active periods per (ClassroomId, StartDate) and build the
-- losing -> winning period mapping.
-- ============================================================================

CREATE TEMP TABLE _period_dedup ON COMMIT DROP AS
WITH ranked_periods AS (
    SELECT
        "Id",
        "ClassroomId",
        "StartDate",
        ROW_NUMBER() OVER (
            PARTITION BY "ClassroomId", "StartDate"
            ORDER BY
                COALESCE("UpdatedDate", "InsertedDate") DESC,
                "InsertedDate" DESC
        ) AS rn,
        FIRST_VALUE("Id") OVER (
            PARTITION BY "ClassroomId", "StartDate"
            ORDER BY
                COALESCE("UpdatedDate", "InsertedDate") DESC,
                "InsertedDate" DESC
        ) AS winner_id
    FROM "ChildProgressReportPeriod"
    WHERE "IsActive" = true
)
SELECT "Id" AS losing_id, winner_id
FROM ranked_periods
WHERE rn > 1;

-- ============================================================================
-- STEP 2a: For reports on a losing period where the child ALREADY has an active
-- report on the winning period, deactivate the losing report (would otherwise
-- collide with UX_ChildProgressReport_ChildId_Period_Active).
-- ============================================================================

UPDATE "ChildProgressReport" AS c
SET
    "IsActive" = false,
    "UpdatedDate" = NOW(),
    "UpdatedBy" = 'dedup-migration-20260701'
FROM _period_dedup d
WHERE
    c."ChildProgressReportPeriodId" = d.losing_id
    AND c."IsActive" = true
    AND EXISTS (
        SELECT 1
        FROM "ChildProgressReport" w
        WHERE w."ChildId" = c."ChildId"
          AND w."ChildProgressReportPeriodId" = d.winner_id
          AND w."IsActive" = true
    );

-- ============================================================================
-- STEP 2b: Repoint the remaining reports from the losing period to the winner.
-- ============================================================================

UPDATE "ChildProgressReport" AS c
SET
    "ChildProgressReportPeriodId" = d.winner_id,
    "UpdatedDate" = NOW(),
    "UpdatedBy" = 'dedup-migration-20260701'
FROM _period_dedup d
WHERE
    c."ChildProgressReportPeriodId" = d.losing_id
    AND c."IsActive" = true;

-- ============================================================================
-- STEP 3: Deactivate the losing periods.
-- ============================================================================

UPDATE "ChildProgressReportPeriod" AS p
SET
    "IsActive" = false,
    "UpdatedDate" = NOW(),
    "UpdatedBy" = 'dedup-migration-20260701'
FROM _period_dedup d
WHERE p."Id" = d.losing_id;

-- ============================================================================
-- STEP 4: Add partial unique index.
-- Guarantees at most one active period per (Classroom + StartDate) going forward.
-- Deactivated (historical/superseded) periods may still duplicate.
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS "UX_ChildProgressReportPeriod_Classroom_StartDate_Active"
    ON "ChildProgressReportPeriod" ("ClassroomId", "StartDate")
    WHERE "IsActive" = true;

COMMIT;

-- Post-deployment note:
-- After this script, each classroom retains a single active period per start date
-- (the most recently edited), and any reports that referenced a deactivated
-- duplicate period have been repointed to the winning period (or deactivated where
-- that would have collided with an existing active report).
