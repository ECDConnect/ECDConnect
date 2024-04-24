ALTER TABLE public."TeamLead" ADD "WelcomeMessage" text NULL;

INSERT INTO public."RolePermission"
("RoleId", "PermissionId", "TenantId")
VALUES('04bfd94a-ef0d-41ee-8688-e4c1046be09c', '417798c9-c713-4a76-89ba-2cebd2505f62', '39077d0e-e443-4076-aaf2-978dc6805aa0');
