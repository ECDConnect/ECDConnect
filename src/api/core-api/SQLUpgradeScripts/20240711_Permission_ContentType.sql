INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('f06a0a70-875d-4d7e-afea-d29b652bb16b', true, current_date, current_date, NULL, 'view_contenttype', 'View ContentType', 'ContentType', NULL);
INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('ad294afe-95d2-44c2-9b0b-41494e7fa306', true, current_date, current_date, NULL, 'update_contenttype', 'Update ContentType', 'ContentType', NULL);
INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('0594f9be-edec-458e-9dc0-985cb4375d55', true, current_date, current_date, NULL, 'create_contenttype', 'Create ContentType', 'ContentType', NULL);
INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('aef2128c-53db-4d95-9797-bda51e536ef4', true, current_date, current_date, NULL, 'delete_contenttype', 'Delete ContentType', 'ContentType', NULL);


--829323b4-165b-4fde-b8eb-b74e21c70891	Super Admin
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('829323b4-165b-4fde-b8eb-b74e21c70891', 'f06a0a70-875d-4d7e-afea-d29b652bb16b', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('829323b4-165b-4fde-b8eb-b74e21c70891', 'ad294afe-95d2-44c2-9b0b-41494e7fa306', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('829323b4-165b-4fde-b8eb-b74e21c70891', '0594f9be-edec-458e-9dc0-985cb4375d55', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('829323b4-165b-4fde-b8eb-b74e21c70891', 'aef2128c-53db-4d95-9797-bda51e536ef4', '258a15e6-3736-45ea-875c-48d9377de4c8');
--d595accd-2ed6-459d-b0dc-ee2f4a86bdda	Administrator
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('d595accd-2ed6-459d-b0dc-ee2f4a86bdda', 'f06a0a70-875d-4d7e-afea-d29b652bb16b', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('d595accd-2ed6-459d-b0dc-ee2f4a86bdda', 'ad294afe-95d2-44c2-9b0b-41494e7fa306', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('d595accd-2ed6-459d-b0dc-ee2f4a86bdda', '0594f9be-edec-458e-9dc0-985cb4375d55', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('d595accd-2ed6-459d-b0dc-ee2f4a86bdda', 'aef2128c-53db-4d95-9797-bda51e536ef4', '258a15e6-3736-45ea-875c-48d9377de4c8');
--88c06cd9-5162-4d0b-a3a1-dbfed47f6e75	Super Admin
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('88c06cd9-5162-4d0b-a3a1-dbfed47f6e75', 'f06a0a70-875d-4d7e-afea-d29b652bb16b', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('88c06cd9-5162-4d0b-a3a1-dbfed47f6e75', 'ad294afe-95d2-44c2-9b0b-41494e7fa306', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('88c06cd9-5162-4d0b-a3a1-dbfed47f6e75', '0594f9be-edec-458e-9dc0-985cb4375d55', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('88c06cd9-5162-4d0b-a3a1-dbfed47f6e75', 'aef2128c-53db-4d95-9797-bda51e536ef4', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
--4a38da49-481b-40f6-87ce-ca7b25343f3b	Administrator
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('4a38da49-481b-40f6-87ce-ca7b25343f3b', 'f06a0a70-875d-4d7e-afea-d29b652bb16b', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('4a38da49-481b-40f6-87ce-ca7b25343f3b', 'ad294afe-95d2-44c2-9b0b-41494e7fa306', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('4a38da49-481b-40f6-87ce-ca7b25343f3b', '0594f9be-edec-458e-9dc0-985cb4375d55', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") 
VALUES('4a38da49-481b-40f6-87ce-ca7b25343f3b', 'aef2128c-53db-4d95-9797-bda51e536ef4', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
