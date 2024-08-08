
update "Navigation" set "Sequence" = 1 where "Name" = 'Dashboard';
update "Navigation" set "Sequence" = 2 where "Name" = 'Roles & Permissions';
update "Navigation" set "Sequence" = 3 where "Name" = 'Users';
update "Navigation" set "Sequence" = 4 where "Name" = 'Documents';
update "Navigation" set "Sequence" = 5 where "Name" = 'Content Management';
update "Navigation" set "Sequence" = 6 where "Name" = 'Reporting';
update "Navigation" set "Sequence" = 7 where "Name" = 'Messaging';
update "Navigation" set "Sequence" = 8 where "Name" = 'Site data';
update "Navigation" set "Sequence" = 9 where "Name" = 'Settings';

update "Navigation" set "IsActive" = false where "Name" in ('Clinics', 'Referrals', 'TL Meetings', 'League');

update "Navigation" set "TenantId" = null where "Name" = 'Documents';