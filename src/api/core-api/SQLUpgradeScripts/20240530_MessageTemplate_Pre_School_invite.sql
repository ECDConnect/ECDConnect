

-- pre-school invite "MessageTemplate"
--WL
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('5c84abcd-5309-421d-a7ec-07e58dbcd4ca', true, current_date, current_date, '', 'sms', 'wl-pre-school-invitation', '[[FirstName]] has invited you to join [[PreSchoolName]] on [[ApplicationName]].  Your assistant in brighter beginnings!  Check it out: [[InvitationLink:shorturl]]', null, null, null, null, null, null, 0, null);
--OA
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('78e369f6-e89d-4fe1-bd0b-51cc9f4dfc7c', true, current_date, current_date, '', 'sms', 'oa-pre-school-invitation', '[[FirstName]] has invited you to join [[PreSchoolName]] on [[ApplicationName]].  Your assistant in brighter beginnings!  Check it out: [[InvitationLink:shorturl]]', null, null, null, null, null, null, 0, null);

-- principal invite 
--OA
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('bed227b9-da3b-49a1-98a0-a65302fe2d28', true, current_date, current_date, '', 'sms', 'oa-principal-invitation', '[[FirstName]] has invited you to join [[ApplicationName]], your assistant in brighter beginnings!  Sign up now to connect: [[InvitationLink:shorturl]]', null, null, null, null, null, null, 0, null);


ALTER TABLE public."Classroom" ADD "PreschoolCode" varchar NULL;

-- DEV - System Settings
-- pre-school invite
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('c420b2e6-a91a-418f-8220-48348f3bbb1b','General.Callback.Invitations','General.Callback.Invitations.WLPreSchoolInvitation','WLPreSchoolInvitation','https://whitelabel-develop-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('fcdf0757-3235-4070-a7d1-75144de55820','General.Callback.Invitations','General.Callback.Invitations.OAPreSchoolInvitation','OAPreSchoolInvitation','https://ecdconnect-develop-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');


-- principal invite
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('4246e432-528a-4765-87c1-2967726f0180','General.Callback.Invitations','General.Callback.Invitations.WLPrincipalSignup','WLPrincipalSignup','https://whitelabel-develop-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('e66fa5f9-6edd-4629-8866-59188284e031','General.Callback.Invitations','General.Callback.Invitations.OAPrincipalSignup','OAPrincipalSignup','https://ecdconnect-develop-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');


-- QA
-- pre-school invite
INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
('c420b2e6-a91a-418f-8220-48348f3bbb1b','General.Callback.Invitations','General.Callback.Invitations.WLPreSchoolInvitation','WLPreSchoolInvitation','https://whitelabel-qa-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
('fcdf0757-3235-4070-a7d1-75144de55820','General.Callback.Invitations','General.Callback.Invitations.OAPreSchoolInvitation','OAPreSchoolInvitation','https://ecdconnect-qa-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
-- principal invite
INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
('4246e432-528a-4765-87c1-2967726f0180','General.Callback.Invitations','General.Callback.Invitations.WLPrincipalSignup','WLPrincipalSignup','https://whitelabel-qa-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
('e66fa5f9-6edd-4629-8866-59188284e031','General.Callback.Invitations','General.Callback.Invitations.OAPrincipalSignup','OAPrincipalSignup','https://ecdconnect-qa-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');


-- PROD
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('c420b2e6-a91a-418f-8220-48348f3bbb1b','General.Callback.Invitations','General.Callback.Invitations.WLPreSchoolInvitation','WLPreSchoolInvitation','https://whitelabel-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('fcdf0757-3235-4070-a7d1-75144de55820','General.Callback.Invitations','General.Callback.Invitations.OAPreSchoolInvitation','OAPreSchoolInvitation','https://ecdconnect-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
-- principal invite
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('4246e432-528a-4765-87c1-2967726f0180','General.Callback.Invitations','General.Callback.Invitations.WLPrincipalSignup','WLPrincipalSignup','https://whitelabel-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('e66fa5f9-6edd-4629-8866-59188284e031','General.Callback.Invitations','General.Callback.Invitations.OAPrincipalSignup','OAPrincipalSignup','https://ecdconnect-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
