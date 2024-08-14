update "Permission" p set "IsActive" = false where "TenantId"  is not null;
delete from "Permission" where "IsActive" = false;
