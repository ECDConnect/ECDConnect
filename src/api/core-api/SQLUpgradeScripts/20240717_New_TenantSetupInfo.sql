CREATE TABLE public."TenantSetupInfo" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"OrganisationName" text not NULL,
	"SetupJsonData" text not NULL,
	CONSTRAINT "PK_TenantSetupInfo" PRIMARY KEY ("Id")
);


INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 ('2b19c16f-862b-473c-b0a0-08923f8a38fd'::uuid,true,current_date,current_date,NULL,'email','new-tenant-setup-info-received','Hello,<br><br>

A new tenant setup information request has been received from the [[ApplicationName]] help form.<br><br>

Details:
<ul>
<li>Organsition Name: [[OrganisationName]]</li>
<li>Application Name: [[ApplicationName]]</li>
</ul>
<br>
Thank you, <br>
[[OrganisationName]]',NULL,'[[ApplicationName]] - new tenant setup information',NULL,NULL,NULL,NULL,0,NULL);