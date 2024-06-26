
INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
	 (uuid_generate_v4(),'General.Callback.Invitations','General.Callback.Invitations.PrincipalInvitation','PrincipalInvitation','https://ecdconnect-develop-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'258a15e6-3736-45ea-875c-48d9377de4c8'),
	 (uuid_generate_v4(),'General.Callback.Invitations','General.Callback.Invitations.PrincipalInvitation','PrincipalInvitation','https://whitelabel-develop-app.azurewebsites.net/sign-up',true,true,current_date,current_date,NULL,'e8f571eb-1972-4e71-a20f-347c65d059bb');
