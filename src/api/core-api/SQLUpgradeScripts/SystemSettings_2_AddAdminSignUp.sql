--insert into "SystemSettings"
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

insert into "SystemSetting" ("Id", "Value", "TenantId", "Grouping", "FullPath", "Name", "InsertedDate", "UpdatedDate", "IsSystemValue", "IsActive")
select uuid_generate_v4(), t."Value", t."Id", s.*
from (select "Id", 'https://' || "AdminSiteAddress" || '/register/' "Value" from "Tenant") t,
 (values
	('General.Callback.Invitations', 'General.Callback.Invitations.AdminSignup', 'AdminSignup', NOW(), TIMESTAMP '0001-01-01 00:00:00.000', true, true)
) s
