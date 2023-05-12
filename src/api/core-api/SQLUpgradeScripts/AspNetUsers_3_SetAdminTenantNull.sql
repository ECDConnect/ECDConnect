-- Fix admin Tenant
update "AspNetUsers"
set "TenantId" = null
where "UserName" = 'admin';
