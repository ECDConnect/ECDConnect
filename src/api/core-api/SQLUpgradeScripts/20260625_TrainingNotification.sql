-- notification
INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_generate_v4(),true,current_date,current_date,NULL,'hub','course-completed','Well done on completing a course! You can download your certificate.',null,'Download your certificate','[[CertificateDownload]]','Get certificate',NULL,'green',26,'{"url":"/practitioner/profile","state":{"activeTabIndex":"1"}}');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_generate_v4(),true,current_date,current_date,NULL,'push','course-completed','Well done on completing a course! You can download your certificate.',null,'Download your certificate','[[CertificateDownload]]','Get certificate',NULL,'green',26,'{"url":"/practitioner/profile","state":{"activeTabIndex":"1"}}');
