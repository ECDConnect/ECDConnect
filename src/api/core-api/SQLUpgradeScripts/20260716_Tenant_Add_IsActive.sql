-- Tenant lifecycle: inactive tenants are excluded from automated jobs (cron).
ALTER TABLE "Tenant" ADD IF NOT EXISTS "IsActive" boolean NOT NULL DEFAULT true;

-- Mark known archived tenants inactive (safe to re-run; only matches archived naming).
UPDATE "Tenant"
SET "IsActive" = false
WHERE "IsActive" = true
  AND (
    "ApplicationName" ILIKE 'Archived%'
    OR "Id" = '4743fd55-5b74-42a2-8fb6-a50d00a4c3df'
  );
