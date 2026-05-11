SELECT COUNT(*)
FROM "SiteAddress" sa
JOIN "Caregiver" c ON sa."Id" = c."SiteAddressId"
WHERE sa."TenantId" IS NULL AND c."TenantId" IS NOT NULL
;

UPDATE "SiteAddress" sa
SET "TenantId" = c."TenantId"
FROM "Caregiver" c
WHERE c."SiteAddressId" = sa."Id"
  AND sa."TenantId" IS NULL
  AND c."TenantId" IS NOT NULL
;

SELECT COUNT(*)
FROM "SiteAddress" sa
JOIN "Caregiver" c ON sa."Id" = c."SiteAddressId"
WHERE sa."TenantId" IS NULL AND c."TenantId" IS NOT NULL
;
