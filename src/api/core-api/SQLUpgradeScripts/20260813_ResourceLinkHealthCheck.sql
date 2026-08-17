CREATE TABLE public."ResourceLinkHealthCheck" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"ContentType" text NOT NULL,
	"ContentId" int NOT NULL,
	"LocaleId" uuid NOT NULL,
	"SectionType" text NULL,
	"Title" text NULL,
	"Url" text NULL,
	"Status" text NOT NULL,
	"LastCheckStatus" text NULL,
	"LastStatusCode" int NULL,
	"LastError" text NULL,
	"ConsecutiveFailureCount" int NOT NULL DEFAULT 0,
	"LastCheckedDate" timestamp NOT NULL,
	"LastNotifiedDate" timestamp NULL,
	CONSTRAINT "PK_ResourceLinkHealthCheck" PRIMARY KEY ("Id")
);

CREATE UNIQUE INDEX "UX_ResourceLinkHealthCheck_Content"
	ON public."ResourceLinkHealthCheck" ("TenantId", "ContentType", "ContentId", "LocaleId");

CREATE INDEX "IX_ResourceLinkHealthCheck_SectionType"
	ON public."ResourceLinkHealthCheck" ("TenantId", "SectionType", "Status");

INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES(
	'8c3f2a91-6d4e-4b17-9a5c-1f0e8d27b6a4'::uuid,
	true,
	NOW(),
	NOW(),
	NULL,
	'email',
	'notify-admin-broken-resource-links',
	'Hello,

Resource link checks for [[ApplicationName]] finished on [[CheckDate]].

Newly broken:
[[NewlyBrokenLinks]]

Recovered:
[[RecoveredLinks]]

Still broken:
[[StillBrokenLinks]]

Please review these links in the admin portal and update or replace any that no longer work.

Thank you,
[[OrganisationName]]',
	NULL,
	'[[ApplicationName]] - resource links need attention',
	NULL,
	NULL,
	29,
	NULL,
	0,
	NULL
);
