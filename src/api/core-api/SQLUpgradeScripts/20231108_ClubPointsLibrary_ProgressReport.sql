ALTER TABLE public."ClubPointsLibrary" ADD "SubActivity" text NULL;

INSERT INTO public."ClubPointsLibrary"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Type", "Activity", "SubActivity", "Description", "Points", "MaxPointsYearly", "CalculatedAtMonthEnd", "CalculatedAtYearEnd")
VALUES('e8f2760d-213c-4cf3-9356-7bd8dfd7d2f6', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '258a15e6-3736-45ea-875c-48d9377de4c8', 'Purple', 'Complete child progress reports', 'Caregiver meeting', '', 0, 100, true, false);

update "ClubPointsLibrary" set "SubActivity" = 'Progress tracking' where "Id" = 'aa402bc7-cd1c-41c6-8bd6-3eb96a1154ed';
update "ClubPointsLibrary" set "Points" = 50 where "Id" = 'aa402bc7-cd1c-41c6-8bd6-3eb96a1154ed';
update "ClubPointsLibrary" set "Points" = 50 where "Id" = 'e8f2760d-213c-4cf3-9356-7bd8dfd7d2f6';