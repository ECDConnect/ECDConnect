CREATE TABLE IF NOT EXISTS "AppLog"
(
"Id" uuid NOT NULL PRIMARY KEY,
"InsertedDate" timestamp NOT NULL,
"UserId" uuid NULL,
"Details" text null,
"EventDate" timestamp not null
);