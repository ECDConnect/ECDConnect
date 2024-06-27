-- QA
update "SystemSetting" 
set "Value" = 'https://ecdconnect-qa-app.azurewebsites.net/oa-sign-up-or-login'
where "Id" = '378b8757-c0a8-4296-8b9b-76fc6cdc2249';
update "SystemSetting" 
set "Value" = 'https://whitelabel-qa-app.azurewebsites.net/login'
where "Id" = 'a86d7019-24d3-4e9b-b609-90be7c0e3951';


-- Production
-- update "SystemSetting" 
-- set "Value" = 'https://ecdconnect-app.azurewebsites.net/oa-sign-up-or-login'
-- where "Id" = '378b8757-c0a8-4296-8b9b-76fc6cdc2249';
-- update "SystemSetting" 
-- set "Value" = 'https://whitelabel-app.azurewebsites.net/login'
-- where "Id" = 'a86d7019-24d3-4e9b-b609-90be7c0e3951';