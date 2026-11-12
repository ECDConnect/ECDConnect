/*
  EC-4641 - Retire duplicate (orphan) Classroom rows.

  Background
  ----------
  add-programme-form.tsx minted a new Classroom id whenever redux held no
  classroom, and the loop that was meant to move the existing ClassroomGroups
  onto it wrote the stale (undefined) `classroom?.id` instead. The generic
  mutation resolver upserts, so the new id became a real row rather than
  failing. Result: a principal owns two active Classroom rows - an empty new
  one and the original one that still holds all the ClassroomGroups.

  GetClassroomForUser returns OrderByDescending(InsertedDate).FirstOrDefault(),
  so it hands back the empty classroom, and childrenForClassroom resolves zero
  children. GetClassroomGroupsForUser spans every classroom the user owns, so
  the classes still render - producing "You don't have any children allocated
  to classes yet!" on the attendance tab.

  Fix applied here (matches the verified manual fix)
  --------------------------------------------------
  For each affected principal, keep the classroom that holds the active groups
  and neutralise the orphan by setting IsActive = false AND clearing UserId,
  Hierarchy and PreschoolCode. Deactivation alone is not sufficient because
  several queries do not check IsActive - notably ValidatePreSchoolCode, which
  filters on PreschoolCode only.

  PreschoolCode note
  ------------------
  Because GetClassroomForUser was returning the orphan, the principal's app has
  been *displaying the orphan's* preschool code. Clearing it is mandatory (an
  orphan with UserId = NULL would otherwise return "Preschool found" and then
  invite against userId: null), but it does mean any practitioner holding that
  code will need the survivor's code instead. Step 3 reports both codes per
  principal so they can be notified. The carry-over in step 5 is deliberately
  conservative: it only fills a survivor field that is currently NULL, so a
  preschool code that is already working is never overwritten.

  Run order: steps 1-3 are read-only. Review the step 3 output against the
  known affected users BEFORE running steps 4-6.
*/

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Identify survivor / orphan pairs
--    survivor = earliest-inserted active classroom that has active groups
--    orphan   = any other active classroom of that user with no active groups
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE ec4641_pairs AS
WITH survivors AS (
    SELECT DISTINCT ON (c."UserId")
           c."UserId" AS user_id,
           c."Id"     AS survivor_id
    FROM   "Classroom" c
    JOIN   "ClassroomGroup" g
        ON g."ClassroomId" = c."Id"
       AND g."IsActive"
    WHERE  c."IsActive"
      AND  c."UserId" IS NOT NULL
    ORDER  BY c."UserId", c."InsertedDate" ASC
)
SELECT s.user_id,
       s.survivor_id,
       c."Id" AS orphan_id
FROM   survivors s
JOIN   "Classroom" c
    ON c."UserId" = s.user_id
WHERE  c."IsActive"
  AND  c."Id" <> s.survivor_id
  AND  NOT EXISTS (
           SELECT 1 FROM "ClassroomGroup" g
           WHERE  g."ClassroomId" = c."Id"
             AND  g."IsActive");

-- Optional: restrict to a known list of principals instead of every match.
-- DELETE FROM ec4641_pairs WHERE user_id NOT IN ('<user-id>', '<user-id>');

-- ---------------------------------------------------------------------------
-- 2. Backup every row this script will touch
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS "ClassroomBak_EC4641";
CREATE TABLE "ClassroomBak_EC4641" AS
SELECT c.*
FROM   "Classroom" c
WHERE  c."Id" IN (SELECT orphan_id   FROM ec4641_pairs
                  UNION
                  SELECT survivor_id FROM ec4641_pairs);

-- ---------------------------------------------------------------------------
-- 3. Pre-flight report - REVIEW THIS BEFORE CONTINUING
--    Expect one row per affected principal. Confirm the count matches the
--    number found by the detection sweep, and that no row here is a classroom
--    a principal legitimately created as a second site.
-- ---------------------------------------------------------------------------
SELECT p.user_id,
       p.survivor_id,
       sc."Name"          AS survivor_name,
       sc."PreschoolCode" AS survivor_code,
       sc."SiteAddressId" AS survivor_site_address,
       p.orphan_id,
       oc."Name"          AS orphan_name,
       oc."PreschoolCode" AS orphan_code,
       oc."SiteAddressId" AS orphan_site_address,
       oc."InsertedDate"  AS orphan_inserted,
       (SELECT count(*) FROM "ChildProgressReportPeriod" r
         WHERE r."ClassroomId" = p.orphan_id) AS orphan_report_periods,
       (SELECT count(*) FROM "Programme" pr
         WHERE pr."ClassroomId" = p.orphan_id) AS orphan_programmes
