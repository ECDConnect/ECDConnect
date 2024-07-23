-- New permissions
INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('ca4ee084-ac42-42dc-8924-a3d2e684d270', true, now(), now(), '', 'create_league', 'Create League', 'League', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('81e9e560-8154-4245-b2c9-4545f37ac9c2', true, now(), now(), '', 'update_league', ' League', 'League', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('f71ee717-3ffb-4e5c-853c-29cb09d55c8d', true, now(), now(), '', 'delete_league', ' League', 'League', '39077d0e-e443-4076-aaf2-978dc6805aa0');

INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('8b398cbe-b59a-4490-8277-1a567ba30ca9', true, now(), now(), '', 'view_league', ' League', 'League', '39077d0e-e443-4076-aaf2-978dc6805aa0');


-- Add to admin role
-- create
INSERT INTO public."RolePermission"
("RoleId", "PermissionId", "TenantId")
select anr."Id", 'ca4ee084-ac42-42dc-8924-a3d2e684d270', '39077d0e-e443-4076-aaf2-978dc6805aa0'
from "AspNetRoles" anr
where anr."Name" in ('Administrator','Super Admin');

-- update
INSERT INTO public."RolePermission"
("RoleId", "PermissionId", "TenantId")
select anr."Id", '81e9e560-8154-4245-b2c9-4545f37ac9c2', '39077d0e-e443-4076-aaf2-978dc6805aa0'
from "AspNetRoles" anr
where anr."Name" in ('Administrator','Super Admin');

-- delete
INSERT INTO public."RolePermission"
("RoleId", "PermissionId", "TenantId")
select anr."Id", 'f71ee717-3ffb-4e5c-853c-29cb09d55c8d', '39077d0e-e443-4076-aaf2-978dc6805aa0'
from "AspNetRoles" anr
where anr."Name" in ('Administrator','Super Admin');

-- view - all 
INSERT INTO public."RolePermission"
("RoleId", "PermissionId", "TenantId")
select anr."Id", '8b398cbe-b59a-4490-8277-1a567ba30ca9', '39077d0e-e443-4076-aaf2-978dc6805aa0'
from "AspNetRoles" anr
where anr."Name" in ('Team Lead','Administrator','Super Admin');


-- Add new districtId to league
ALTER TABLE public."League" add "DistrictId" uuid null;
ALTER TABLE public."League" ADD CONSTRAINT "FK_League_DistrictId" FOREIGN KEY ("DistrictId") REFERENCES "District"("Id");