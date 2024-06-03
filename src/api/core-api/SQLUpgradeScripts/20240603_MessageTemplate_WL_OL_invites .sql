INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('91eb56df-c11f-44a7-8b3c-b2bbc4e93414'::uuid, true, current_date, '0001-01-01 00:00:00.000', NULL, 'sms', 'wl-invitation', 'Welcome to [[ApplicationName]] App, the [[OrganisationName]] online platform! Please tap this link to register and learn more [[InvitationLink:shorturl]]', '258a15e6-3736-45ea-875c-48d9377de4c8', 'Welcome to [[ApplicationName]]', NULL, NULL, NULL, NULL, 0, NULL);
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('a5d36e51-0481-4dcb-adc1-41a2157412fc'::uuid, true, current_date, '0001-01-01 00:00:00.000', NULL, 'sms', 'oa-invitation', 'Welcome to [[ApplicationName]] App, the [[OrganisationName]] online platform! Please tap this link to register and learn more [[InvitationLink:shorturl]]', '258a15e6-3736-45ea-875c-48d9377de4c8', 'Welcome to [[ApplicationName]]', NULL, NULL, NULL, NULL, 0, NULL);



INSERT INTO public."SystemSetting"
("Id", "Grouping", "FullPath", "Name", "Value", "IsSystemValue", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('ce1a585b-e6f8-4bbb-8f56-354de2c1d8ec'::uuid, 'General.Callback.Invitations', 'General.Callback.Invitations.WLSignup', 'WLSignup', 'https://whitelabel-develop-app.azurewebsites.net/sign-up', true, true, '2022-01-31 07:39:37.330', '0001-01-01 00:00:00.000', NULL, '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid);
INSERT INTO public."SystemSetting"
("Id", "Grouping", "FullPath", "Name", "Value", "IsSystemValue", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('588087ab-45f8-41c4-8e74-190db5c4deba'::uuid, 'General.Callback.Invitations', 'General.Callback.Invitations.OASignup', 'OASignup', 'https://ecdconnect-develop-app.azurewebsites.net/sign-up', true, true, '2022-01-31 07:39:37.330', '0001-01-01 00:00:00.000', NULL, '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid);



--QA
--INSERT INTO public."SystemSetting"
--("Id", "Grouping", "FullPath", "Name", "Value", "IsSystemValue", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
--VALUES('ce1a585b-e6f8-4bbb-8f56-354de2c1d8ec'::uuid, 'General.Callback.Invitations', 'General.Callback.Invitations.WLSignup', 'WLSignup', 'https://whitelabel-qa-app.azurewebsites.net/sign-up', true, true, '2022-01-31 07:39:37.330', '0001-01-01 00:00:00.000', NULL, '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid);
--INSERT INTO public."SystemSetting"
--("Id", "Grouping", "FullPath", "Name", "Value", "IsSystemValue", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
--VALUES('588087ab-45f8-41c4-8e74-190db5c4deba'::uuid, 'General.Callback.Invitations', 'General.Callback.Invitations.OASignup', 'OASignup', 'https://ecdconnect-qa-app.azurewebsites.net/sign-up', true, true, '2022-01-31 07:39:37.330', '0001-01-01 00:00:00.000', NULL, '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid);


--Production
--INSERT INTO public."SystemSetting"
--("Id", "Grouping", "FullPath", "Name", "Value", "IsSystemValue", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
--VALUES('ce1a585b-e6f8-4bbb-8f56-354de2c1d8ec'::uuid, 'General.Callback.Invitations', 'General.Callback.Invitations.WLSignup', 'WLSignup', 'https://whitelabel-app.azurewebsites.net/sign-up', true, true, '2022-01-31 07:39:37.330', '0001-01-01 00:00:00.000', NULL, '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid);
--INSERT INTO public."SystemSetting"
--("Id", "Grouping", "FullPath", "Name", "Value", "IsSystemValue", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
--VALUES('588087ab-45f8-41c4-8e74-190db5c4deba'::uuid, 'General.Callback.Invitations', 'General.Callback.Invitations.OASignup', 'OASignup', 'https://ecdconnect-app.azurewebsites.net/sign-up', true, true, '2022-01-31 07:39:37.330', '0001-01-01 00:00:00.000', NULL, '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid);
