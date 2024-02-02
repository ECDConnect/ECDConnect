INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','practitioner-removed-from-programme','[[PractitionerName]] was removed from your programme. If [[PractitionerName]] was assigned to a class, make sure you reassign all classes to a different practitioner.','258a15e6-3736-45ea-875c-48d9377de4c8','A practitioner was removed from your programme','[[SeeClasses]]','See classes',NULL,'red',8);
INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','child-reg-incomplete','If you do not complete the registration form, the profile for [[ChildsName]] will be removed on [[RemovalDate]].','258a15e6-3736-45ea-875c-48d9377de4c8','Registration incomplete for [[ChildsName]]','[[FinishChildRegistration]]','Finish registration',NULL,'red',20);

	 	INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','gain-community-support','Get the support of ECD Centres, ECD Forums, local authorities, and others in your community by [[SupportDate]]','258a15e6-3736-45ea-875c-48d9377de4c8','Gain your communitys support','[[LearnMore]]','Learn more',NULL,NULL,5);
UPDATE public."MessageTemplate"
	SET "Subject"='Gain support from your community'
	WHERE "TemplateType"='gain-community-support';
