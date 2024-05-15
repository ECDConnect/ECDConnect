INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('46c3e9a4-de41-4d09-8cd5-3883d69a825f'::uuid, true, '2024-05-15 00:00:00.000', '0001-01-01 00:00:00.000', NULL, 'email', 'admin-user-help-form', 'Hello,

A new form submission has been received from the [[ApplicationName]] help form.

Details:
- User full name: [[AffectedUserFullName]]
- Contact: [[HelpContactDetail]]
- Help category: [[HelpSubject]]
- Description: [[HelpDescription]]
- Was the user logged in? [[HelpLoginStatus]]

Thank you, 
[[OrganisationName]]', NULL, '[[ApplicationName]] - help form submission', NULL, NULL, NULL, NULL, 0, NULL);