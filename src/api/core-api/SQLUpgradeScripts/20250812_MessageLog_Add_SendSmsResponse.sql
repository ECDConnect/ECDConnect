
ALTER TABLE "MessageLog" ADD IF NOT EXISTS "NotificationResultProviderCode" TEXT;
ALTER TABLE "MessageLog" ADD IF NOT EXISTS "NotificationResultProviderMessage" TEXT;

ALTER TABLE "ShortUrl" ADD IF NOT EXISTS "MessageLogId" UUID;

CREATE INDEX "IX_ShortUrl_MessageLogId" ON "ShortUrl" USING btree("MessageLogId");
