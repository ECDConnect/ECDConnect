update "SystemSetting" set "Value"='https://ecdconnect-qa-portal.azurewebsites.net/register' where "Name"= 'AdminSignup' and "TenantId"= '258a15e6-3736-45ea-875c-48d9377de4c8';
update "SystemSetting" set "Value"='https://whitelabel-qa-portal.azurewebsites.net/register' where "Name"= 'AdminSignup' and "TenantId"= 'e8f571eb-1972-4e71-a20f-347c65d059bb';

-- production server?
-- update "SystemSetting" set "Value"='https://ecdconnect-qa-portal.azurewebsites.net/register' where "Name"= 'AdminSignup' and "TenantId"= '258a15e6-3736-45ea-875c-48d9377de4c8';
-- update "SystemSetting" set "Value"='https://whitelabel-qa-portal.azurewebsites.net/register' where "Name"= 'AdminSignup' and "TenantId"= 'e8f571eb-1972-4e71-a20f-347c65d059bb';


