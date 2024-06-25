INSERT INTO public."Permission" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Name","NormalizedName","Grouping","TenantId") VALUES
	 ('807bab9a-7e49-4f40-8550-1c75120c9d6a',true,current_date,current_date,'','create_userpermission','Create User Permissions','User Permissions','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('13274ca6-c971-436b-b84a-8a4bc398e248',true,current_date,current_date,'','update_userpermission','Update User Permissions','User Permissions','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('4563b49f-867c-44f4-9c79-eaa1c32ebd79',true,current_date,current_date,'','delete_userpermission','Delete User Permissions','User Permissions','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('c1ccf993-ee2d-4b32-ad31-195459a8dda7',true,current_date,current_date,'','view_userpermission','View User Permissions','User Permissions','258a15e6-3736-45ea-875c-48d9377de4c8');

-- practitioner
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('68fb1d29-2b60-4c87-b265-90e824e69bb6', '807bab9a-7e49-4f40-8550-1c75120c9d6a', null);
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('68fb1d29-2b60-4c87-b265-90e824e69bb6', '13274ca6-c971-436b-b84a-8a4bc398e248', null);
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('68fb1d29-2b60-4c87-b265-90e824e69bb6', '4563b49f-867c-44f4-9c79-eaa1c32ebd79', null);
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('68fb1d29-2b60-4c87-b265-90e824e69bb6', 'c1ccf993-ee2d-4b32-ad31-195459a8dda7', null);
-- principal
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', '807bab9a-7e49-4f40-8550-1c75120c9d6a', null);
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', '13274ca6-c971-436b-b84a-8a4bc398e248', null);
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', '4563b49f-867c-44f4-9c79-eaa1c32ebd79', null);
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', 'c1ccf993-ee2d-4b32-ad31-195459a8dda7', null);
-- coach
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('ff9ec9aa-cadc-4146-9393-e030fccb3f7f', '807bab9a-7e49-4f40-8550-1c75120c9d6a', null);
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('ff9ec9aa-cadc-4146-9393-e030fccb3f7f', '13274ca6-c971-436b-b84a-8a4bc398e248', null);
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('ff9ec9aa-cadc-4146-9393-e030fccb3f7f', '4563b49f-867c-44f4-9c79-eaa1c32ebd79', null);
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('ff9ec9aa-cadc-4146-9393-e030fccb3f7f', 'c1ccf993-ee2d-4b32-ad31-195459a8dda7', null);