FROM   ec4641_pairs p
JOIN   "Classroom" sc ON sc."Id" = p.survivor_id
JOIN   "Classroom" oc ON oc."Id" = p.orphan_id
ORDER  BY p.user_id;

-- ---------------------------------------------------------------------------
-- 4. Move anything that landed on the orphan onto the survivor
-- ---------------------------------------------------------------------------
UPDATE "ChildProgressReportPeriod" r
SET    "ClassroomId" = p.survivor_id,
       "UpdatedDate" = localtimestamp
FROM   ec4641_pairs p
WHERE  r."ClassroomId" = p.orphan_id;

UPDATE "Programme" pr
SET    "ClassroomId" = p.survivor_id,
       "UpdatedDate" = localtimestamp
FROM   ec4641_pairs p
WHERE  pr."ClassroomId" = p.orphan_id;

-- ---------------------------------------------------------------------------
-- 5. Carry over only what the survivor is missing (never overwrite a
--    populated field - a working preschool code must not change)
-- ---------------------------------------------------------------------------
UPDATE "Classroom" s
SET    "SiteAddressId" = COALESCE(s."SiteAddressId", o."SiteAddressId"),
       "PreschoolCode" = COALESCE(s."PreschoolCode", o."PreschoolCode"),
       "UpdatedDate"   = localtimestamp
FROM   ec4641_pairs p
JOIN   "Classroom" o ON o."Id" = p.orphan_id
WHERE  s."Id" = p.survivor_id
  AND (s."SiteAddressId" IS NULL OR s."PreschoolCode" IS NULL);

-- ---------------------------------------------------------------------------
-- 6. Neutralise the orphan.
--    IsActive alone is not enough - clearing UserId and Hierarchy takes it out
--    of every ownership- and hierarchy-scoped query, and clearing
--    PreschoolCode takes it out of ValidatePreSchoolCode.
-- ---------------------------------------------------------------------------
UPDATE "Classroom" c
SET    "IsActive"      = false,
       "UserId"        = NULL,
       "Hierarchy"     = NULL,
       "PreschoolCode" = NULL,
       "UpdatedDate"   = localtimestamp
FROM   ec4641_pairs p
WHERE  c."Id" = p.orphan_id;

COMMIT;

-- ---------------------------------------------------------------------------
-- 7. Verification - re-run the detector. Expect zero rows.
-- ---------------------------------------------------------------------------
WITH ranked AS (
    SELECT c.*, row_number() OVER (PARTITION BY c."UserId"
                                   ORDER BY c."InsertedDate" DESC) AS rn
    FROM   "Classroom" c
    WHERE  c."IsActive"
      AND  c."UserId" IS NOT NULL
)
SELECT r."UserId", r."Id" AS newest_empty_classroom, r."InsertedDate"
FROM   ranked r
WHERE  r.rn = 1
  AND  NOT EXISTS (SELECT 1 FROM "ClassroomGroup" g
                   WHERE g."ClassroomId" = r."Id" AND g."IsActive")
  AND  EXISTS (SELECT 1 FROM "Classroom" c2
               JOIN "ClassroomGroup" g2 ON g2."ClassroomId" = c2."Id"
               WHERE c2."UserId" = r."UserId"
                 AND c2."IsActive" AND g2."IsActive");

-- Rollback for a single principal, if ever needed:
-- UPDATE "Classroom" c
-- SET    "IsActive"      = b."IsActive",
--        "UserId"        = b."UserId",
--        "Hierarchy"     = b."Hierarchy",
--        "PreschoolCode" = b."PreschoolCode"
-- FROM   "ClassroomBak_EC4641" b
-- WHERE  c."Id" = b."Id" AND b."UserId" = '<user-id>';
