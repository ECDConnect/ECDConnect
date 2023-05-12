-- Fix debug settings for GrowGreat
update "Tenant" 
set "AdminTestSiteAddress" = 'localhost:3003'
where "AdminTestSiteAddress" = 'localhost:3002' and "ApplicationName" = 'GrowGreat';