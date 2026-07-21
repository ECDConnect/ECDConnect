-- =============================================================================
-- Create missing SiteAddress records from Health and safety check location
-- answers, and link them to Classroom
-- =============================================================================
-- Purpose:
--   Some principals completed the Health and safety check journey form and
--   answered "Where is the preschool located?", but never got a SiteAddress
--   linked on their Classroom (Classroom.SiteAddressId is null).
--
--   QuestionAnswer is a composite Google Maps string, e.g.
--     '6 Haarlem St, Stuart''s Hill, Cape Town, Western Cape'
--
--   Split on commas into:
--     1 = AddressLine1
--     2 = AddressLine2
--     3 = AddressLine3
--     4 = Province description (optional; matched to Province.Description)
--
-- Rules:
--   * Only process classrooms where SiteAddressId IS NULL
--   * Skip if there is no Classroom for the practitioner's UserId
--   * Skip if QuestionAnswer is null/blank or AddressLine1 parses empty
--   * If multiple answers exist for the same Classroom, use the latest
--     VisitData (InsertedDate DESC)
--   * Insert one new SiteAddress per Classroom, then set Classroom.SiteAddressId
--   * Also set Practitioner.SiteAddressId when it is still null (same address)
--   * ProvinceId only set when the 4th segment matches Province.Description
--
-- Idempotent: re-running only touches classrooms that still have a null
-- SiteAddressId (already-linked classrooms are left alone).
--
-- Multi-tenant: runs across all tenants. To limit to one tenant, uncomment
-- the tenant filter marked >>> TENANT FILTER <<< below.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- STEP 1 (PREVIEW ONLY - safe to run on its own):
-- Classrooms that would get a new SiteAddress, with parsed address segments.
-- -----------------------------------------------------------------------------
SELECT
    c."Id"                                               AS classroom_id,
    c."Name"                                             AS classroom_name,
    c."TenantId"                                         AS classroom_tenant_id,
    c."SiteAddressId"                                    AS current_site_address_id,
    p."Id"                                               AS practitioner_id,
    p."UserId"                                           AS principal_user_id,
    p."SiteAddressId"                                    AS practitioner_site_address_id,
    vd."Id"                                              AS visit_data_id,
    vd."InsertedDate"                                    AS visit_data_inserted,
    vd."QuestionAnswer"                                  AS raw_answer,
    NULLIF(btrim(split_part(vd."QuestionAnswer", ',', 1)), '') AS new_line1,
    NULLIF(btrim(split_part(vd."QuestionAnswer", ',', 2)), '') AS new_line2,
    NULLIF(btrim(split_part(vd."QuestionAnswer", ',', 3)), '') AS new_line3,
    NULLIF(btrim(split_part(vd."QuestionAnswer", ',', 4)), '') AS new_province_name,
    prov."Id"                                            AS matched_province_id,
    prov."Description"                                   AS matched_province
FROM "Classroom" c
JOIN "Practitioner" p
  ON p."UserId" = c."UserId"
JOIN "Visit" v
  ON v."PractitionerId" = p."Id"
JOIN "VisitData" vd
  ON vd."VisitId" = v."Id"
LEFT JOIN "Province" prov
  ON lower(prov."Description") = lower(NULLIF(btrim(split_part(vd."QuestionAnswer", ',', 4)), ''))
WHERE c."SiteAddressId" IS NULL
  AND vd."VisitName" = 'Health and safety check'
  AND vd."Question" = 'Where is the preschool located?'
  AND vd."QuestionAnswer" IS NOT NULL
  AND btrim(vd."QuestionAnswer") <> ''
  AND NULLIF(btrim(split_part(vd."QuestionAnswer", ',', 1)), '') IS NOT NULL
  -- >>> TENANT FILTER <<<
  -- AND c."TenantId" = '00000000-0000-0000-0000-000000000000'
ORDER BY vd."InsertedDate" DESC;


-- -----------------------------------------------------------------------------
-- STEP 2: Insert SiteAddress rows and link Classroom (and Practitioner if null).
-- Wrapped in a transaction. Review the SELECT counts, then COMMIT or ROLLBACK.
-- -----------------------------------------------------------------------------
BEGIN;

