-- =============================================================================
-- Retrospective "course-completed" notifications
-- =============================================================================
-- Purpose:
--   The course-completed notification (TrainingNotificationService.
--   SendCourseCompletedNotificationAsync) was added AFTER many users had
--   already completed courses. Those historical completions never produced a
--   MessageLog entry. This script back-fills one notification per completed
--   course, exactly as the live code would have, for every completion that
--   does not already have a notification.
--
-- What the live code does (NotificationService.SendNotificationAsync ->
-- CommitNotification), which we replicate here:
--   * For EACH active template of type 'course-completed' (currently 'hub'
--     and 'push') it inserts one MessageLog row.
--   * To            = completed user's Id
--   * From/FromUserId/SentByUserId = tenant Administrator (HierarchyEngine.
--     GetAdminUserId(): active UserHierarchy row, UserType='Administrator',
--     lowest Key, for that tenant)
--   * Message/Subject/CTA/CTAText/Action/MessageProtocol = copied from the
--     template (none of the RemapFields tags appear in this template, so the
--     live insert stores the template text verbatim - e.g. CTA stays the
--     literal '[[CertificateDownload]]')
--   * Status        = 'green'  (MessageStatusConstants.Green)
--   * MessageDate    = CompletedDate (date only, as completedDate.Date)
--   * MessageEndDate / ReadDate / ToGroups / GroupingId = NULL
--   * IsActive       = true
--   * TenantId       = the completing user's tenant
--
-- Idempotent: re-running will not create duplicates. The NOT EXISTS guard
-- mirrors NotificationService.NotificationExists (match on To + protocol +
-- template type + MessageDate::date), so completions that were already
-- notified (e.g. processed after the feature shipped) are skipped.
--
-- Multi-tenant: runs across all tenants in one pass. To limit to a single
-- tenant, uncomment the tenant filter marked >>> TENANT FILTER <<< below.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1 (PREVIEW ONLY - safe to run on its own):
-- All users with completed courses, and whether they will get a notification.
-- Run this first and eyeball the counts before running the INSERT in STEP 2.
-- -----------------------------------------------------------------------------
-- SELECT
--     utc."TenantId",
--     utc."UserId",
--     utc."CourseName",
--     utc."CompletedDate"::date                             AS completed_date,
--     EXISTS (
--         SELECT 1 FROM "MessageLog" ml
--         WHERE ml."MessageTemplateType" = 'course-completed'
--           AND ml."To" = utc."UserId"::text
--           AND ml."IsActive"
--           AND ml."MessageDate"::date = utc."CompletedDate"::date
--     )                                                     AS already_notified
-- FROM "UserTrainingCourse" utc
-- WHERE utc."IsActive"
-- ORDER BY utc."TenantId", utc."UserId", completed_date;


-- -----------------------------------------------------------------------------
-- STEP 2: Back-fill the notifications.
-- Wrapped in a transaction. Review the RAISE NOTICE row count, then COMMIT.
-- -----------------------------------------------------------------------------
BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

WITH
-- One Administrator per tenant = the notification sender (== GetAdminUserId()).
tenant_admin AS (
    SELECT DISTINCT ON (uh."TenantId")
           uh."TenantId",
           uh."UserId" AS admin_user_id
    FROM "UserHierarchy" uh
    WHERE uh."IsActive"
      AND uh."UserType" = 'Administrator'
      AND uh."UserId" IS NOT NULL
    ORDER BY uh."TenantId", uh."Key"
),
-- Active course-completed templates (hub + push). Matches RetrieveTemplate,
-- which filters by TemplateType + IsActive only (no tenant filter).
course_templates AS (
    SELECT mt."Protocol",
           mt."Subject",
           mt."Message",
           mt."CTA",
           mt."CTAText",
           mt."Action"
    FROM "MessageTemplate" mt
    WHERE mt."TemplateType" = 'course-completed'
      AND mt."IsActive"
),
-- Every historical completion that still needs a notification, x each template.
to_insert AS (
    SELECT
        utc."UserId",
        utc."TenantId",
        utc."CompletedDate",
        ta.admin_user_id,
        ct."Protocol",
        ct."Subject",
        ct."Message",
        ct."CTA",
        ct."CTAText",
        ct."Action"
    FROM "UserTrainingCourse" utc
    JOIN tenant_admin  ta ON ta."TenantId" = utc."TenantId"
    CROSS JOIN course_templates ct
    WHERE utc."IsActive"
      -- >>> TENANT FILTER <<< uncomment to scope to one tenant:
      -- AND utc."TenantId" = '00000000-0000-0000-0000-000000000000'
      AND NOT EXISTS (
          SELECT 1
          FROM "MessageLog" ml
          WHERE ml."MessageTemplateType" = 'course-completed'
            AND ml."MessageProtocol"     = ct."Protocol"
            AND ml."To"                  = utc."UserId"::text
            AND ml."IsActive"
            AND ml."MessageDate"::date   = utc."CompletedDate"::date
      )
)
INSERT INTO "MessageLog" (
    "Id",
    "MessageTemplateType",
    "MessageProtocol",
    "From",
    "To",
    "Subject",
    "Message",
    "FromUserId",
    "SentByUserId",
    "InsertedDate",
    "UpdatedDate",
    "IsActive",
    "UpdatedBy",
    "TenantId",
    "CTA",
    "CTAText",
    "Status",
    "MessageDate",
    "MessageEndDate",
    "ReadDate",
    "ToGroups",
    "Action",
    "GroupingId"
)
SELECT
    uuid_generate_v4(),
    'course-completed',
    ti."Protocol",
    ti.admin_user_id::text,          -- From
    ti."UserId"::text,               -- To
    ti."Subject",
    ti."Message",
    ti.admin_user_id,                -- FromUserId
    ti.admin_user_id,                -- SentByUserId
    now(),                           -- InsertedDate
    now(),                           -- UpdatedDate
    true,                            -- IsActive
    NULL,                            -- UpdatedBy
    ti."TenantId",
    ti."CTA",
    ti."CTAText",
    'green',                         -- Status (MessageStatusConstants.Green)
    ti."CompletedDate"::date,        -- MessageDate (completedDate.Date)
    NULL,                            -- MessageEndDate
    NULL,                            -- ReadDate
    NULL,                            -- ToGroups
    ti."Action",
    NULL                             -- GroupingId
FROM to_insert ti;

-- Row count of notifications that were inserted:
DO $$
BEGIN
    RAISE NOTICE 'Inserted % course-completed notification row(s).',
        (SELECT COUNT(*) FROM "MessageLog"
         WHERE "MessageTemplateType" = 'course-completed'
           AND "InsertedDate" >= now() - interval '1 minute');
END $$;

-- Review the notice above, then:
COMMIT;
-- ROLLBACK;   -- <-- use this instead of COMMIT to abort


-- -----------------------------------------------------------------------------
-- STEP 3 (OPTIONAL - verification after commit):
-- Confirm every active completion now has (hub + push) notifications and that
-- no tenant was skipped for lack of an Administrator.
-- -----------------------------------------------------------------------------
-- Completions whose tenant has NO Administrator (these were SKIPPED - handle
-- manually if any rows come back):
-- SELECT DISTINCT utc."TenantId"
-- FROM "UserTrainingCourse" utc
-- WHERE utc."IsActive"
--   AND NOT EXISTS (SELECT 1 FROM "UserHierarchy" uh
--                   WHERE uh."IsActive" AND uh."UserType" = 'Administrator'
--                     AND uh."UserId" IS NOT NULL
--                     AND uh."TenantId" = utc."TenantId");
