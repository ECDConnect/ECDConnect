

-- pre-school invite "MessageTemplate"
--WL
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('b67faf9a-748b-4cb6-9dba-18eebed9dd09', true, current_date, current_date, '', 'sms', 'pre-school-invitation', '[[FirstName]] has invited you to join [[PreSchoolName]] on [[ApplicationName]].  Your assistant in brighter beginnings!  Check it out: [[InvitationLink:shorturl]]', null, null, null, null, null, null, 0, null);
--OA
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('b67faf9a-748b-4cb6-9dba-18eebed9dd09', true, current_date, current_date, '', 'sms', 'pre-school-invitation', '[[FirstName]] has invited you to join [[PreSchoolName]] on [[ApplicationName]].  Your assistant in brighter beginnings!  Check it out: [[InvitationLink:shorturl]]', null, null, null, null, null, null, 0, null);

-- principal invite OA
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('bed227b9-da3b-49a1-98a0-a65302fe2d28', true, current_date, current_date, '', 'sms', 'principal-invitation', '[[FirstName]] has invited you to join [[ApplicationName]], your assistant in brighter beginnings!  Sign up now to connect: [[InvitationLink:shorturl]]', null, null, null, null, null, null, 0, null);


-- DEV - System Settings
-- pre-school invite
INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
('fcdf0757-3235-4070-a7d1-75144de55820','General.Callback.Invitations','General.Callback.Invitations.PreSchoolInvitation','PreSchoolInvitation','https://ecdconnect-develop-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');

INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
('fcdf0757-3235-4070-a7d1-75144de55820','General.Callback.Invitations','General.Callback.Invitations.PreSchoolInvitation','PreSchoolInvitation','https://ecdconnect-develop-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');


-- principal invite
INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
('e66fa5f9-6edd-4629-8866-59188284e031','General.Callback.Invitations','General.Callback.Invitations.PrincipalSignup','PrincipalSignup','https://ecdconnect-develop-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');

INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
('e66fa5f9-6edd-4629-8866-59188284e031','General.Callback.Invitations','General.Callback.Invitations.PrincipalSignup','PrincipalSignup','https://ecdconnect-develop-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');



ALTER TABLE public."Classroom" ADD "PreschoolCode" varchar NULL;




-- QA
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('fcdf0757-3235-4070-a7d1-75144de55820','General.Callback.Invitations','General.Callback.Invitations.PreSchoolInvitation','PreSchoolInvitation','https://ecdconnect-qa-app.azurewebsites.net/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');

-- principal invite
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('e66fa5f9-6edd-4629-8866-59188284e031','General.Callback.Invitations','General.Callback.Invitations.PrincipalSignup','PrincipalSignup','https://ecdconnect-qa-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');


-- PROD
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('fcdf0757-3235-4070-a7d1-75144de55820','General.Callback.Invitations','General.Callback.Invitations.PreSchoolInvitation','PreSchoolInvitation','https://??/sign-up',true,true,'2024-05-31 00:00:00.000','2024-05-31 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');

-- principal invite
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--('e66fa5f9-6edd-4629-8866-59188284e031','General.Callback.Invitations','General.Callback.Invitations.PrincipalSignup','PrincipalSignup','https://??/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
