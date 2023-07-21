/* 
select * from "SystemSetting" ss where lower("FullPath") like '%sms%' order by "TenantId", "FullPath" ;

select "TenantId", "FullPath", "Value" 
from "SystemSetting" ss 
where ("FullPath" like 'Notifications.SMSProviders.Sms.Provider%' or "FullPath" like 'Notifications.SMSProviders.SMSPortal%' or "FullPath" like 'Notifications.SMSProviders.iTouch%')
and "TenantId" in ('258a15e6-3736-45ea-875c-48d9377de4c8','39077d0e-e443-4076-aaf2-978dc6805aa0')
order by "TenantId", "FullPath" ;
*/

-- SMS Config FundaApp (258a15e6-3736-45ea-875c-48d9377de4c8)
insert into "SystemSetting"
select 'c15c5753-b06f-4a66-964d-438ce38d44a5', 'Notifications.SMSProviders.Sms', 'Notifications.SMSProviders.Sms.Provider', 'Provider', 'Notifications.SMSProviders.iTouch', true, true, now(), now(), null, '258a15e6-3736-45ea-875c-48d9377de4c8'
where not exists(select * from "SystemSetting" where "Id" = 'c15c5753-b06f-4a66-964d-438ce38d44a5');

-- iTouch FundaApp (258a15e6-3736-45ea-875c-48d9377de4c8)
insert into "SystemSetting"
select '9e68d2f1-00de-43ee-b9b6-6b4f49cf57e7', 'Notifications.SMSProviders.iTouch', 'Notifications.SMSProviders.iTouch.BaseUrl', 'BaseUrl', 'https://iweb.itouch.co.za', true, true, now(), now(), null, '258a15e6-3736-45ea-875c-48d9377de4c8'
where not exists(select * from "SystemSetting" where "Id" = '9e68d2f1-00de-43ee-b9b6-6b4f49cf57e7');

insert into "SystemSetting"
select 'd52bb9df-f1f1-47e5-8290-7fd5687b9695', 'Notifications.SMSProviders.iTouch', 'Notifications.SMSProviders.iTouch.Username', 'Username', 'SmartSt1', true, true, now(), now(), null, '258a15e6-3736-45ea-875c-48d9377de4c8'
where not exists(select * from "SystemSetting" where "Id" = 'd52bb9df-f1f1-47e5-8290-7fd5687b9695');

insert into "SystemSetting"
select 'b228e41d-b999-40f5-acab-2c3b28bfc670', 'Notifications.SMSProviders.iTouch', 'Notifications.SMSProviders.iTouch.Password', 'Password', '4y34wRop', true, true, now(), now(), null, '258a15e6-3736-45ea-875c-48d9377de4c8'
where not exists(select * from "SystemSetting" where "Id" = 'b228e41d-b999-40f5-acab-2c3b28bfc670');


-- select uuid_generate_v4();
-- SMS Config GrowGreat (39077d0e-e443-4076-aaf2-978dc6805aa0)
insert into "SystemSetting"
select '03d250a0-da92-4f22-8b73-98ed85c8f1cb', 'Notifications.SMSProviders.Sms', 'Notifications.SMSProviders.Sms.Provider', 'Provider', 'Notifications.SMSProviders.SMSPortal', true, true, now(), now(), null, '39077d0e-e443-4076-aaf2-978dc6805aa0'
where not exists(select * from "SystemSetting" where "Id" = '03d250a0-da92-4f22-8b73-98ed85c8f1cb');

-- SMSPortal.com (39077d0e-e443-4076-aaf2-978dc6805aa0)
insert into "SystemSetting"
select 'd73d39c2-cbda-4651-b8d9-833579c7c47a', 'Notifications.SMSProviders.SMSPortal', 'Notifications.SMSProviders.SMSPortal.BaseUrl', 'BaseUrl', 'https://rest.smsportal.com', true, true, now(), now(), null, '39077d0e-e443-4076-aaf2-978dc6805aa0'
where not exists(select * from "SystemSetting" where "Id" = 'd73d39c2-cbda-4651-b8d9-833579c7c47a');

insert into "SystemSetting"
select 'f9255f50-0f31-49aa-8d83-26005d897276', 'Notifications.SMSProviders.SMSPortal', 'Notifications.SMSProviders.SMSPortal.ApiKey', 'ApiKey', '63b4589f-efed-4b49-9fbd-edaa60be300b', true, true, now(), now(), null, '39077d0e-e443-4076-aaf2-978dc6805aa0'
where not exists(select * from "SystemSetting" where "Id" = 'f9255f50-0f31-49aa-8d83-26005d897276');

insert into "SystemSetting"
select '20677b43-8a3c-4949-92ae-1471448683e0', 'Notifications.SMSProviders.SMSPortal', 'Notifications.SMSProviders.SMSPortal.ApiSecret', 'ApiSecret', '18ee8e01-c074-4262-a76f-a7dab647a7cd', true, true, now(), now(), null, '39077d0e-e443-4076-aaf2-978dc6805aa0'
where not exists(select * from "SystemSetting" where "Id" = '20677b43-8a3c-4949-92ae-1471448683e0');


-- SMS Config White Label (ded52f9f-2603-40d8-ae49-0525121096e6)
-- select uuid_generate_v4();
insert into "SystemSetting"
select '1d0764c0-465f-40bd-ad0b-3be685c929dd', 'Notifications.SMSProviders.Sms', 'Notifications.SMSProviders.Sms.Provider', 'Provider', 'Notifications.SMSProviders.BulkSMS', true, true, now(), now(), null, 'ded52f9f-2603-40d8-ae49-0525121096e6'
where not exists(select * from "SystemSetting" where "Id" = '1d0764c0-465f-40bd-ad0b-3be685c929dd');

/*
update "SystemSetting" set "Value"='Notifications.SMSProviders.BulkSms'   
where "FullPath"='Notifications.SMSProviders.Sms.Provider';

update "SystemSetting" set "Value"='Notifications.SMSProviders.iTouch'    
where "FullPath"='Notifications.SMSProviders.Sms.Provider' and "TenantId"='258a15e6-3736-45ea-875c-48d9377de4c8';

update "SystemSetting" set "Value"='Notifications.SMSProviders.SMSPortal' 
where "FullPath"='Notifications.SMSProviders.Sms.Provider' and "TenantId"='39077d0e-e443-4076-aaf2-978dc6805aa0';
*/