CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "MessageLog" (
	"Id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"MessageTemplateType" text NOT NULL,
	"MessageProtocol" text NOT NULL,
	"From" text NOT NULL,
	"To" text NOT NULL,
	"Subject" text NULL,
	"Message" text NOT NULL,
	"FromUserId" uuid NULL,
	"SentByUserId" uuid NOT NULL,
	"InsertedDate" timestamp NOT NULL DEFAULT now(),
	"UpdatedDate" timestamp NULL,
	"IsActive" bool NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NOT NULL,
	CONSTRAINT "PK_MessageLog" PRIMARY KEY ("Id")
	-- CONSTRAINT messagelog_fk FOREIGN KEY ("MessageTemplateId") REFERENCES "MessageTemplate"("Id") ON DELETE RESTRICT
);

-- Example data
--INSERT INTO "MessageLog"
--("MessageTemplateType", "MessageProtocol", "From", "To", "Subject", "Message", "FromUserId", "SentByUserId", "IsActive","TenantId")
--VALUES('9f130b4f-c4f6-4bf7-845a-ad1dca8186f0','email','a@b.com','b@c.com','Test','Test Message','32be1a93-fa74-4821-aa61-dc373403a0e7','32be1a93-fa74-4821-aa61-dc373403a0e7', 'true','258a15e6-3736-45ea-875c-48d9377de4c8');
