
UPDATE public."MessageTemplate"	SET "Message"='Hi [[FirstName]],

We received a request to reset your password. Go to this link to reset your password: [[PasswordResetLink:shorturl]]' WHERE "TemplateType" = 'forgot-password-portal' AND "Protocol" = 'sms'
