-- dev
update "SystemSetting" ss set "Value" = 'https://ecd-connect-develop-portal.azurewebsites.net/reset'  where "Name" = 'ForgotPasswordPortal' and "Id" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update "SystemSetting" ss set "Value" = 'https://growgreat-develop-portal.azurewebsites.net/reset'  where "Name" = 'ForgotPasswordPortal' and "Id" = '393a6029-4184-4e2a-b233-771f8b30fe8b';
update "SystemSetting" ss set "Value" = 'https://whitelabel-develop-portal.azurewebsites.net/reset'  where "Name" = 'ForgotPasswordPortal' and "Id" = '87ea2b77-babf-411a-8202-60c8759cd718';
--QA
update "SystemSetting" ss set "Value" = 'https://ecd-connect-qa-portal.azurewebsites.net/reset'  where "Name" = 'ForgotPasswordPortal' and "Id" = '09311c2b-854b-430e-b725-10d1d6fb2f96';
update "SystemSetting" ss set "Value" = 'https://growgreat-qa-portal.azurewebsites.net/reset'  where "Name" = 'ForgotPasswordPortal' and "Id" = 'cf7fbdff-605e-4371-a733-27244390dcc9';
update "SystemSetting" ss set "Value" = 'https://whitelabel-qa-portal.azurewebsites.net/reset'  where "Name" = 'ForgotPasswordPortal' and "Id" = '372ca9a1-c14d-40db-b6f0-9b3fb6d918bf';
	
--production
update "SystemSetting" ss set "Value" = 'https://portal.chwconnect.ecdconnect.co.za/reset'  where "Name" = 'ForgotPasswordPortal' and "Id" = 'c9a6a93b-a01f-49a2-a261-d54370f9342a';
update "SystemSetting" ss set "Value" = 'https://whitelabel-qa-portal.azurewebsites.net/reset'  where "Name" = 'ForgotPasswordPortal' and "Id" = '8ed8507d-dee4-4372-9611-eedc4b841594';

--QA
update "SystemSetting" ss set "Value" = 'https://growgreat-qa-portal.azurewebsites.net/team-lead-register/'  where "Name" = 'TeamLeadSignup' and "Id" = '110f63b1-7a81-407e-bec1-b1561377dae0';
