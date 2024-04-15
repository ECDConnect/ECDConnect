-- There should be no-one with email as a contact preference?
select "Id", "UserName", "Email", "ContactPreference"  from "AspNetUsers" anu where "ContactPreference" = 'email';

-- select distinct "FullPath"  from "SystemSetting" ss where "FullPath" like '%Email%' order by 1;

-- Delete old SendGrid config values
delete from "SystemSetting" where "FullPath" like 'Notifications.EmailProviders.SendGrid.%';

-- GG 
update "SystemSetting" set "Value" = 'CHW Connect'                       where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'FromEmailDisplayName';
update "SystemSetting" set "Value" = '587'                               where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'SmtpServerPort';
update "SystemSetting" set "Value" = '300'                               where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'RetryWaitMiliseconds';
update "SystemSetting" set "Value" = 'true'                              where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'SmtpServerUseTLS';
update "SystemSetting" set "Value" = 'no-reply@ecdconnect.co.za'         where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'Username';
update "SystemSetting" set "Value" = 'ck7N6H45D2R78@3q^4NJf'             where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'Password';
update "SystemSetting" set "Value" = 'no-reply@ecdconnect.co.za'         where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'FromEmail';
update "SystemSetting" set "Value" = 'za-smtp-outbound-1.mimecast.co.za' where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'SmtpServerAddress';
update "SystemSetting" set "Value" = 'za-smtp-outbound-2.mimecast.co.za' where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'SmtpServerSecondaryAddress';
update "SystemSetting" set "Value" = '2'                                 where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'RetryCount';
update "SystemSetting" set "Value" = '0'                                 where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'SmtpServerSecondaryPort';
update "SystemSetting" set "Value" = ''                                  where "TenantId" = '39077d0e-e443-4076-aaf2-978dc6805aa0' and "Name" = 'DevOverrideEmailAddress';

-- SS 
update "SystemSetting" set "Value" = 'Funda App'                         where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'FromEmailDisplayName';
update "SystemSetting" set "Value" = '587'                               where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'SmtpServerPort';
update "SystemSetting" set "Value" = '300'                               where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'RetryWaitMiliseconds';
update "SystemSetting" set "Value" = 'true'                              where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'SmtpServerUseTLS';
update "SystemSetting" set "Value" = 'no-reply@ecdconnect.co.za'         where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'Username';
update "SystemSetting" set "Value" = 'ck7N6H45D2R78@3q^4NJf'             where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'Password';
update "SystemSetting" set "Value" = 'no-reply@ecdconnect.co.za'         where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'FromEmail';
update "SystemSetting" set "Value" = 'za-smtp-outbound-1.mimecast.co.za' where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'SmtpServerAddress';
update "SystemSetting" set "Value" = 'za-smtp-outbound-2.mimecast.co.za' where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'SmtpServerSecondaryAddress';
update "SystemSetting" set "Value" = '2'                                 where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'RetryCount';
update "SystemSetting" set "Value" = '0'                                 where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'SmtpServerSecondaryPort';
update "SystemSetting" set "Value" = ''                                  where "TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8' and "Name" = 'DevOverrideEmailAddress';

-- WL/OA
update "SystemSetting" set "Value" = 'ECD Connect'                       where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'FromEmailDisplayName';
update "SystemSetting" set "Value" = '587'                               where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'SmtpServerPort';
update "SystemSetting" set "Value" = '300'                               where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'RetryWaitMiliseconds';
update "SystemSetting" set "Value" = 'true'                              where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'SmtpServerUseTLS';
update "SystemSetting" set "Value" = 'no-reply@ecdconnect.co.za'         where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'Username';
update "SystemSetting" set "Value" = 'ck7N6H45D2R78@3q^4NJf'             where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'Password';
update "SystemSetting" set "Value" = 'no-reply@ecdconnect.co.za'         where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'FromEmail';
update "SystemSetting" set "Value" = 'za-smtp-outbound-1.mimecast.co.za' where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'SmtpServerAddress';
update "SystemSetting" set "Value" = 'za-smtp-outbound-2.mimecast.co.za' where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'SmtpServerSecondaryAddress';
update "SystemSetting" set "Value" = '2'                                 where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'RetryCount';
update "SystemSetting" set "Value" = '0'                                 where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'SmtpServerSecondaryPort';
update "SystemSetting" set "Value" = ''                                  where "TenantId" = 'ded52f9f-2603-40d8-ae49-0525121096e6' and "Name" = 'DevOverrideEmailAddress';
