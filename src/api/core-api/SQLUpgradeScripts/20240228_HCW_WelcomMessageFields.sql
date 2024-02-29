alter table public."HealthCareWorker" add "IsNewAtClinic" bool not null default true;
alter table public."HealthCareWorker" add "ShareContactInfo" bool not null default false;
alter table public."HealthCareWorker" add "WelcomeMessage" text null;