


alter table "UserGrants" add column "InsertedDate" TIMESTAMP not null DEFAULT NOW();
alter table "UserGrants" add column "UpdatedDate" TIMESTAMP null;
alter table "UserGrants" add column "UpdatedBy" text;
alter table "UserGrants" add column "IsActive" bool DEFAULT TRUE;
alter table "UserGrants" add column "Id"  uuid DEFAULT null;