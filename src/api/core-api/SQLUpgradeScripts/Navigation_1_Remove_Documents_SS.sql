update "Navigation"
set "TenantId" = (select "Id" from "Tenant" t where t."ApplicationName" = 'GrowGreat')
where "Name" = 'Documents'
 