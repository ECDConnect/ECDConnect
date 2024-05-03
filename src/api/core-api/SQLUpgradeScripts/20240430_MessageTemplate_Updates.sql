	UPDATE public."MessageTemplate"
	SET "Message"=E'Hi [[FirstName]]. You haven\'t gone online on CHW Connect in 4 weeks! You won\'t be able to use the app until you go online: [[LoginLink:shorturl]]' 
	where "TemplateType" = 'four-week-notification' and "Protocol" = 'sms' and "TenantId"='39077d0e-e443-4076-aaf2-978dc6805aa0';

	UPDATE public."MessageTemplate"
	SET "Message"=E'Hi [[FirstName]]. You haven\'t gone online on CHW Connect in 3 weeks! You won\'t be able to use the app until you go online: [[LoginLink:shorturl]]'
	where "TemplateType" = 'three-week-notification' and "Protocol" = 'sms' and "TenantId"='39077d0e-e443-4076-aaf2-978dc6805aa0';
