CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

insert into "AspNetRoles" ("Id", "Name", "NormalizedName", "ConcurrencyStamp", "TenantId")
values (uuid_generate_v4(), 'Team Lead', 'TEAM LEAD', uuid_generate_v4(), (select t."Id" from "Tenant" t where t."ApplicationName" = 'GrowGreat'))