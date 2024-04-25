INSERT INTO public."Navigation"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Sequence", "Name", "Icon", "Route", "Description", "TenantId")
VALUES('64eaee25-b234-4353-9afc-ba71dcec4960', true, Current_date, Current_date, '', 4, 'TL Meetings', 'ChartSquareBarIcon', '/tl-meetings', 'TL Meetings', '39077d0e-e443-4076-aaf2-978dc6805aa0');


INSERT INTO public."Navigation"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Sequence", "Name", "Icon", "Route", "Description", "TenantId")
VALUES('f7a94a47-04e4-4f09-840f-6bc14b488b92', true, Current_date, Current_date, '', 5, 'League', 'trophy.svg', '/tl-league', 'League', '39077d0e-e443-4076-aaf2-978dc6805aa0');


update "SystemSetting" ss set "Value" = 'https://ecd-connect-develop-portal.azurewebsites.net/reset'  where "Name" = 'ForgotPasswordPortal' and "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8';
update "SystemSetting" ss set "Value" = 'https://growgreat-develop-portal.azurewebsites.net/reset'  where "Name" = 'ForgotPasswordPortal' and "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0';
update "SystemSetting" ss set "Value" = 'https://whitelabel-develop-portal.azurewebsites.net/reset'  where "Name" = 'ForgotPasswordPortal' and "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6';