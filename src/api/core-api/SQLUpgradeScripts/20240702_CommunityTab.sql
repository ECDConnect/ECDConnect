alter table "Practitioner" 
add column if not exists "ClickedCommunityTab" bool NULL DEFAULT false,
add column if not exists "CommunitySectionViewDate" timestamp NULL;
