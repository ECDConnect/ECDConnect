select * from "MessageTemplate" mt 
where mt."TemplateType"  = 'coach-new-practitioners-linked'

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor", "Action") VALUES
	 ('942e70b8-918e-1fad-2f4f-f6a6b85e017a',true,'2025-07-17 05:32:34.371','2025-07-17 05:32:34.371',NULL,'hub','coach-new-practitioners-linked','Encourage all practitioners to register for [[ApplicationName]]. Once they sign up, you will have better information and tools to support them','258a15e6-3736-45ea-875c-48d9377de4c8','New practitioners were assigned to you on [[ApplicationName]]!','[[SeePractitioners]]','See Practitioners',NULL,'green', '{"url":"/coach/practitioners"}');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor", "Action") VALUES
	 ('15ed5113-a24d-4d38-bad6-ed30e13cb697',true,'2025-07-17 05:32:34.371','2025-07-17 05:32:34.371',NULL,'push','coach-new-practitioners-linked','Encourage all practitioners to register for [[ApplicationName]]. Once they sign up, you will have better information and tools to support them','258a15e6-3736-45ea-875c-48d9377de4c8','New practitioners were assigned to you on [[ApplicationName]]!','[[SeePractitioners]]','See Practitioners',NULL,'green', '{"url":"/coach/practitioners"}');

--e8f571eb-1972-4e71-a20f-347c65d059bb

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor", "Action") VALUES
	 ('4e85af6f-f13c-4c88-b50d-b3710b3d4d0a',true,'2025-07-17 05:32:34.371','2025-07-17 05:32:34.371',NULL,'hub','coach-new-practitioners-linked','Encourage all practitioners to register for [[ApplicationName]]. Once they sign up, you will have better information and tools to support them','e8f571eb-1972-4e71-a20f-347c65d059bb','New practitioners were assigned to you on [[ApplicationName]]!','[[SeePractitioners]]','See Practitioners',NULL,'green', '{"url":"/coach/practitioners"}');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor", "Action") VALUES
	 ('dc31223c-12cb-4fe9-b422-4dd9a0cefa7e',true,'2025-07-17 05:32:34.371','2025-07-17 05:32:34.371',NULL,'push','coach-new-practitioners-linked','Encourage all practitioners to register for [[ApplicationName]]. Once they sign up, you will have better information and tools to support them','e8f571eb-1972-4e71-a20f-347c65d059bb','New practitioners were assigned to you on [[ApplicationName]]!','[[SeePractitioners]]','See Practitioners',NULL,'green', '{"url":"/coach/practitioners"}');


--{"url":"/business"}