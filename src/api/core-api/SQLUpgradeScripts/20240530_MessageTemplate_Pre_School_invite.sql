
-- pre-school invite "MessageTemplate"
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('5c84abcd-5309-421d-a7ec-07e58dbcd4ca', true, current_date, current_date, '', 'sms', 'pre-school-invitation', '[[FirstName]] has invited you to join [[PreSchoolName]] on [[ApplicationName]].  Your assistant in brighter beginnings!  Check it out: [[InvitationLink:shorturl]]', null, null, null, null, null, null, 0, null);

INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('bed227b9-da3b-49a1-98a0-a65302fe2d28', true, current_date, current_date, '', 'sms', 'principal-invitation', '[[FirstName]] has invited you to join [[ApplicationName]], your assistant in brighter beginnings!  Sign up now to connect: [[InvitationLink:shorturl]]', null, null, null, null, null, null, 0, null);

ALTER TABLE public."Classroom" ADD "PreschoolCode" varchar NULL;

-- DEV - System Settings
-- pre-school invite
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('c420b2e6-a91a-418f-8220-48348f3bbb1b','General.Callback.Invitations','General.Callback.Invitations.WLPreSchoolInvitation','WLPreSchoolInvitation','https://whitelabel-develop-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');


-- principal invite
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('4246e432-528a-4765-87c1-2967726f0180','General.Callback.Invitations','General.Callback.Invitations.WLPrincipalSignup','WLPrincipalSignup','https://whitelabel-develop-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');


-- QA
-- pre-school invite
INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
('c420b2e6-a91a-418f-8220-48348f3bbb1b','General.Callback.Invitations','General.Callback.Invitations.PreSchoolInvitation','PreSchoolInvitation','https://whitelabel-qa-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'e8f571eb-1972-4e71-a20f-347c65d059bb');
-- principal invite
INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
('4246e432-528a-4765-87c1-2967726f0180','General.Callback.Invitations','General.Callback.Invitations.PrincipalSignup','PrincipalSignup','https://whitelabel-qa-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'e8f571eb-1972-4e71-a20f-347c65d059bb');


-- PROD
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('c420b2e6-a91a-418f-8220-48348f3bbb1b','General.Callback.Invitations','General.Callback.Invitations.WLPreSchoolInvitation','WLPreSchoolInvitation','https://whitelabel-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
-- principal invite
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('4246e432-528a-4765-87c1-2967726f0180','General.Callback.Invitations','General.Callback.Invitations.WLPrincipalSignup','WLPrincipalSignup','https://whitelabel-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
