alter table "Tenant" add "GoogleAnalyticsTag" varchar(50);
alter table "Tenant" add "GoogleTagManager" varchar(50);

-- These tags only work for dev, need new tags for QA, Staging, Prod
update "Tenant" set "GoogleAnalyticsTag" = 'G-VF3TSREHWE' where "ApplicationName" = 'ECD Connect' and current_database()  = 'ECDConnectDev';
update "Tenant" set "GoogleAnalyticsTag" = 'G-8QPZT8N80V' where "ApplicationName" = 'White Label' and current_database()  = 'ECDConnectDev';;

