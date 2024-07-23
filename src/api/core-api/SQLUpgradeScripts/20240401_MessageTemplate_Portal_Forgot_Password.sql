UPDATE public."MessageTemplate"
SET "Message" = 'Hi [[FirstName]],

We received a request to reset your [[OrganisationName]] password. Go to this link to reset your password: [[PasswordResetLink:shorturl]]'
WHERE
"TemplateType" = 'forgot-password';	

