-- TODO: Add to Tenant Creation?
-- Add deafult system settings for SMTP Message Provider

insert into "SystemSetting" ("Id", "Grouping", "FullPath", "Name", "Value", "InsertedDate", "UpdatedDate", "IsSystemValue", "IsActive", "TenantId")
select gen_random_uuid(), s.*, t."Id" 
from (select "Id" from "Tenant") t,
	 (values
		('Notifications.EmailProviders.Smtp', 'Notifications.EmailProviders.Smtp.Username', 'Username', 'tenant_emailsmtpservice_username', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true),
		('Notifications.EmailProviders.Smtp', 'Notifications.EmailProviders.Smtp.Password', 'Password', 'tenant_password_secret', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true),
		('Notifications.EmailProviders.Smtp', 'Notifications.EmailProviders.Smtp.FromEmail', 'FromEmail', 'sender@ecdconnect.com', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true),
		('Notifications.EmailProviders.Smtp', 'Notifications.EmailProviders.Smtp.FromEmailDisplayName', 'FromEmailDisplayName', 'ECD Connect', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true),
		('Notifications.EmailProviders.Smtp', 'Notifications.EmailProviders.Smtp.SmtpServerAddress', 'SmtpServerAddress', 'smtp.ecdconnect.com', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true),
		('Notifications.EmailProviders.Smtp', 'Notifications.EmailProviders.Smtp.SmtpServerPort', 'SmtpServerPort', '587', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true),
		('Notifications.EmailProviders.Smtp', 'Notifications.EmailProviders.Smtp.SmtpServerSecondaryAddress', 'SmtpServerSecondaryAddress', 'smtp2.ecdconnect.com', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true),
		('Notifications.EmailProviders.Smtp', 'Notifications.EmailProviders.Smtp.SmtpServerSecondaryPort', 'SmtpServerSecondaryPort', '587', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true),
		('Notifications.EmailProviders.Smtp', 'Notifications.EmailProviders.Smtp.RetryCount', 'RetryCount', '3', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true),
		('Notifications.EmailProviders.Smtp', 'Notifications.EmailProviders.Smtp.RetryWaitMiliseconds', 'RetryWaitMiliseconds', '300', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true),
		('Notifications.EmailProviders.Smtp', 'Notifications.EmailProviders.Smtp.SmtpServerUseTLS', 'SmtpServerUseTLS', 'true', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true)	
	)