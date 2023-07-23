-- Fix admin Tenant
update "AspNetRoles"
set "Name" = 'Community Health Worker', 
	"NormalizedName" = 'COMMUNITY HEALTH WORKER'
where "Name" = 'Health Care Worker';
