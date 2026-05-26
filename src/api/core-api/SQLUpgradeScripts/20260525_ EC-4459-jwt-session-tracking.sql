-- EC-4459: JWT session tracking (pentest findings 4.4.9 and 4.4.12)
--
-- Changes:
--   1. Add session tracking columns to JWTUserTokens
--   2. Migrate primary key from UserId to TokenKey (allows concurrent sessions per user)
--   3. Add index on UserId (foreign-key style lookup) and Token (LastSeenAt update path)

-- Step 1: add new columns (idempotent)
ALTER TABLE "JWTUserTokens"
    ADD COLUMN IF NOT EXISTS "LastSeenAt"  TIMESTAMP    NULL,
    ADD COLUMN IF NOT EXISTS "DeviceInfo"  VARCHAR(500) NULL,
    ADD COLUMN IF NOT EXISTS "RevokedAt"   TIMESTAMP    NULL;

-- Step 2: ensure TokenKey is NOT NULL before promoting it to PK
--   Fill any legacy rows that somehow lack a TokenKey
UPDATE "JWTUserTokens"
SET "TokenKey" = gen_random_uuid()::text
WHERE "TokenKey" IS NULL OR "TokenKey" = '';

ALTER TABLE "JWTUserTokens"
    ALTER COLUMN "TokenKey" SET NOT NULL;

-- Step 3: swap the primary key
ALTER TABLE "JWTUserTokens" DROP CONSTRAINT IF EXISTS "PK_JWTUserTokens";
ALTER TABLE "JWTUserTokens" ADD  CONSTRAINT "PK_JWTUserTokens" PRIMARY KEY ("TokenKey");

-- Step 4: performance indexes
CREATE INDEX IF NOT EXISTS "IX_JWTUserTokens_UserId"
    ON "JWTUserTokens" ("UserId");

-- Token lookup used by UserActivityMiddleware to update LastSeenAt
CREATE INDEX IF NOT EXISTS "IX_JWTUserTokens_Token"
    ON "JWTUserTokens" USING hash ("Token");

-- Seed LastSeenAt for existing rows so the column is never NULL
UPDATE "JWTUserTokens"
SET "LastSeenAt" = "InsertedDate"
WHERE "LastSeenAt" IS NULL;
