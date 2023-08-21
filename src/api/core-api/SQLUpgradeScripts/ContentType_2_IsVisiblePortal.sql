alter table "ContentType"
add column if not exists "IsVisiblePortal" bool not null DEFAULT false,
add column if not exists "PortalDisplayOrder" int4 not null DEFAULT -1;

update "ContentType" ct 
set "Description" = 'Community Connect Section'
where ct."Description" = 'Community Connect Section GG'
	or ct."Description" = 'Community Connect Section SS';

update "ContentType" ct
set "Description" = 'Community Connect Section Item'
where ct."Description" = 'Community Connect Section Item GG'
	or ct."Description" = 'Community Connect Section Item SS';

update "ContentType" 
set "IsVisiblePortal" = true
where "Name" in (
	'Consent',
	'HealthPromotion',
	'CommunitySectionItemGG',
	'CommunitySectionItemSS',
	'CommunitySectionSS',
	'CommunitySectionGG',
	'Theme',
	'MoreInformation');

update "ContentType" 
set "PortalDisplayOrder" = 1
where "Name" = 'Consent';

update "ContentType" 
set "PortalDisplayOrder" = 2
where "Name" = 'HealthPromotion';

update "ContentType" 
set "PortalDisplayOrder" = 3
where "Name" = 'CommunitySectionItemGG' 
	or	"Name" = 'CommunitySectionItemSS';

update "ContentType" 
set "PortalDisplayOrder" = 4
where "Name" = 'MoreInformation';