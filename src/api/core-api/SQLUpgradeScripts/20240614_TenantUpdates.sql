delete from "SystemSetting" ss where ss."Name" in ('OASignup','OAPreSchoolInvitation','OAPrincipalSignup');
delete from "SystemSetting" ss where ss."Name" in ('WLPreSchoolInvitation','WLSignup','WLPrincipalSignup') and "TenantId"='258a15e6-3736-45ea-875c-48d9377de4c8';
delete from "SystemSetting" ss where ss."Name" in ('WLSignup') and "TenantId"='e8f571eb-1972-4e71-a20f-347c65d059bb';

-- add setting for oa tenant
INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
('74bd3da9-5998-4b89-b436-4b4ea4ef5cc0','General.Callback.Invitations','General.Callback.Invitations.PrincipalSignup','PrincipalSignup','https://whitelabel-develop-app.azurewebsites.net/sign-up',true,true,'2024-06-04 00:00:00.000','2024-06-04 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');

update "SystemSetting" ss set "FullPath" = 'General.Callback.Invitations.PreSchoolInvitation', "Name" = 'PreSchoolInvitation' where "Id" = 'e1675400-b370-4baa-94d2-608756a002fe';
update "SystemSetting" ss set "FullPath" = 'General.Callback.Invitations.PrincipalSignup', "Name" = 'PrincipalSignup' where "Id" = '2ad88d3d-ae1a-4b68-8932-8092e8fa50fb';