-- Staging: one latest location answer per Classroom that needs an address
CREATE TEMP TABLE tmp_hs_site_address_backfill ON COMMIT DROP AS
WITH ranked AS (
    SELECT
        c."Id"        AS classroom_id,
        c."Name"      AS classroom_name,
        c."TenantId"  AS tenant_id,
        p."Id"        AS practitioner_id,
        p."SiteAddressId" AS practitioner_site_address_id,
        vd."QuestionAnswer",
        vd."InsertedDate",
        ROW_NUMBER() OVER (
            PARTITION BY c."Id"
            ORDER BY vd."InsertedDate" DESC NULLS LAST, vd."Id" DESC
        ) AS rn
    FROM "Classroom" c
    JOIN "Practitioner" p
      ON p."UserId" = c."UserId"
    JOIN "Visit" v
      ON v."PractitionerId" = p."Id"
    JOIN "VisitData" vd
      ON vd."VisitId" = v."Id"
    WHERE c."SiteAddressId" IS NULL
      AND vd."VisitName" = 'Health and safety check'
      AND vd."Question" = 'Where is the preschool located?'
      AND vd."QuestionAnswer" IS NOT NULL
      AND btrim(vd."QuestionAnswer") <> ''
      -- >>> TENANT FILTER <<<
      -- AND c."TenantId" = '00000000-0000-0000-0000-000000000000'
),
parsed AS (
    SELECT
        classroom_id,
        classroom_name,
        tenant_id,
        practitioner_id,
        practitioner_site_address_id,
        NULLIF(btrim(split_part("QuestionAnswer", ',', 1)), '') AS address_line1,
        NULLIF(btrim(split_part("QuestionAnswer", ',', 2)), '') AS address_line2,
        NULLIF(btrim(split_part("QuestionAnswer", ',', 3)), '') AS address_line3,
        NULLIF(btrim(split_part("QuestionAnswer", ',', 4)), '') AS province_name
    FROM ranked
    WHERE rn = 1
)
SELECT
    uuid_generate_v4() AS new_site_address_id,
    p.classroom_id,
    p.classroom_name,
    p.tenant_id,
    p.practitioner_id,
    p.practitioner_site_address_id,
    p.address_line1,
    p.address_line2,
    p.address_line3,
    prov."Id" AS province_id
FROM parsed p
LEFT JOIN "Province" prov
  ON lower(prov."Description") = lower(p.province_name)
WHERE p.address_line1 IS NOT NULL;

-- How many will we create?
SELECT COUNT(*) AS site_addresses_to_create FROM tmp_hs_site_address_backfill;

-- 2a. Insert the new SiteAddress records
INSERT INTO "SiteAddress" (
    "Id",
    "Name",
    "AddressLine1",
    "AddressLine2",
    "AddressLine3",
    "PostalCode",
    "Ward",
    "Longitude",
    "Latitude",
    "Municipality",
    "Area",
    "ProvinceId",
    "IsActive",
    "InsertedDate",
    "UpdatedDate",
    "UpdatedBy",
    "TenantId"
)
SELECT
    t.new_site_address_id,
    t.classroom_name,          -- Name: use classroom/preschool name when available
    t.address_line1,
    t.address_line2,
    t.address_line3,
    NULL,                      -- PostalCode (not in composite answer)
    NULL,                      -- Ward
    NULL,                      -- Longitude
    NULL,                      -- Latitude
    NULL,                      -- Municipality
    NULL,                      -- Area
    t.province_id,
    true,
    NOW(),
    NOW(),
    NULL,
    t.tenant_id
FROM tmp_hs_site_address_backfill t;

-- 2b. Link Classroom → new SiteAddress
UPDATE "Classroom" c
SET
    "SiteAddressId" = t.new_site_address_id,
    "UpdatedDate"   = NOW()
FROM tmp_hs_site_address_backfill t
WHERE c."Id" = t.classroom_id
  AND c."SiteAddressId" IS NULL;

-- 2c. Link Practitioner → same SiteAddress when practitioner has none yet
UPDATE "Practitioner" p
SET
    "SiteAddressId" = t.new_site_address_id,
    "UpdatedDate"   = NOW()
FROM tmp_hs_site_address_backfill t
WHERE p."Id" = t.practitioner_id
  AND p."SiteAddressId" IS NULL;

-- Verification: remaining classrooms still missing SiteAddress but with an answer
SELECT COUNT(*) AS remaining_classrooms_without_site_address
FROM "Classroom" c
JOIN "Practitioner" p ON p."UserId" = c."UserId"
JOIN "Visit" v ON v."PractitionerId" = p."Id"
JOIN "VisitData" vd ON vd."VisitId" = v."Id"
WHERE c."SiteAddressId" IS NULL
  AND vd."VisitName" = 'Health and safety check'
  AND vd."Question" = 'Where is the preschool located?'
  AND vd."QuestionAnswer" IS NOT NULL
  AND btrim(vd."QuestionAnswer") <> ''
  AND NULLIF(btrim(split_part(vd."QuestionAnswer", ',', 1)), '') IS NOT NULL;

-- COMMIT;   -- uncomment after reviewing results
-- ROLLBACK; -- use this if the preview/result is wrong
